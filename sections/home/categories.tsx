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
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-[42px] font-bold">Категории товаров</h2>

          <p className="mt-3 text-[#B8C2CE]">Всё для интерьера в одном месте</p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              href={`/catalog/${cat.slug}`}
              key={cat.title}
              className="group relative h-[220px] cursor-pointer overflow-hidden rounded-2xl border border-white/10"
            >
              {/* image */}
              <img
                src={cat.img}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

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
