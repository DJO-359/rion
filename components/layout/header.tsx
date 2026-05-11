export function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#07111F]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[86px] max-w-[1440px] items-center justify-between px-4 md:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D6A85F] bg-white">
            <span className="text-2xl font-bold text-black">R</span>
          </div>

          <div className="leading-none">
            <div className="text-[34px] font-semibold tracking-wide text-white">
              RION
            </div>

            <div className="mt-1 text-xs text-white/70">
              Ваш дом, наш дизайн
            </div>
          </div>
        </div>

        {/* CENTER */}
        <nav className="hidden items-center gap-10 lg:flex">
          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Плитка
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Ламинат
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Сантехника
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Смесители
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Люстры
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-white transition hover:text-[#D6A85F]"
          >
            Ковры
          </a>

          <a
            href="#"
            className="text-[15px] font-medium text-[#D6A85F] transition"
          >
            Акции
          </a>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <div className="hidden text-right lg:block">
            <div className="text-lg font-semibold text-white">
              +7 (928) 555-33-55
            </div>

            <div className="mt-1 text-sm text-white/70">c 9:00 до 20:00</div>
          </div>

          <button className="rounded-xl bg-[#D6A85F] px-18 py-12 text-sm font-semibold text-black transition hover:bg-[#e4b66c]">
            Узнать наличие
          </button>
        </div>
      </div>
    </header>
  );
}
