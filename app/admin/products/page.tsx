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

  // Основные поля товара
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [country, setCountry] = useState("");
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");
  const [active, setActive] = useState(true);

  // Новые поля для скидки по времени
  const [discountStart, setDiscountStart] = useState("");
  const [discountEnd, setDiscountEnd] = useState("");
  const [discountUnlimited, setDiscountUnlimited] = useState(false);

  // Изображения
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

  // ----- Обработка изображений (drag & drop, выбор файлов) -----
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

  // ----- Сброс всей формы (включая новые поля) -----
  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategory("");
    setDescription("");
    setBrand("");
    setCountry("");
    setSize("");
    setMaterial("");
    setActive(true);
    setDiscountStart("");
    setDiscountEnd("");
    setDiscountUnlimited(false);
    clearAllImages();
    setEditingId(null);
  };

  // ----- Сохранение (создание / обновление) -----
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
        discount_start: discountStart || null,
        discount_end: discountEnd || null,
        discount_unlimited: discountUnlimited,
      };

      if (editingId) {
        // Редактирование
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
        // Создание нового
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

      resetForm(); // очищаем форму
      fetchProducts(); // обновляем список
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения товара");
    } finally {
      setUploading(false);
    }
  };

  // ----- Удаление -----
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

  // ----- Загрузка данных в форму для редактирования -----
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

    // Новые поля
    setDiscountStart(product.discount_start || "");
    setDiscountEnd(product.discount_end || "");
    setDiscountUnlimited(product.discount_unlimited ?? false);

    // Изображения
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

  // ----- Функции для работы со скидкой (процент) -----
  function calculateDiscountedPrice(
    basePrice: string | number,
    discountPercent: number,
  ) {
    const price = Number(basePrice);
    const discount = Number(discountPercent);

    if (!price || price <= 0) return null;
    if (Number.isNaN(discount) || discount < 0) return null;

    const discountedPrice = Math.round(price * (1 - discount / 100));
    return discountedPrice;
  }

  async function applyDiscountToProduct(
    product: Product,
    discountPercent: number,
  ) {
    const basePrice = product.old_price || product.price;
    const discountedPrice = calculateDiscountedPrice(
      basePrice,
      discountPercent,
    );

    if (discountedPrice === null) {
      alert("Не удалось рассчитать цену со скидкой");
      return;
    }

    await pb.collection("products").update(product.id, {
      old_price: product.old_price || product.price,
      discount_percent: discountPercent,
      price: String(discountedPrice),
    });
  }

  async function removeDiscountFromProduct(product: Product) {
    if (!product.old_price) return;

    await pb.collection("products").update(product.id, {
      price: product.old_price,
      old_price: "",
      discount_percent: 0,
    });
  }

  async function handleDiscountClick(product: Product) {
    const currentDiscount = product.discount_percent || 0;

    const value = window.prompt(
      "Введите скидку в процентах (0 = убрать скидку)",
      String(currentDiscount),
    );

    if (value === null) return;

    const discount = Number(value);

    if (Number.isNaN(discount) || discount < 0 || discount > 90) {
      alert("Введите корректную скидку от 0 до 90");
      return;
    }

    try {
      if (discount === 0) {
        await removeDiscountFromProduct(product);
      } else {
        await applyDiscountToProduct(product, discount);
      }
      await fetchProducts();
    } catch (error) {
      console.error("Ошибка при установке скидки:", error);
      alert("Не удалось обновить скидку");
    }
  }

  // ----- Рендеринг -----
  if (!authorized || authLoading) {
    return <div className="p-10 text-white">Загрузка...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-8 ">
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

      <div className="mb-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-white">
        <h2 className="mb-6 text-2xl font-semibold">
          {editingId ? "Редактирование товара" : "Добавить новый товар"}
        </h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Блок загрузки изображений (без изменений) */}
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

          {/* Блок ввода данных */}
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

            {/* Новый блок настройки срока скидки */}
            <div className="border-t border-zinc-700 pt-6 mt-4">
              <h3 className="text-lg font-medium mb-3">Настройки скидки</h3>

              <label className="flex items-center gap-3 text-lg mb-4">
                <input
                  type="checkbox"
                  checked={discountUnlimited}
                  onChange={(e) => setDiscountUnlimited(e.target.checked)}
                  className="h-5 w-5 rounded border-zinc-700 bg-zinc-800"
                />
                Бессрочная скидка (действует всегда)
              </label>

              {!discountUnlimited && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Дата начала
                    </label>
                    <input
                      type="datetime-local"
                      value={discountStart}
                      onChange={(e) => setDiscountStart(e.target.value)}
                      className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Дата окончания
                    </label>
                    <input
                      type="datetime-local"
                      value={discountEnd}
                      onChange={(e) => setDiscountEnd(e.target.value)}
                      className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-lg"
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-zinc-500 mt-2">
                Если скидка ограничена по времени, укажите начало и конец. При
                бессрочной – игнорируйте даты.
              </p>
            </div>

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

      {/* Список товаров */}
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
              <div className="mt-2">
                {product.old_price && Number(product.discount_percent) > 0 ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-zinc-500 line-through">
                      {product.old_price} ₽
                    </span>
                    <span className="text-lg font-semibold text-violet-400">
                      {product.price} ₽
                    </span>
                    <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-400">
                      -{product.discount_percent}%
                    </span>
                  </div>
                ) : (
                  <p className="text-violet-400">{product.price} ₽</p>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-500">{product.category}</p>

              {/* Отображение срока скидки (только для админа) */}
              <div className="mt-2 text-xs text-zinc-500">
                {product.discount_unlimited ? (
                  <span className="text-green-400">♾️ Бессрочная скидка</span>
                ) : product.discount_start && product.discount_end ? (
                  <>
                    <span>
                      🕒 {new Date(product.discount_start).toLocaleDateString()}
                    </span>
                    <span> – </span>
                    <span>
                      {new Date(product.discount_end).toLocaleDateString()}
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-600">Срок не задан</span>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => startEdit(product)}
                  className="flex-1 rounded-2xl bg-zinc-800 py-3 transition hover:bg-zinc-700"
                >
                  Редактировать
                </button>

                <button
                  onClick={() => handleDiscountClick(product)}
                  className="rounded-2xl bg-amber-500 px-4 py-3 text-black transition hover:bg-amber-400"
                >
                  Скидка
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
