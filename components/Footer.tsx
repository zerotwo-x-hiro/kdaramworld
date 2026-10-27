import React from 'react';
import Link from 'next/link';
import { DancheongBand } from './k-theme/DancheongBand';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border-subtle bg-surface/60 backdrop-blur-sm text-foreground-secondary">
      <DancheongBand variant="subtle" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Poetic Tagline */}
          <div className="md:col-span-2 space-y-3">
            <Wordmark size="md" />
            <p className="font-display italic text-lg sm:text-xl text-foreground">
              &ldquo;Some stories never leave you.&rdquo;
            </p>
            <p lang="ko" className="font-serifKo text-sm text-dancheong-red font-medium">
              어떤 이야기는 영원히 마음에 남는다.
            </p>
            <p className="text-xs text-foreground-muted leading-relaxed max-w-md pt-2">
              KDramaWorld is an independent cinematic archive dedicated to celebrating the artistry, emotional depth, and cultural richness of Korean television dramas.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">
              아카이브 탐색 · Archive
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/discover" className="hover:text-dancheong-gold transition-colors">
                  발견 · Discover Catalog
                </Link>
              </li>
              <li>
                <Link href="/discover?status=airing" className="hover:text-dancheong-gold transition-colors">
                  방영 중 · Airing Now
                </Link>
              </li>
              <li>
                <Link href="/midnight-watchlist" className="hover:text-dancheong-gold transition-colors">
                  심야 추천 · Midnight Watchlist
                </Link>
              </li>
              <li>
                <Link href="/actors" className="hover:text-dancheong-gold transition-colors">
                  배우 아카이브 · Actors Directory
                </Link>
              </li>
              <li>
                <Link href="/lists" className="hover:text-dancheong-gold transition-colors">
                  테마 리스트 · Curated Lists
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-dancheong-gold transition-colors">
                  커뮤니티 랭킹 · Rankings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal, Sources & Attribution */}
          <div className="space-y-3 text-sm">
            <h3 className="font-semibold text-foreground text-xs uppercase tracking-wider">
              데이터 출처 · Attribution
            </h3>
            <p className="text-xs text-foreground-muted leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB. Drama details, episode schedules, and cast metadata are provided by TMDB.
            </p>
            <p className="text-xs text-foreground-muted leading-relaxed">
              Ratings and vote counts are sourced transparently from TMDB and OMDb (IMDb data). Commercial terms must be independently re-verified before commercial application.
            </p>
            <div className="pt-2">
              <Link href="/about" className="text-xs text-dancheong-red hover:underline">
                자세한 출처 및 정보 · About & Attribution &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-muted">
          <p>© {new Date().getFullYear()} KDramaWorld. Built with cultural respect and love for Korean storytelling.</p>
          <div className="flex items-center gap-4">
            <span lang="ko" className="font-serifKo text-[11px] text-foreground-secondary">
              대한민국 서울시 표준시 (KST) 기준
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
