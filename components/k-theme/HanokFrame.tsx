import React from 'react';
import { cn } from '@/lib/utils';

interface HanokFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'arch' | 'lattice' | 'minimal';
}

export function HanokFrame({
  children,
  className,
  variant = 'arch',
}: HanokFrameProps) {
  return (
    <div className={cn('relative rounded-modal overflow-hidden p-1 sm:p-2 bg-gradient-to-b from-border-strong/40 via-border-subtle/20 to-border-strong/30 shadow-elevation', className)}>
      {/* Outer Hanok Window Frame Borders */}
      <div className="relative rounded-[16px] overflow-hidden bg-surface border border-border-strong/40">
        {/* Top Traditional Corner Joinery Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-dancheong-gold/70 z-20 pointer-events-none rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-dancheong-gold/70 z-20 pointer-events-none rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-dancheong-gold/70 z-20 pointer-events-none rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-dancheong-gold/70 z-20 pointer-events-none rounded-br-sm" />

        {/* Optional Arch Overlay for Hero Window */}
        {variant === 'arch' && (
          <div
            className="absolute inset-0 pointer-events-none z-10 border-[6px] sm:border-[10px] border-surface/40 rounded-[14px]"
            aria-hidden="true"
          />
        )}

        {/* Inner Content Slot */}
        <div className="relative z-0">
          {children}
        </div>
      </div>
    </div>
  );
}
