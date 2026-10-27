'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CherryBlossomPetalsProps {
  active: boolean;
  onComplete?: () => void;
  className?: string;
  count?: number;
}

interface Petal {
  id: number;
  left: number; // percentage
  size: number; // pixels
  duration: number; // seconds
  delay: number; // seconds
  rotate: number; // degrees
}

export function CherryBlossomPetals({
  active,
  onComplete,
  className,
  count = 18,
}: CherryBlossomPetalsProps) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!active) {
      setPetals([]);
      return;
    }

    const generated: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 94 + 3,
      size: Math.random() * 8 + 10,
      duration: Math.random() * 2.5 + 3,
      delay: Math.random() * 0.8,
      rotate: Math.random() * 360,
    }));

    setPetals(generated);

    const timer = setTimeout(() => {
      setPetals([]);
      onComplete?.();
    }, 4500);

    return () => clearTimeout(timer);
  }, [active, count, onComplete]);

  if (!active || petals.length === 0) return null;

  return (
    <div
      className={cn('fixed inset-0 pointer-events-none z-50 overflow-hidden', className)}
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute top-0 animate-petal-fall"
          style={{
            left: `${petal.left}%`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size * 1.3}
            viewBox="0 0 24 30"
            fill="none"
            style={{ transform: `rotate(${petal.rotate}deg)` }}
          >
            <path
              d="M12 0 C16 8 24 14 22 22 C20 28 14 30 12 30 C10 30 4 28 2 22 C0 14 8 8 12 0 Z"
              fill="rgba(244, 164, 185, 0.85)"
            />
            <path
              d="M12 3 C14 10 20 15 18 22 C16 26 13 27 12 27 C11 27 8 26 6 22 C4 15 10 10 12 3 Z"
              fill="rgba(255, 205, 220, 0.6)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
