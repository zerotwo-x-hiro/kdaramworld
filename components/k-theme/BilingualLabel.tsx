import React from 'react';
import { cn } from '@/lib/utils';

interface BilingualLabelProps {
  ko: string;
  en: string;
  className?: string;
  badge?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BilingualLabel({
  ko,
  en,
  className,
  badge = false,
  size = 'md',
}: BilingualLabelProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-base font-semibold',
  };

  if (badge) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border-subtle bg-surface/80 backdrop-blur-sm text-foreground-secondary',
          sizeClasses[size],
          className
        )}
      >
        <span lang="ko" className="font-serifKo text-dancheong-red font-medium">
          {ko}
        </span>
        <span className="text-foreground-muted">·</span>
        <span>{en}</span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-baseline gap-1.5', sizeClasses[size], className)}>
      <span lang="ko" className="font-serifKo text-dancheong-red font-medium">
        {ko}
      </span>
      <span className="text-foreground-muted font-normal text-xs">·</span>
      <span className="text-foreground">{en}</span>
    </span>
  );
}
