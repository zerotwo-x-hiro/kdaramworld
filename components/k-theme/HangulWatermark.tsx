import React from 'react';
import { cn } from '@/lib/utils';

interface HangulWatermarkProps {
  text: '사랑' | '이야기' | '드라마' | '인연' | '여운' | '기억';
  className?: string;
  size?: 'md' | 'lg' | 'xl' | 'giant';
}

export function HangulWatermark({
  text,
  className,
  size = 'lg',
}: HangulWatermarkProps) {
  const sizeClasses = {
    md: 'text-7xl md:text-8xl',
    lg: 'text-8xl md:text-9xl',
    xl: 'text-9xl md:text-[12rem]',
    giant: 'text-[10rem] md:text-[18rem]',
  };

  return (
    <div
      className={cn(
        'absolute pointer-events-none select-none font-serifKo font-bold tracking-tighter opacity-[0.035] dark:opacity-[0.045] leading-none z-0',
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
      lang="ko"
    >
      {text}
    </div>
  );
}
