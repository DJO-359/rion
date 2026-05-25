"use client";
//15:42 25/05
import { useState, useEffect } from "react";
import { supabase } from "@/shared/lib/supabase";
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
  const [products, setProducts] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [brand, setBrand] = useState("");

  const [country, setCountry] = useState("");

  const [size, setSize] = useState("");

  const [material, setMaterial] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [active, setActive] = useState(true);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DRAG OVER
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // DRAG LEAVE
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // DROP
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);

      setPreview(URL.createObjectURL(droppedFile));
    } else {
      alert("Пожалуйста, выберите изображение");
    }
  };

  // SELECT FILE
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);

      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // REMOVE IMAGE
  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setFile(null);
  };

  // SAVE PRODUCT
  const saveProduct = async () => {
    try {
      setUploading(true);

      let imageUrl = preview || "";

      // UPLOAD IMAGE
      if (file) {
        const fileExt = file.name.split(".").pop();

        const fileName = `${Date.now()}.${fileExt}`;

        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (uploadError) {
          console.error(uploadError);

          alert("Ошибка загрузки изображения");

          return;
        }

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // UPDATE
      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update({
            title,
            price,
            category,
            image: imageUrl,
            active,

            description,
            brand,
            country,
            size,
            material,
          })
          .eq("id", editingId);

        if (error) {
          console.error(error);

          alert("Ошибка обновления");

          return;
        }

        alert("Товар обновлён");
      }

      // CREATE
      else {
        const { error } = await supabase.from("products").insert([
          {
            title,
            price,
            category,
            image: imageUrl,
            active,
            description,
            brand,
            country,
            size,
            material,
          },
        ]);

        if (error) {
          console.error(error);

          alert("Ошибка создания");

          return;
        }

        alert("Товар добавлен");
      }

      // RESET
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");

      setBrand("");

      setCountry("");

      setSize("");

      setMaterial("");

      setPreview(null);

      setFile(null);

      setEditingId(null);

      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* TITLE */}
      <h1 className="mb-10 text-4xl font-bold">
        Админка — Управление товарами
      </h1>

      {/* FORM */}
      <div className="mb-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          {editingId ? "Редактирование товара" : "Добавить новый товар"}
        </h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* IMAGE */}
          <div>
            <label className="mb-3 block text-sm text-zinc-400">
              Изображение товара *
            </label>

            <div
              className={`relative flex h-[420px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all
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
              {preview ? (
                <div className="relative h-full w-full">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      removeImage();
                    }}
                    className="absolute right-4 top-4 rounded-full bg-red-600 p-3 transition-colors hover:bg-red-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={64} className="mx-auto mb-6 text-zinc-500" />

                  <p className="text-xl">Перетащите фото сюда</p>

                  <p className="mt-2 text-zinc-500">
                    или нажмите для выбора файла
                  </p>
                </div>
              )}
            </div>

            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* INPUTS */}
          <div className="space-y-6">
            {/* TITLE */}
            <input
              type="text"
              placeholder="Название товара *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />

            {/* PRICE */}
            <input
              type="number"
              placeholder="Цена в рублях *"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-4 text-lg"
            />

            {/* CATEGORY */}
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

            {/* BUTTON */}
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

      {/* PRODUCTS */}
      <h2 className="mb-6 text-2xl font-semibold">
        Все товары ({products.length})
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
          >
            {/* IMAGE */}
            <div className="h-[260px] overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5">
              <h3 className="text-xl font-semibold">{product.title}</h3>

              <p className="mt-2 text-violet-400">{product.price} ₽</p>

              <p className="mt-1 text-sm text-zinc-500">{product.category}</p>

              {/* ACTIONS */}
              <div className="mt-5 flex gap-3">
                {/* EDIT */}
                <button
                  onClick={() => {
                    setEditingId(product.id);

                    setTitle(product.title);

                    setPrice(product.price);

                    setCategory(product.category);

                    setPreview(product.image);

                    setDescription(product.description || "");

                    setBrand(product.brand || "");

                    setCountry(product.country || "");

                    setSize(product.size || "");

                    setMaterial(product.material || "");
                  }}
                  className="flex-1 rounded-2xl bg-zinc-800 py-3 transition hover:bg-zinc-700"
                >
                  Редактировать
                </button>

                {/* DELETE */}
                <button
                  onClick={async () => {
                    const confirmDelete = confirm("Удалить товар?");

                    if (!confirmDelete) return;

                    const { error } = await supabase
                      .from("products")
                      .delete()
                      .eq("id", product.id);

                    if (error) {
                      console.error("Ошибка удаления:", error);

                      alert("Ошибка удаления");
                    } else {
                      alert("Товар удалён");

                      fetchProducts();
                    }
                  }}
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
//main
