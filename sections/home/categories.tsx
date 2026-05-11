import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Плитка",
    desc: "Керамическая и керамогранит",
    img: "/prod1.jpg",
    link: "/catalog/tile",
  },
  {
    title: "Ламинат",
    desc: "Полы и покрытия",
    img: "/prod2.jpg",
    link: "/catalog/laminate",
  },
  {
    title: "Сантехника",
    desc: "Унитазы, раковины, ванны",
    img: "/prod3.jpg",
    link: "/catalog/plumbing",
  },
  {
    title: "Смесители",
    desc: "Надежность и стиль",
    img: "/prod4.jpg",
    link: "/catalog/faucets",
  },
  {
    title: "Люстры",
    desc: "Современные и классические",
    img: "/prod5.png",
    link: "/catalog/chandeliers",
  },
  {
    title: "Ковры",
    desc: "Для дома и офиса",
    img: "/prod6.png",
    link: "/catalog/carpets",
  },
];

export default function Categories() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold">Категории товаров</h2>

          <Link
            href="/catalog"
            className="text-[#d4af37] hover:underline flex items-center gap-2 text-sm font-medium"
          >
            Все категории →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              href={category.link}
              key={index}
              className="group relative overflow-hidden rounded-3xl aspect-[16/10] shadow-xl"
            >
              <Image
                src={category.img}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-semibold mb-2 text-white">
                  {category.title}
                </h3>

                <p className="text-gray-300 text-lg">{category.desc}</p>
              </div>

              <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full text-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all">
                Смотреть
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
