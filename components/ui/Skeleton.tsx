export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gray-700 rounded-lg animate-pulse ${className}`}
      aria-busy="true"
      aria-label="Loading..."
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-[#2d2d2d] p-4 rounded-lg border border-[rgba(255,255,255,0.08)]">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

export function SkeletonCardGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </div>
  )
}
