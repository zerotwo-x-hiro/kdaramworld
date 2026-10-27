import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingChipProps {
  source: 'tmdb' | 'imdb' | 'mdl' | 'user';
  score?: number | null;
  votes?: number | null;
  className?: string;
  size?: 'sm' | 'md';
}

export function RatingChip({
  source,
  score,
  votes,
  className,
  size = 'md',
}: RatingChipProps) {
  const isRated = score !== null && score !== undefined && score > 0;

  const sourceLabels = {
    tmdb: 'TMDB',
    imdb: 'IMDb',
    mdl: 'MDL',
    user: '내 평점',
  };

  const badgeColor = {
    tmdb: 'text-dancheong-celadon border-dancheong-celadon/30 bg-dancheong-celadon/10',
    imdb: 'text-dancheong-gold border-dancheong-gold/30 bg-dancheong-gold/10',
    mdl: 'text-dancheong-blue border-dancheong-blue/30 bg-dancheong-blue/10',
    user: 'text-dancheong-red border-dancheong-red/30 bg-dancheong-red/10',
  };

  if (!isRated) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono border border-border-subtle bg-surface/50 text-foreground-muted',
          className
        )}
      >
        <span>{sourceLabels[source]}</span>
        <span>·</span>
        <span>Not rated</span>
      </span>
    );
  }

  const formattedScore = score.toFixed(1);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono border text-[11px] font-medium backdrop-blur-sm',
        badgeColor[source],
        className
      )}
      title={`${sourceLabels[source]} score: ${formattedScore}${votes ? ` (${votes.toLocaleString()} votes)` : ''}`}
    >
      <Star className="w-3 h-3 fill-current shrink-0" />
      <span>{sourceLabels[source]}</span>
      <span className="font-bold text-foreground">{formattedScore}</span>
      {size === 'md' && votes && votes > 0 ? (
        <span className="text-[10px] opacity-75">
          ({votes > 1000 ? `${(votes / 1000).toFixed(1)}k` : votes})
        </span>
      ) : null}
    </span>
  );
}
