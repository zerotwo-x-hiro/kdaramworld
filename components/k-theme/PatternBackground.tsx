import React from 'react';
import { cn } from '@/lib/utils';

export type PatternType = 'cloud' | 'lattice' | 'wave' | 'lotus';

interface PatternBackgroundProps {
  type?: PatternType;
  className?: string;
  opacity?: number;
}

export function PatternBackground({
  type = 'lattice',
  className,
  opacity = 0.04,
}: PatternBackgroundProps) {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none select-none overflow-hidden', className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      {type === 'lattice' && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <pattern id="kkotsal-lattice" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M0 24 L24 0 L48 24 L24 48 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="24" cy="24" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M24 0 L24 48 M0 24 L48 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#kkotsal-lattice)" />
        </svg>
      )}

      {type === 'cloud' && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40">
          <pattern id="gurum-cloud" width="60" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M10 25 C10 18 18 15 25 18 C30 12 42 12 46 19 C52 18 55 24 50 28 C45 32 15 32 10 25 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#gurum-cloud)" />
        </svg>
      )}

      {type === 'wave' && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="40" height="20" viewBox="0 0 40 20">
          <pattern id="mulgyeol-wave" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M0 20 Q10 10 20 20 T40 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#mulgyeol-wave)" />
        </svg>
      )}

      {type === 'lotus' && (
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
          <pattern id="yeondwae-lotus" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M25 10 C20 20 20 30 25 40 C30 30 30 20 25 10 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M10 25 C20 20 30 20 40 25 C30 30 20 30 10 25 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="25" cy="25" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#yeondwae-lotus)" />
        </svg>
      )}
    </div>
  );
}
