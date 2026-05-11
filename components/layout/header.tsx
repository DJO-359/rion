"use client";

import Link from "next/link";
import { Phone, Clock } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center text-black font-bold text-2xl">
            R
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">RION</div>
            <div className="text-xs text-gray-400 -mt-1">
              Ваш дом, наши решения
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/catalog"
            className="hover:text-[#d4af37] transition-colors"
          >
            Плитка
          </Link>
          <Link
            href="/catalog"
            className="hover:text-[#d4af37] transition-colors"
          >
            Ламинат
          </Link>
          <Link
            href="/catalog"
            className="hover:text-[#d4af37] transition-colors"
          >
            Сантехника
          </Link>
          <Link
            href="/catalog"
            className="hover:text-[#d4af37] transition-colors"
          >
            Смесители
          </Link>
          <Link
            href="/catalog"
            className="hover:text-[#d4af37] transition-colors"
          >
            Люстры
          </Link>
          <Link
            href="/catalog"
            className="hover:text-[#d4af37] transition-colors"
          >
            Ковры
          </Link>
          <Link href="#" className="text-[#d4af37]">
            Акции
          </Link>
        </nav>

        {/* Contacts */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-[#d4af37]" />
            <div>
              <div>+7 (928) 555-33-55</div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 9:00 — 20:00
              </div>
            </div>
          </div>

          <button className="bg-[#d4af37] hover:bg-[#c19a2f] text-black px-6 py-2.5 rounded-lg font-medium transition-colors">
            Узнать наличие
          </button>
        </div>
      </div>
    </header>
  );
}
