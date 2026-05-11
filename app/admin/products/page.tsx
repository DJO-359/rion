"use client";

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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Drag & Drop
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

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    } else {
      alert("Пожалуйста, выберите изображение");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
  };

  const createProduct = async () => {
    if (!title || !price || !category || !file) {
      alert("Заполните все поля и добавьте фото!");
      return;
    }

    setUploading(true);
    let imageUrl = "";

    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const safeFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(safeFileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(safeFileName);
      imageUrl = urlData.publicUrl;

      const { error: insertError } = await supabase.from("products").insert({
        title: title.trim(),
        price: parseFloat(price),
        category,
        image: imageUrl,
      });

      if (insertError) throw insertError;

      alert("✅ Товар успешно добавлен!");

      setTitle("");
      setPrice("");
      setCategory("");
      removeImage();
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      alert("Ошибка: " + (error.message || "Неизвестная ошибка"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10">
        Админка — Управление товарами
      </h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Добавить новый товар</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Фото */}
          <div>
            <label className="block text-sm text-zinc-400 mb-3">
              Изображение товара *
            </label>
            <div
              className={`border-2 border-dashed rounded-3xl h-[420px] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden
                ${isDragging ? "border-violet-500 bg-violet-500/10" : "border-zinc-700 hover:border-zinc-600"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-3 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={64} className="mx-auto mb-6 text-zinc-500" />
                  <p className="text-xl">Перетащите фото сюда</p>
                  <p className="text-zinc-500 mt-2">
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

          {/* Поля ввода */}
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Название товара *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg"
            />

            <input
              type="number"
              placeholder="Цена в рублях *"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg"
            >
              <option value="">Выберите категорию *</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={createProduct}
              disabled={uploading || !title || !price || !category || !file}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 py-5 rounded-2xl text-xl font-medium mt-4"
            >
              {uploading ? "Загрузка..." : "Добавить товар"}
            </button>
          </div>
        </div>
      </div>

      {/* Список товаров */}
      <h2 className="text-2xl font-semibold mb-6">
        Все товары ({products.length})
      </h2>
      {/* ... список товаров остаётся тот же ... */}
    </div>
  );
}
