import Header from "@/components/layout/header";
import Benefits from "@/sections/home/Benefits";
import { Categories } from "@/sections/home/categories";
import Hero from "@/sections/home/hero";

import Products from "@/sections/home/products";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Benefits />
      {/* <Categories />
      <Products /> */}
    </main>
  );
}
