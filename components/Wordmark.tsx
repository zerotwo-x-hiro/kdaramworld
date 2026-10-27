import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface WordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Wordmark({ className, size = 'md' }: WordmarkProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  const badgeSize = {
    sm: 'text-[9px] px-1 py-0.2',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-xs px-2 py-0.5',
  };

  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-2 font-display tracking-tight text-foreground hover:opacity-95 transition-opacity',
        sizeClasses[size],
        className
      )}
    >
      <span className="font-bold flex items-baseline">
        <span className="text-dancheong-red font-extrabold mr-0.5">K</span>
        <span>DramaWorld</span>
      </span>
      {/* Small Hangul accent mark */}
      <span
        lang="ko"
        className={cn(
          'font-accent tracking-widest text-dancheong-gold bg-dancheong-gold/10 border border-dancheong-gold/30 rounded font-normal select-none',
          badgeSize[size]
        )}
        title="케이·드라마·월드"
      >
        드라마
      </span>
    </Link>
  );
}
