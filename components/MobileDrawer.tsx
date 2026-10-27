'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Film, Sparkles, Bookmark, User, Compass, Layers, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Wordmark } from './Wordmark';
import { ThemeToggle } from './ThemeToggle';
import { DancheongBand } from './k-theme/DancheongBand';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { username: string; role: string } | null;
}

export function MobileDrawer({ isOpen, onClose, user }: MobileDrawerProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const navItems = [
    { href: '/', labelKo: '홈', labelEn: 'Home', icon: Film },
    { href: '/discover', labelKo: '발견', labelEn: 'Discover', icon: Compass },
    { href: '/discover?status=airing', labelKo: '방영 중', labelEn: 'Airing Now', icon: Film },
    { href: '/midnight-watchlist', labelKo: '심야 추천', labelEn: 'Midnight Watchlist', icon: Sparkles },
    { href: '/collection', labelKo: '내 컬렉션', labelEn: 'My Collection', icon: Bookmark },
    { href: '/lists', labelKo: '테마 리스트', labelEn: 'Curated Lists', icon: Layers },
    { href: '/rankings', labelKo: '드라마 랭킹', labelEn: 'Rankings', icon: BarChart2 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex sm:hidden bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
    >
      <div className="w-4/5 max-w-xs bg-surface border-r border-border-strong h-full flex flex-col shadow-elevation justify-between">
        <div>
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-border-subtle">
            <Wordmark size="sm" />
            <button
              onClick={onClose}
              className="p-1 rounded text-foreground-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <DancheongBand variant="compact" />

          {/* Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-theme text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-dancheong-red/10 text-dancheong-red border border-dancheong-red/20'
                      : 'text-foreground-secondary hover:bg-surface-elevated hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0 text-current opacity-80" />
                  <div className="flex items-baseline gap-1.5">
                    <span lang="ko" className="font-serifKo text-xs">
                      {item.labelKo}
                    </span>
                    <span className="text-foreground-muted text-xs">·</span>
                    <span>{item.labelEn}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-4 border-t border-border-subtle bg-surface-elevated/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground-muted">테마 변경 · Theme</span>
            <ThemeToggle />
          </div>

          {user ? (
            <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
              <Link
                href={`/profile/${user.username}`}
                onClick={onClose}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-dancheong-gold"
              >
                <User className="w-4 h-4 text-dancheong-celadon" />
                <span>@{user.username}</span>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-xs text-foreground-muted hover:text-dancheong-red"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full text-center py-2 text-xs font-semibold rounded-theme border border-border-strong hover:bg-surface-elevated text-foreground"
              >
                로그인 · Login
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="w-full text-center py-2 text-xs font-semibold rounded-theme bg-dancheong-red text-white hover:opacity-95"
              >
                가입하기 · Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
