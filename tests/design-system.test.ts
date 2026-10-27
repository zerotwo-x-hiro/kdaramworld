import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatKoreanDate } from '@/lib/utils';

describe('Design System Utilities & Formatters', () => {
  it('combines tailwind classes properly with cn()', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('bg-surface', true && 'text-foreground', false && 'hidden')).toBe('bg-surface text-foreground');
  });

  it('formats dates into readable English format', () => {
    expect(formatDate('2026-05-14')).toContain('2026');
    expect(formatDate(null)).toBe('TBA');
    expect(formatDate('invalid')).toBe('TBA');
  });

  it('formats dates into natural Korean format', () => {
    expect(formatKoreanDate('2026-05-14')).toBe('2026년 5월 14일');
    expect(formatKoreanDate(null)).toBe('미정 (TBA)');
    expect(formatKoreanDate('invalid')).toBe('미정');
  });
});
