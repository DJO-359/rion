import { supabase } from "@/shared/lib/supabase";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

const categoryMap: Record<string, string> = {
  plitka: "Плитка",
  laminat: "Ламинат",
  santehnika: "Сантехника",
  smesiteli: "Смесители",
  lyustry: "Люстры",
  kovry: "Ковры",
};

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;

  const category = categoryMap[slug];

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("active", true)
    .order("created_at", {
      ascending: false,
    });

  return (
    <section className="min-h-screen bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* TITLE */}
        <div className="mb-14">
          <h1 className="text-5xl font-bold">{category}</h1>

          <p className="mt-3 text-zinc-400">
            Найдено товаров: {products?.length || 0}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-3xl bg-zinc-900"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-72 w-full object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-semibold">{product.title}</h2>

                <p className="mt-3 text-3xl font-bold text-violet-400">
                  {product.price} ₽
                </p>

                <button className="mt-6 w-full rounded-2xl bg-violet-600 py-4 text-lg font-medium transition hover:bg-violet-700">
                  Узнать наличие
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
