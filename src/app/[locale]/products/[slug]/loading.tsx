import {
  ProductDetailSkeleton,
  ProductCardSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Back button skeleton */}
        <Skeleton className="h-9 w-24 mb-6" />

        {/* Product detail skeleton */}
        <ProductDetailSkeleton />

        {/* Related products skeleton */}
        <div className="mt-16 md:mt-24">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
