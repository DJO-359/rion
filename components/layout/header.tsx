import { Phone, MessageCircle, Menu } from "lucide-react";
import { Container } from "./container";

export function Header() {
  return (
    <Container>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#212c3b] backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[auto] items-center justify-around px-10 xl:px-16">
          {/* LEFT */}
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <img
                src="/not_logo.jpg"
                alt="RION"
                className="h-12 w-auto object-contain"
              />

              <span className="mt-1 text-xs tracking-wide text-white/50">
                Ваш дом, наш дизайн
              </span>
            </div>

            {/* MOBILE CATALOG */}
            <button className="flex items-center gap-3 rounded-2xl border border-[#C89B5E]/40 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-[#D6A85F] hover:bg-white/[0.06] lg:hidden">
              Каталог товаров
              <Menu size={18} className="text-[#D6A85F]" />
            </button>
          </div>

          {/* NAV */}
          <nav className="hidden items-center gap-10 xl:flex">
            {[
              "Плитка",
              "Ламинат",
              "Сантехника",
              "Смесители",
              "Люстры",
              "Ковры",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[15px] font-medium text-white/90 transition duration-300 hover:text-[#D6A85F]"
              >
                {item}
              </a>
            ))}

            <a href="#" className="text-[15px] font-semibold text-[#D6A85F]">
              Акции
            </a>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white transition hover:border-[#C89B5E]/50 hover:bg-white/[0.06]">
              <Phone size={18} />
            </button>

            <div className="hidden text-right lg:block">
              <div className="text-[22px] font-semibold tracking-tight text-white">
                +7 (963) 704-81-77
              </div>

              <div className="mt-1 text-sm text-white/50">c 9:00 до 20:00</div>
            </div>

            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C89B5E]/30 bg-[#C89B5E]/10 text-[#D6A85F] transition hover:bg-[#C89B5E]/20">
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </header>
    </Container>
  );
}
