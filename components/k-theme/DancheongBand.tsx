import React from 'react';
import { cn } from '@/lib/utils';

interface DancheongBandProps {
  className?: string;
  variant?: 'full' | 'subtle' | 'compact';
}

export function DancheongBand({ className, variant = 'full' }: DancheongBandProps) {
  if (variant === 'compact') {
    return (
      <div
        className={cn('h-1 w-full flex items-center overflow-hidden rounded-full', className)}
        aria-hidden="true"
      >
        <div className="h-full flex-1 bg-dancheong-red" />
        <div className="h-full flex-1 bg-dancheong-gold" />
        <div className="h-full flex-1 bg-dancheong-celadon" />
        <div className="h-full flex-1 bg-dancheong-blue" />
        <div className="h-full flex-1 bg-dancheong-rose" />
      </div>
    );
  }

  return (
    <div
      className={cn('w-full overflow-hidden flex flex-col items-center select-none py-1.5', className)}
      aria-hidden="true"
    >
      <svg
        className="w-full max-w-xl h-2.5 opacity-80"
        viewBox="0 0 400 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path d="M0 5 H400" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.5" />
        <circle cx="20" cy="5" r="2.5" fill="rgb(var(--dancheong-red))" />
        <rect x="50" y="3.5" width="20" height="3" rx="1.5" fill="rgb(var(--dancheong-gold))" />
        <polygon points="100,2 104,8 96,8" fill="rgb(var(--dancheong-celadon))" />
        <circle cx="150" cy="5" r="2.5" fill="rgb(var(--dancheong-blue))" />
        <rect x="180" y="3.5" width="40" height="3" rx="1.5" fill="rgb(var(--dancheong-rose))" />
        <circle cx="250" cy="5" r="2.5" fill="rgb(var(--dancheong-blue))" />
        <polygon points="300,2 304,8 296,8" fill="rgb(var(--dancheong-celadon))" />
        <rect x="330" y="3.5" width="20" height="3" rx="1.5" fill="rgb(var(--dancheong-gold))" />
        <circle cx="380" cy="5" r="2.5" fill="rgb(var(--dancheong-red))" />
      </svg>
    </div>
  );
}
