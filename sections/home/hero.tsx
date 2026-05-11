import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src="/Rion.png"
          alt="RION showroom"
          className="h-full w-full object-cover"
        />
        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111f]/90 via-[#07111f]/70 to-[#07111f]/40" />
      </div>

      {/* CONTENT */}
      <Container>
        <div className="relative z-10 flex h-screen items-center">
          {/* LEFT SIDE */}
          <div className="max-w-[650px]">
            <h1 className="text-[56px] font-bold leading-[1.05]">
              Плитка, сантехника, люстры и ковры
            </h1>

            <p className="mt-6 text-[18px] text-[#B8C2CE]">
              Более 5000 товаров в наличии. Подберём и доставим по региону.
            </p>

            {/* CTA */}
            <div className="mt-10 flex gap-4">
              <button className="rounded-xl bg-[#D6A85F] px-6 py-4 font-medium text-black transition hover:opacity-90">
                Узнать наличие
              </button>

              <button className="rounded-xl border border-white/20 px-6 py-4 text-white transition hover:bg-white/10">
                Перейти в каталог
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - LEAD CARD */}
          <div className="ml-auto hidden w-[420px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:block">
            <h3 className="text-xl font-semibold">Не можете приехать?</h3>

            <p className="mt-3 text-sm text-[#B8C2CE]">
              Оставьте заявку — мы подберём материалы и отправим варианты.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <input
                placeholder="Ваше имя"
                className="rounded-lg bg-black/30 p-3 outline-none"
              />

              <input
                placeholder="Телефон"
                className="rounded-lg bg-black/30 p-3 outline-none"
              />

              <button className="mt-2 rounded-xl bg-[#D6A85F] py-3 font-medium text-black">
                Получить консультацию
              </button>
            </div>

            <p className="mt-4 text-xs text-[#B8C2CE]">
              Ответим в течение 10–15 минут
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
