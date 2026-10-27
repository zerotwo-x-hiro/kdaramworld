import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-theme bg-surface-elevated/80 border border-border-subtle/40', className)}
      {...props}
    />
  );
}

export function DramaCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-[200px] shrink-0">
      <Skeleton className="w-full aspect-[2/3] rounded-card" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function DramaRailSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <DramaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
