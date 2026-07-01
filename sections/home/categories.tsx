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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 categories-grid">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="group block overflow-hidden rounded-[18px] bg-[#F5F7FA] shadow-[0_10px_28px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-[0_16px_34px_rgba(15,23,42,0.11)]"
            >
              <div className="relative h-[200px] w-full overflow-hidden rounded-[18px]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-full w-full object-fill transition duration-500 group-hover:scale-[1.04] group-hover:brightness-110"
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,

                    padding: "3px 12px 4px 70px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      // fontWeight: "600",

                      // textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {cat.title}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
