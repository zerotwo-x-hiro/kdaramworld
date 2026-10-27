import React from 'react';
import { cn } from '@/lib/utils';

interface TicketStubFrameProps {
  children: React.ReactNode;
  stubContent?: React.ReactNode;
  ticketNumber?: string;
  className?: string;
}

export function TicketStubFrame({
  children,
  stubContent,
  ticketNumber = 'KDW-2026-ARCHIVE',
  className,
}: TicketStubFrameProps) {
  return (
    <div
      className={cn(
        'relative bg-surface rounded-card border border-border-strong/60 overflow-hidden shadow-elevation max-w-md mx-auto',
        className
      )}
    >
      {/* Top Main Section */}
      <div className="p-5 relative">
        {children}
      </div>

      {/* Ticket Cut / Perforations */}
      <div className="relative flex items-center my-1">
        {/* Left notch */}
        <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-background border-r border-border-strong/60" />
        {/* Perforation line */}
        <div className="w-full border-t-2 border-dashed border-border-subtle mx-4" />
        {/* Right notch */}
        <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-background border-l border-border-strong/60" />
      </div>

      {/* Bottom Stub Section */}
      <div className="p-4 bg-surface-elevated/50 flex items-center justify-between text-xs">
        {stubContent ? (
          stubContent
        ) : (
          <>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-foreground-muted">{ticketNumber}</span>
              <span className="font-serifKo text-xs text-foreground font-medium">한국 드라마 시네마 아카이브</span>
            </div>
            <div className="px-2 py-1 rounded bg-dancheong-red/10 border border-dancheong-red/30 text-dancheong-red font-mono text-[10px] font-bold">
              VERIFIED PASS
            </div>
          </>
        )}
      </div>
    </div>
  );
}
