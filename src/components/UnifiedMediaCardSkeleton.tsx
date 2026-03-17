interface UnifiedMediaCardSkeletonProps {
  index?: number;
}

export function UnifiedMediaCardSkeleton({ index = 0 }: UnifiedMediaCardSkeletonProps) {
  return (
    <div
      className="w-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Cover Skeleton */}
      <div
        className="aspect-[2/3] relative overflow-hidden rounded-xl animate-blink"
        style={{ background: 'hsl(var(--muted))' }}
      />

      {/* Content Skeleton */}
      <div className="pt-2 pb-1 space-y-1.5 flex flex-col justify-end">
        <div className="h-2.5 rounded-xl w-full animate-blink" style={{ background: 'hsl(var(--muted))' }} />
        <div className="h-2.5 rounded-xl w-3/5 animate-blink" style={{ background: 'hsl(var(--muted))', animationDelay: '200ms' }} />
      </div>
    </div>
  );
}
