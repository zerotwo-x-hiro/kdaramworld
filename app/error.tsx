'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5 bg-surface/90 backdrop-blur-md p-8 rounded-card border border-dancheong-red/30 shadow-elevation">
        <div className="w-12 h-12 mx-auto rounded-full bg-dancheong-red/10 border border-dancheong-red/30 flex items-center justify-center text-dancheong-red">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs tracking-widest text-dancheong-red font-bold">ERROR OCCURRED</span>
          <h1 lang="ko" className="text-2xl font-serifKo font-bold text-foreground">
            문제가 발생했습니다
          </h1>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            페이지를 불러오는 중 예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-theme text-sm font-semibold bg-surface-elevated border border-border-strong text-foreground hover:bg-border-subtle transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 시도하기 · Retry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
