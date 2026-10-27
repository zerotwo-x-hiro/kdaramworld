'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Film, User, Tag, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResultItem {
  id: number;
  type: 'drama' | 'actor' | 'genre';
  title: string;
  titleKo?: string;
  subtitle?: string;
  url: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Fetch quick autocomplete from API
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Command palette search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].url);
      } else if (query.trim()) {
        handleSelect(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette / 검색"
    >
      <div
        className="w-full max-w-xl bg-surface border border-border-strong rounded-modal shadow-elevation overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-subtle gap-3">
          <Search className="w-5 h-5 text-dancheong-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="드라마, 배우, 장르 검색... / Search drama, actor, genre..."
            className="w-full bg-transparent text-foreground placeholder:text-foreground-muted outline-none text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-foreground-muted hover:text-foreground p-1"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono border border-border-subtle rounded text-foreground-muted">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="py-8 text-center text-sm text-foreground-muted animate-pulse">
              검색 중... / Searching archive...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-sm text-foreground-secondary">
              검색 결과가 없습니다 / No titles found.
              <button
                type="button"
                onClick={() => handleSelect(`/search?q=${encodeURIComponent(query)}`)}
                className="block mx-auto mt-2 text-xs text-dancheong-red hover:underline"
              >
                전체 검색 결과 보기 &rarr;
              </button>
            </div>
          )}

          {!query && (
            <div className="p-3 text-xs text-foreground-muted space-y-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-foreground-secondary">
                빠른 메뉴 · Quick Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleSelect('/discover')}
                  className="flex items-center gap-2 p-2 rounded-theme hover:bg-surface-elevated text-left text-foreground transition-colors"
                >
                  <Film className="w-4 h-4 text-dancheong-red" />
                  <span>탐색 · Discover Dramas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('/midnight-watchlist')}
                  className="flex items-center gap-2 p-2 rounded-theme hover:bg-surface-elevated text-left text-foreground transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-dancheong-gold" />
                  <span>심야 추천 · Midnight Watchlist</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('/actors')}
                  className="flex items-center gap-2 p-2 rounded-theme hover:bg-surface-elevated text-left text-foreground transition-colors"
                >
                  <User className="w-4 h-4 text-dancheong-celadon" />
                  <span>배우 · Actor Directory</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('/rankings')}
                  className="flex items-center gap-2 p-2 rounded-theme hover:bg-surface-elevated text-left text-foreground transition-colors"
                >
                  <Tag className="w-4 h-4 text-dancheong-blue" />
                  <span>순위 · Community Rankings</span>
                </button>
              </div>
            </div>
          )}

          {results.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => handleSelect(item.url)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  'w-full flex items-center justify-between p-2.5 rounded-theme text-left transition-colors',
                  isSelected ? 'bg-surface-elevated text-foreground' : 'text-foreground-secondary hover:bg-surface-elevated/50'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.type === 'drama' && <Film className="w-4 h-4 text-dancheong-red shrink-0" />}
                  {item.type === 'actor' && <User className="w-4 h-4 text-dancheong-celadon shrink-0" />}
                  {item.type === 'genre' && <Tag className="w-4 h-4 text-dancheong-blue shrink-0" />}
                  <div className="truncate">
                    <span className="font-medium text-foreground">{item.title}</span>
                    {item.titleKo && (
                      <span lang="ko" className="font-serifKo text-xs text-foreground-muted ml-2">
                        {item.titleKo}
                      </span>
                    )}
                  </div>
                </div>
                {item.subtitle && (
                  <span className="text-xs text-foreground-muted shrink-0 ml-2 font-mono">
                    {item.subtitle}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-surface-elevated/40 border-t border-border-subtle flex items-center justify-between text-[11px] text-foreground-muted">
          <span>위/아래 화살표로 이동, Enter로 선택</span>
          <span className="font-mono">KDRAMAWORLD</span>
        </div>
      </div>
    </div>
  );
}
