'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PatternBackground } from './k-theme/PatternBackground';

interface DramaPosterProps {
  title: string;
  titleKo?: string | null;
  posterPath?: string | null;
  aspectRatio?: 'poster' | 'backdrop' | 'square';
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function DramaPoster({
  title,
  titleKo,
  posterPath,
  aspectRatio = 'poster',
  priority = false,
  className,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px',
}: DramaPosterProps) {
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    poster: 'aspect-[2/3]',
    backdrop: 'aspect-[16/9]',
    square: 'aspect-square',
  };

  const imageUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;

  if (!imageUrl || hasError) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-card bg-surface-elevated border border-border-subtle flex flex-col items-center justify-center p-4 text-center select-none shadow-sm',
          aspectClasses[aspectRatio],
          className
        )}
      >
        <PatternBackground type="lattice" opacity={0.08} />
        {/* Subtle Dancheong decorative seal */}
        <div className="w-9 h-9 rounded-full border border-dancheong-gold/40 flex items-center justify-center mb-2 text-dancheong-gold font-serifKo text-xs">
          韓
        </div>
        <div className="space-y-1 relative z-10 max-w-full px-2">
          {titleKo && (
            <p lang="ko" className="font-serifKo text-xs text-foreground font-semibold truncate">
              {titleKo}
            </p>
          )}
          <p className="text-[11px] text-foreground-secondary line-clamp-2 leading-tight">
            {title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card bg-surface-elevated border border-border-subtle shadow-sm group',
        aspectClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={imageUrl}
        alt={`${title}${titleKo ? ` (${titleKo})` : ''} poster`}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setHasError(true)}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Cinematic gradient scrim at the bottom to guarantee text contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-scrim/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
