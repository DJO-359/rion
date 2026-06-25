export const CATEGORIES = [
  { title: "Плитка", slug: "plitka", desc: "Керамическая и керамогранит" },
  { title: "Ламинат", slug: "laminat", desc: "Полы и покрытия" },
  { title: "Сантехника", slug: "santehnika", desc: "Унитазы, раковины, ванны" },
  { title: "Смесители", slug: "smesiteli", desc: "Надёжность и стиль" },
  { title: "Люстры", slug: "lyustry", desc: "Современные и классические" },
  { title: "Ковры", slug: "kovry", desc: "Для дома и офиса" },
] as const;

export const CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.title]),
);

export const CATEGORY_IMAGES: Record<string, string> = {
  plitka: "/1.jpg",
  kovry: "/2.jpg",
  santehnika: "/3.jpg",
  laminat: "/4.jpg",
  lyustry: "/5.jpg",
  smesiteli: "/6.jpg",
};
