import Link from "next/link";
import { Container } from "@/components/layout/container";

const HOME_CATEGORIES = [
  { title: "Плитка", slug: "plitka", image: "/1.jpg" },
  { title: "Ковры", slug: "kovry", image: "/2.jpg" },
  { title: "Сантехника", slug: "santehnika", image: "/3.jpg" },
  { title: "Ламинат", slug: "laminat", image: "/4.jpg" },
  { title: "Люстры", slug: "lyustry", image: "/5.jpg" },
  { title: "Смесители", slug: "smesiteli", image: "/6.jpg" },
];

export function Categories() {
  return (
    <section className="pb-10 pt-0">
      <Container>
        <div className="grid grid-cols-2 gap-4 px-5 sm:grid-cols-3 lg:grid-cols-6 xl:px-0">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="group block overflow-hidden rounded-[18px] bg-[#F5F7FA] shadow-[0_10px_28px_rgba(15,23,42,0.07)] hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.11)]"
            >
              <div className="relative h-[150px] w-full overflow-hidden rounded-[18px]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-10">
                  <span className="text-[16px] font-semibold text-white">
                    {cat.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
