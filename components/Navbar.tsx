'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, Compass, Sparkles, Bookmark, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Wordmark } from './Wordmark';
import { ThemeToggle } from './ThemeToggle';
import { DancheongBand } from './k-theme/DancheongBand';
import { MobileDrawer } from './MobileDrawer';
import { CommandPalette } from './CommandPalette';

interface NavbarProps {
  user?: {
    id: number;
    username: string;
    role: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/discover', labelKo: '발견', labelEn: 'Discover' },
    { href: '/discover?status=airing', labelKo: '방영 중', labelEn: 'Airing' },
    { href: '/midnight-watchlist', labelKo: '심야 추천', labelEn: 'Midnight Watchlist' },
    { href: '/collection', labelKo: '내 컬렉션', labelEn: 'Collection' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/85 border-b border-border-subtle transition-colors">
        <DancheongBand variant="compact" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-6">
            <Wordmark size="md" />
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 py-1.5 rounded-theme text-xs lg:text-sm font-medium transition-colors inline-flex items-baseline gap-1',
                      isActive
                        ? 'text-dancheong-red bg-dancheong-red/10'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-surface-elevated'
                    )}
                  >
                    <span lang="ko" className="font-serifKo text-[11px] lg:text-xs">
                      {link.labelKo}
                    </span>
                    <span className="text-foreground-muted text-[10px]">·</span>
                    <span>{link.labelEn}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, Theme Toggle, Auth, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Palette Trigger Button */}
            <button
              type="button"
              onClick={() => {
                // Dispatch event or open command palette
                window.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true })
                );
              }}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-border-subtle bg-surface-elevated/60 hover:bg-surface-elevated text-foreground-muted text-xs transition-colors"
              aria-label="Search dramas, actors, and genres (Ctrl+K or Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-dancheong-gold" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono border border-border-subtle rounded text-foreground-muted">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile or Login */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="p-2 rounded-full border border-dancheong-gold/40 bg-dancheong-gold/10 text-dancheong-gold hover:bg-dancheong-gold/20"
                    title="관리자 · Admin Dashboard"
                    aria-label="Admin Dashboard"
                  >
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  href={`/profile/${user.username}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-theme text-xs font-medium border border-border-strong bg-surface-elevated hover:border-dancheong-red text-foreground transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-dancheong-celadon" />
                  <span>@{user.username}</span>
                </Link>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-theme text-xs font-medium text-foreground-secondary hover:text-foreground"
                >
                  로그인 · Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 rounded-theme text-xs font-semibold bg-dancheong-red hover:opacity-95 text-white transition-opacity shadow-sm"
                >
                  가입하기
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="sm:hidden p-2 rounded-theme text-foreground-secondary hover:text-foreground"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user ? { username: user.username, role: user.role } : null}
      />
    </>
  );
}
