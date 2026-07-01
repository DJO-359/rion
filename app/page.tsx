import { Categories } from "@/sections/home/categories";

import { DiscountSection } from "@/sections/home/discount-section";

import { Hero } from "@/sections/home/hero";

import { InfoBar } from "@/sections/home/info-bar";

import Products from "@/sections/home/products";

import { ShowroomMap } from "@/sections/home/showroom-map";

// import { TrustSection } from "@/components/storefront/trust-section";

import { ReviewsSection } from "@/components/storefront/reviews-section";
import DiscountProducts from "@/components/storefront/discount-products";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Categories />

      <InfoBar />

      <DiscountSection />

      <Products />

      {/* <TrustSection /> */}

      <ReviewsSection />

      <ShowroomMap />
      <DiscountProducts />
    </>
  );
}
