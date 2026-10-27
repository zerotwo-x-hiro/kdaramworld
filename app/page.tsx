import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Film, Bookmark } from 'lucide-react';
import { HanokFrame } from '@/components/k-theme/HanokFrame';
import { DancheongBand } from '@/components/k-theme/DancheongBand';
import { BilingualLabel } from '@/components/k-theme/BilingualLabel';
import { HangulWatermark } from '@/components/k-theme/HangulWatermark';
import { FourCutFrame } from '@/components/k-theme/FourCutFrame';
import { TicketStubFrame } from '@/components/k-theme/TicketStubFrame';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16">
      {/* Background Watermark */}
      <HangulWatermark text="드라마" size="giant" className="top-10 -right-20" />
      <HangulWatermark text="이야기" size="giant" className="bottom-10 -left-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Hero Section wrapped in Hanok Window Frame */}
        <HanokFrame variant="arch" className="max-w-5xl mx-auto">
          <div className="p-8 sm:p-14 text-center space-y-6 relative overflow-hidden bg-surface-elevated/40">
            <BilingualLabel ko="한국 드라마 시네마틱 아카이브" en="Cinematic Korean Drama Archive" badge size="sm" />

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-foreground">
                Some stories never leave you.
              </h1>
              <p lang="ko" className="text-xl sm:text-2xl font-serifKo text-dancheong-red font-semibold">
                어떤 이야기는 영원히 마음에 남는다.
              </p>
            </div>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-foreground-secondary leading-relaxed">
              Discover Korean dramas, track your viewing journey, keep private emotional reflections, create curated four-cut lists, and receive transparent recommendations tonight.
            </p>

            <DancheongBand variant="subtle" />

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-theme text-sm font-semibold bg-dancheong-red text-white hover:opacity-95 shadow-sm transition-opacity"
              >
                <Compass className="w-4 h-4" />
                <span>발견하기 · Discover Dramas</span>
              </Link>
              <Link
                href="/midnight-watchlist"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-theme text-sm font-semibold border border-border-strong bg-surface hover:bg-surface-elevated text-foreground transition-colors"
              >
                <Sparkles className="w-4 h-4 text-dancheong-gold" />
                <span>심야 추천 · What To Watch Tonight</span>
              </Link>
            </div>
          </div>
        </HanokFrame>

        {/* Design System Frame Showcase (Four-Cut & Ticket Stub) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Life Four-Cut Style Frame */}
          <div className="space-y-4">
            <BilingualLabel ko="인생네컷 프레임" en="Four-Cut Photo Booth Frame Style" />
            <FourCutFrame title="명작 기억 · Cinematic Memory">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="aspect-[4/3] bg-surface-elevated rounded flex items-center justify-center p-2 border border-border-subtle">
                  <span className="font-serifKo">시그널 (Signal)</span>
                </div>
                <div className="aspect-[4/3] bg-surface-elevated rounded flex items-center justify-center p-2 border border-border-subtle">
                  <span className="font-serifKo">나의 아저씨 (My Mister)</span>
                </div>
                <div className="aspect-[4/3] bg-surface-elevated rounded flex items-center justify-center p-2 border border-border-subtle">
                  <span className="font-serifKo">눈물의 여왕 (Queen of Tears)</span>
                </div>
                <div className="aspect-[4/3] bg-surface-elevated rounded flex items-center justify-center p-2 border border-border-subtle">
                  <span className="font-serifKo">도깨비 (Goblin)</span>
                </div>
              </div>
            </FourCutFrame>
          </div>

          {/* Ticket Stub Style Frame */}
          <div className="space-y-4">
            <BilingualLabel ko="티켓 스텁 프레임" en="Cinematic Ticket Stub Frame Style" />
            <TicketStubFrame ticketNumber="KDW-2026-ARCHIVE-01">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-foreground-muted">
                  <span className="font-mono">SEAT 01 · ROW A</span>
                  <span className="font-serifKo text-dancheong-gold">심야 상영</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  The Enduring Resonance of K-Drama
                </h3>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  Every Korean drama is a chapter in an intimate dialogue between screenwriter and spectator—a world where ordinary rain showers, midnight convenience store ramen, and whispered confessions linger forever.
                </p>
              </div>
            </TicketStubFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
