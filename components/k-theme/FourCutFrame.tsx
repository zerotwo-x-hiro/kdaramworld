import React from 'react';
import { cn } from '@/lib/utils';

interface FourCutFrameProps {
  children: React.ReactNode;
  title?: string;
  date?: string;
  className?: string;
}

export function FourCutFrame({
  children,
  title = '인생네컷 · 4-CUT MEMORY',
  date,
  className,
}: FourCutFrameProps) {
  const currentDate = date || new Date().toISOString().slice(0, 10).replace(/-/g, '.');

  return (
    <div
      className={cn(
        'bg-[#121113] text-[#f2efe9] dark:bg-[#0c0d12] dark:text-[#f2efe9] light:bg-[#f6f2ea] light:text-[#18141a] p-3 sm:p-4 rounded-xl shadow-elevation border border-border-strong/40 max-w-sm mx-auto flex flex-col',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 dark:border-white/10 light:border-black/10 text-[10px] tracking-widest uppercase font-mono opacity-80">
        <span lang="ko" className="font-serifKo">KDRAMAWORLD</span>
        <span>NO. 04 / 인생네컷</span>
      </div>

      {/* Content Slot (Grid or Stack of 4 cuts) */}
      <div className="py-3 flex flex-col gap-2.5 flex-1">
        {children}
      </div>

      {/* Bottom Film Strip Barcode / Stamp */}
      <div className="pt-2 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between text-[11px]">
        <div className="flex flex-col">
          <span className="font-serifKo font-semibold text-xs tracking-wide text-dancheong-red">
            {title}
          </span>
          <span className="font-mono text-[9px] opacity-70">{currentDate}</span>
        </div>
        <div className="flex items-center gap-1 opacity-60">
          <div className="w-1.5 h-6 bg-current" />
          <div className="w-0.5 h-6 bg-current" />
          <div className="w-2 h-6 bg-current" />
          <div className="w-1 h-6 bg-current" />
          <div className="w-0.5 h-6 bg-current" />
        </div>
      </div>
    </div>
  );
}
