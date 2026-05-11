"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function RequestModal({
  isOpen,
  onClose,
  productName,
}: RequestModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Здесь будет отправка заявки (пока просто имитация)
    setTimeout(() => {
      setIsSubmitted(true);

      // Сброс формы через 3 секунды и закрытие модалки
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({ name: "", phone: "", comment: "" });
      }, 2500);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-gray-800 rounded-3xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-semibold text-white">
            {isSubmitted ? "Заявка отправлена!" : "Оставить заявку"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {productName && (
                <div className="text-sm text-[#d4af37] bg-gray-900 p-3 rounded-2xl">
                  Товар: <span className="font-medium">{productName}</span>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-gray-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#d4af37] text-white"
                  placeholder="Как к вам обращаться"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-gray-700 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#d4af37] text-white"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">
                  Комментарий
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-gray-700 rounded-3xl px-5 py-4 h-28 resize-y focus:outline-none focus:border-[#d4af37] text-white"
                  placeholder="Что вас интересует? (размер, цвет, наличие и т.д.)"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#d4af37] hover:bg-[#c19a2f] text-black font-semibold py-4 rounded-2xl transition-all active:scale-[0.985]"
              >
                Отправить заявку
              </button>

              <p className="text-center text-xs text-gray-500">
                Менеджер свяжется с вами в течение 15 минут
              </p>
            </form>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-3">Спасибо!</h3>
              <p className="text-gray-400">
                Ваша заявка успешно отправлена.
                <br />
                Наш менеджер скоро свяжется с вами.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
