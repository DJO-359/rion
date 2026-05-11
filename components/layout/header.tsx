export function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between px-4 md:px-8">
        <div className="text-2xl font-bold">RION</div>

        <nav className="hidden gap-8 lg:flex">
          <a href="#">Плитка</a>
          <a href="#">Ламинат</a>
          <a href="#">Сантехника</a>
          <a href="#">Люстры</a>
          <a href="#">Ковры</a>
        </nav>

        <button className="rounded-xl bg-[#D6A85F] px-5 py-3 font-medium text-black transition hover:opacity-90">
          Узнать наличие
        </button>
      </div>
    </header>
  );
}
