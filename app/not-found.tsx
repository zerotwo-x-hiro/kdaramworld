import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { HangulWatermark } from '@/components/k-theme/HangulWatermark';

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <HangulWatermark text="이야기" size="giant" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10 max-w-md space-y-5 bg-surface/80 backdrop-blur-md p-8 rounded-card border border-border-strong shadow-elevation">
        <div className="w-12 h-12 mx-auto rounded-full bg-dancheong-red/10 border border-dancheong-red/30 flex items-center justify-center text-dancheong-red">
          <Compass className="w-6 h-6 animate-subtle-pulse" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs tracking-widest text-dancheong-gold font-bold">404 ERROR</span>
          <h1 lang="ko" className="text-2xl font-serifKo font-bold text-foreground">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            찾으시는 이야기가 아직 시작되지 않았거나, 다른 페이지로 이동했습니다.
          </p>
          <p className="text-xs text-foreground-muted italic">
            &ldquo;Some stories take a detour before they find you.&rdquo;
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-theme text-sm font-semibold bg-dancheong-red text-white hover:opacity-95 shadow-sm transition-opacity"
          >
            홈으로 돌아가기 · Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
