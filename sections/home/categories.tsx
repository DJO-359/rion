import { Container } from "@/components/layout/container";
import Link from "next/link";

const categories = [
  {
    title: "Плитка",
    slug: "plitka",
    desc: "Керамическая и керамогранит",
    img: "/prod1.jpg",
  },

  {
    title: "Ламинат",
    slug: "laminat",
    desc: "Полы и покрытия",
    img: "/prod2.jpg",
  },

  {
    title: "Сантехника",
    slug: "santehnika",
    desc: "Унитазы, раковины, ванны",
    img: "/prod3.jpg",
  },

  {
    title: "Смесители",
    slug: "smesiteli",
    desc: "Надежность и стиль",
    img: "/prod4.jpg",
  },

  {
    title: "Люстры",
    slug: "lyustry",
    desc: "Современные и классические",
    img: "/prod5.png",
  },

  {
    title: "Ковры",
    slug: "kovry",
    desc: "Для дома и офиса",
    img: "/prod6.png",
  },
];

export function Categories() {
  return (
    <section className="py-[80px]">
      <Container>
        {/* BOTTOM BAR — FULL FIX */}

        <section className="relative z-10 py-16">
          <Container>
            <div
              className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-[#f6c15c]
        bg-[linear-gradient(180deg,#d5963a_0%,#9d6320_45%,#5d3814_100%)]
        shadow-[0_0_0_2px_rgba(255,215,120,0.45),0_25px_60px_rgba(201,139,52,0.5)]
      "
            >
              {/* внутренний контур */}
              <div className="absolute inset-[3px] rounded-[28px] border border-[#ffd27b]/50" />

              {/* верхнее свечение */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,220,120,0.25),transparent_55%)]" />

              {/* затемнение снизу */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

              <div className="relative px-12 py-10 text-center">
                <div
                  className="
            text-[18px]
            font-medium
            uppercase
            tracking-[0.35em]
            text-[#ffd06a]
            drop-shadow-[0_0_10px_rgba(255,208,106,0.8)]
          "
                >
                  Категории товаров
                </div>

                <h2
                  className="
            mt-4
            text-[52px]
            font-bold
            leading-none
            text-white
            drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]
          "
                >
                  Всё для интерьера в одном месте
                </h2>

                <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#ffd06a] to-transparent" />
              </div>
            </div>
          </Container>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              href={`/catalog/${cat.slug}`}
              key={cat.title}
              className="group relative h-[420px] cursor-pointer overflow-hidden rounded-2xl border border-white/10"
            >
              {/* image */}
              <img
                src={cat.img}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />

              {/* overlay */}
              <div className="absolute inset-0  via-black/30 to-transparent" />

              {/* text */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold">{cat.title}</h3>

                <p className="text-sm text-[#B8C2CE]">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
