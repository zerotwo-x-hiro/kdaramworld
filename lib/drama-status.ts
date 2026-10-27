export type DramaStatus = 'upcoming' | 'airing' | 'ended';

export interface DramaStatusInput {
  first_air_date?: string | null;
  last_air_date?: string | null;
  next_episode_air_date?: string | null;
  next_episode_number?: number | null;
  last_episode_number?: number | null;
  number_of_episodes?: number | null;
  tmdb_status?: string | null; // e.g. "Ended", "Canceled", "Returning Series", "In Production", "Planned"
}

/**
 * Returns YYYY-MM-DD formatted date in Korea Standard Time (Asia/Seoul, UTC+9)
 */
export function getKSTDateString(dateInput: Date | string = new Date()): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  }

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Pure, deterministic function to derive drama status.
 * Canonical timezone: Korea Standard Time (Asia/Seoul).
 * 
 * Strict invariant: If first_air_date is on or before today in KST,
 * the drama can NEVER be classified as 'upcoming'.
 */
export function deriveDramaStatus(
  drama: DramaStatusInput,
  nowInput: Date | string = new Date()
): DramaStatus {
  const kstToday = getKSTDateString(nowInput);
  const firstAirDate = drama.first_air_date ? drama.first_air_date.trim() : null;
  const tmdbStatus = drama.tmdb_status ? drama.tmdb_status.trim().toLowerCase() : '';

  // 1. If first_air_date is missing
  if (!firstAirDate) {
    if (tmdbStatus === 'ended' || tmdbStatus === 'canceled') {
      return 'ended';
    }
    // Planned or In Production with unknown air date is upcoming
    return 'upcoming';
  }

  // 2. If first_air_date is strictly in the future relative to KST today
  if (firstAirDate > kstToday) {
    return 'upcoming';
  }

  // 3. From here onward, first_air_date <= kstToday.
  // INVARIANT: CAN NEVER BE 'upcoming'

  // If TMDB status explicitly says Ended or Canceled
  if (tmdbStatus === 'ended' || tmdbStatus === 'canceled') {
    return 'ended';
  }

  // If has a scheduled next episode
  if (drama.next_episode_air_date) {
    return 'airing';
  }

  // If status is "Returning Series"
  if (tmdbStatus === 'returning series') {
    return 'airing';
  }

  // Check episode count completion:
  const totalEpisodes = drama.number_of_episodes ?? 0;
  const lastAiredEpisode = drama.last_episode_number ?? 0;

  if (totalEpisodes > 0 && lastAiredEpisode >= totalEpisodes) {
    return 'ended';
  }

  // If last_air_date is in the past and total episodes were reached, it's ended
  if (drama.last_air_date && drama.last_air_date < kstToday && totalEpisodes > 0 && lastAiredEpisode === totalEpisodes) {
    return 'ended';
  }

  // If totalEpisodes > 0 and lastAiredEpisode < totalEpisodes, still has episodes to air
  if (totalEpisodes > 0 && lastAiredEpisode < totalEpisodes) {
    return 'airing';
  }

  // Fallback for dramas that started in the past without future episode dates
  return 'ended';
}

/**
 * Helper to get bilingual status label
 */
export function getDramaStatusLabel(status: DramaStatus): { ko: string; en: string } {
  switch (status) {
    case 'upcoming':
      return { ko: '방영 예정', en: 'Coming Soon' };
    case 'airing':
      return { ko: '방영 중', en: 'Airing Now' };
    case 'ended':
      return { ko: '종영', en: 'Ended' };
  }
}
