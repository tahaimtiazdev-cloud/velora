export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] border border-line bg-surface" />
          <div className="mt-3 h-3 w-1/3 bg-surface" />
          <div className="mt-2 h-4 w-2/3 bg-surface" />
          <div className="mt-2 h-3 w-1/4 bg-surface" />
        </div>
      ))}
    </div>
  );
}
