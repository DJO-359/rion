export function ProductCardSkeleton() {
  return (
    <div className="card-storefront overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 skeleton rounded" />
        <div className="h-5 w-full skeleton rounded" />
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-8 w-28 skeleton rounded" />
        <div className="h-11 w-full skeleton rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
