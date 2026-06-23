"use client";
import { useState, useEffect } from "react";
import pb from "@/shared/lib/pocketbase";
import { adminLogout, useAdminAuth } from "@/shared/hooks/use-admin-auth";
import type { Product } from "@/shared/types/product";
import { Upload, X } from "lucide-react";

const categories = [
  "Плитка",
  "Ламинат",
  "Сантехника",
  "Смесители",
  "Люстры",
  "Ковры",
];

export default function AdminProducts() {
  const { authorized, loading: authLoading } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [country, setCountry] = useState("");
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");
  const [active, setActive] = useState(true);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (authorized) {
      fetchProducts();
    }
  }, [authorized]);

  const fetchProducts = async () => {
    try {
      const data = await pb.collection("products").getFullList<Product>({
        sort: "-created",
      });
      setProducts(data);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      setProducts([]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (droppedFiles.length) {
      setFiles((prev) => [...prev, ...droppedFiles]);
      const newPreviews = droppedFiles.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      alert("Пожалуйста, перетащите изображения");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (selectedFiles.length) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removePreview = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    if (index < existingImages.length) {
      const newExisting = [...existingImages];
      newExisting.splice(index, 1);
      setExistingImages(newExisting);
      const newPreviews = [...previews];
      newPreviews.splice(index, 1);
      setPreviews(newPreviews);
    } else {
      const fileIndex = index - existingImages.length;
      const newFiles = [...files];
      newFiles.splice(fileIndex, 1);
      setFiles(newFiles);
      const newPreviews = [...previews];
      newPreviews.splice(index, 1);
      setPreviews(newPreviews);
    }
  };

  const clearAllImages = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    setExistingImages([]);
  };

  const saveProduct = async () => {
    try {
      setUploading(true);

      const baseData = {
        title,
        price,
        category,
        description,
        brand,
        country,
        size,
        material,
        active,
      };

      if (editingId) {
        const formData = new FormData();
        Object.entries(baseData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        existingImages.forEach((imgName) => {
          formData.append("images", imgName);
        });
        files.forEach((file) => {
          formData.append("images", file);
        });
        await pb.collection("products").update(editingId, formData);
        alert("Товар обновлён");
      } else {
        if (files.length === 0) {
          alert("Добавьте хотя бы одно изображение");
          return;
        }
        const formData = new FormData();
        Object.entries(baseData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        files.forEach((file) => {
          formData.append("images", file);
        });
        await pb.collection("products").create(formData);
        alert("Товар добавлен");
      }

      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setBrand("");
      setCountry("");
      setSize("");
      setMaterial("");
      setActive(true);
      clearAllImages();
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения товара");
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Удалить товар?")) return;
    try {
      await pb.collection("products").delete(id);
      alert("Товар удалён");
      fetchProducts();
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка удаления");
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setPrice(product.price);
    setCategory(product.category);
    setDescription(product.description || "");
    setBrand(product.brand || "");
    setCountry(product.country || "");
    setSize(product.size || "");
    setMaterial(product.material || "");
    setActive(product.active ?? true);

    if (product.images && product.images.length) {
      const oldPreviews = product.images.map((img: string) =>
        pb.files.getURL(product, img),
      );
      setPreviews(oldPreviews);
      setExistingImages(product.images);
    } else {
      setPreviews([]);
      setExistingImages([]);
    }
    setFiles([]);
  };

  if (!authorized || authLoading) {
    return <div className="p-10 text-white">Загрузка...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Управление товарами</h1>
        <div className="flex gap-3">
          <a
            href="/admin"
            className="rounded-xl bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
          >
            Заявки
          </a>
          <button
            onClick={adminLogout}
            className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Выйти
          </button>
        </div>
      </div>

      <div className="mb-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          {editingId ? "Редактирование товара" : "Добавить новый товар"}
        </h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* IMAGE UPLOAD */}
          <div>
            <label className="mb-3 block text-sm text-zinc-400">
              Фотографии товара (можно несколько)
            </label>
            <div
              className={`relative flex min-h-[420px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all
              ${
                isDragging
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-zinc-700 hover:border-zinc-600"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {previews.length > 0 ? (
                <div className="relative w-full p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {previews.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`preview-${idx}`}
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePreview(idx);
                          }}
                          className="absolute top-2 right-2 rounded-full bg-red-600 p-1 opacity-0 transition group-hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {previews.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllImages();
                      }}
                      className="mt-3 text-sm text-red-400 hover:text-red-300"
                    >
                      Очистить все фото
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={64} className="mx-auto mb-6 text-zinc-500" />
                  <p className="text-xl">Перетащите фото сюда</p>
                  <p className="mt-2 text-zinc-500">
                    или нажмите для выбора файлов
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Можно выбрать несколько изображений
                  </p>
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* INPUTS */}
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Название товара *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />
            <input
              type="number"
              placeholder="Цена в рублях *"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            >
              <option value="">Выберите категорию *</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Бренд"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />
            <input
              type="text"
              placeholder="Страна"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />
            <input
              type="text"
              placeholder="Размер"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />
            <input
              type="text"
              placeholder="Материал"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />
            <textarea
              placeholder="Описание товара"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[140px] w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />
            <label className="flex items-center gap-3 text-lg">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-5 w-5 rounded border-zinc-700 bg-zinc-800"
              />
              Товар активен (отображается на сайте)
            </label>
            <button
              onClick={saveProduct}
              disabled={uploading || !title || !price || !category}
              className="mt-4 w-full rounded-2xl bg-violet-600 py-5 text-xl font-medium transition hover:bg-violet-700 disabled:bg-zinc-700"
            >
              {editingId ? "Сохранить изменения" : "Добавить товар"}
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <h2 className="mb-6 text-2xl font-semibold">
        Все товары ({products.length})
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
          >
            <div className="h-[260px] overflow-hidden">
              <img
                src={
                  product.images?.[0]
                    ? pb.files.getURL(product, product.images[0])
                    : "/placeholder.svg"
                }
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold">{product.title}</h3>
              <p className="mt-2 text-violet-400">{product.price} ₽</p>
              <p className="mt-1 text-sm text-zinc-500">{product.category}</p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => startEdit(product)}
                  className="flex-1 rounded-2xl bg-zinc-800 py-3 transition hover:bg-zinc-700"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="rounded-2xl bg-red-600 px-5 transition hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
