import 'server-only';

export interface TVmazeSchedule {
  airdate: string;
  airtime?: string;
  season?: number;
  number?: number;
}

/**
 * Cross-checks next episode schedule against TVmaze public API (no API key required).
 * On disagreement, logs the mismatch.
 */
export async function crossCheckNextEpisodeWithTVmaze(
  dramaTitle: string,
  tmdbNextEpisodeAirDate: string | null
): Promise<{ matches: boolean; tvmazeAirDate?: string | null }> {
  try {
    const searchUrl = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(dramaTitle)}&embed=nextepisode`;
    const res = await fetch(searchUrl, { cache: 'no-store' });
    if (!res.ok) return { matches: true };

    const data = await res.json();
    const nextEpisode = data._embedded?.nextepisode;
    const tvmazeAirDate = nextEpisode?.airdate || null;

    if (!tvmazeAirDate || !tmdbNextEpisodeAirDate) {
      return { matches: true, tvmazeAirDate };
    }

    const matches = tvmazeAirDate === tmdbNextEpisodeAirDate;
    if (!matches) {
      console.warn(
        `[TVmaze Cross-Check] Schedule mismatch for "${dramaTitle}": TMDB says ${tmdbNextEpisodeAirDate}, TVmaze says ${tvmazeAirDate}`
      );
    }

    return { matches, tvmazeAirDate };
  } catch (e) {
    console.warn(`[TVmaze Cross-Check] Failed to check "${dramaTitle}":`, e);
    return { matches: true };
  }
}
