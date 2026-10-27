import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Animated Dancheong Spinner Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-border-subtle" />
        <div className="absolute inset-0 rounded-full border-2 border-t-dancheong-red border-r-dancheong-gold border-b-dancheong-celadon border-l-transparent animate-spin" />
        <span lang="ko" className="font-serifKo text-xs text-foreground font-semibold">
          韓
        </span>
      </div>
      <div className="space-y-1">
        <p lang="ko" className="font-serifKo text-sm text-foreground">
          잠시만 기다려 주세요...
        </p>
        <p className="text-xs text-foreground-muted">Loading cinematic archive...</p>
      </div>
    </div>
  );
}
