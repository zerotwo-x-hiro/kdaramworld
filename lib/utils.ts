import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined, locale = 'en-US'): string {
  if (!dateString) return 'TBA';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'TBA';
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatKoreanDate(dateString: string | null | undefined): string {
  if (!dateString) return '미정 (TBA)';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '미정';
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
