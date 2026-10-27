'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isLight = document.documentElement.classList.contains('light');
    setTheme(isLight ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('kdrama-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('kdrama-theme', 'dark');
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center border border-border-subtle bg-surface/50 text-foreground-muted',
          className
        )}
        aria-label="Toggle theme (Seoul Night / Hanji Day)"
      >
        <Moon className="w-4 h-4 opacity-50" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'w-9 h-9 rounded-full flex items-center justify-center border border-border-subtle bg-surface/80 hover:bg-surface-elevated text-foreground hover:text-dancheong-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dancheong-gold',
        className
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'Hanji Day (light)' : 'Seoul Night (dark)'} theme`}
      title={theme === 'dark' ? '서울의 밤 (Seoul Night) · Switch to Hanji Day' : '한지 낮 (Hanji Day) · Switch to Seoul Night'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-dancheong-gold transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-dancheong-blue transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
