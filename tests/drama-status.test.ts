import { describe, it, expect } from 'vitest';
import { deriveDramaStatus, getKSTDateString } from '@/lib/drama-status';

describe('deriveDramaStatus() - Canonical Status Determination in KST', () => {
  // Use a fixed reference time: 2026-10-28 12:00:00 KST (which is 2026-10-28 03:00:00 UTC)
  const nowKST = '2026-10-28T03:00:00Z'; // 2026-10-28 in KST

  it('correctly computes KST date string across timezones and midnight boundary', () => {
    // 2026-10-27 15:30:00 UTC is 2026-10-28 00:30:00 in Seoul (UTC+9)
    expect(getKSTDateString(new Date('2026-10-27T15:30:00Z'))).toBe('2026-10-28');
    // 2026-10-27 14:30:00 UTC is 2026-10-27 23:30:00 in Seoul
    expect(getKSTDateString(new Date('2026-10-27T14:30:00Z'))).toBe('2026-10-27');
  });

  describe('Upcoming Status', () => {
    it('returns upcoming if first_air_date is strictly in the future', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2026-11-01',
          number_of_episodes: 16,
          tmdb_status: 'Planned',
        },
        nowKST
      );
      expect(status).toBe('upcoming');
    });

    it('returns upcoming if air date is missing but TMDB status is Planned or In Production', () => {
      expect(
        deriveDramaStatus({ tmdb_status: 'Planned' }, nowKST)
      ).toBe('upcoming');

      expect(
        deriveDramaStatus({ tmdb_status: 'In Production' }, nowKST)
      ).toBe('upcoming');

      expect(
        deriveDramaStatus({ first_air_date: null, tmdb_status: 'Post Production' }, nowKST)
      ).toBe('upcoming');
    });
  });

  describe('STRICT INVARIANT: Past first_air_date can NEVER be upcoming', () => {
    it('never returns upcoming for a past drama even if TMDB status erroneously says Planned', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2021-09-17', // Squid Game release
          tmdb_status: 'Planned', // Even if buggy seed had "Planned"
          number_of_episodes: 9,
          last_episode_number: 9,
        },
        nowKST
      );
      expect(status).not.toBe('upcoming');
      expect(status).toBe('ended');
    });

    it('never returns upcoming for a drama that premiered yesterday', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2026-10-27',
          next_episode_air_date: '2026-10-29',
          number_of_episodes: 16,
          last_episode_number: 1,
        },
        nowKST
      );
      expect(status).toBe('airing');
    });

    it('flips to airing on the exact premiere date in KST', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2026-10-28',
          number_of_episodes: 12,
          last_episode_number: 1,
          next_episode_air_date: '2026-10-29',
        },
        nowKST
      );
      expect(status).toBe('airing');
    });
  });

  describe('Airing Status', () => {
    it('returns airing if drama has a scheduled next episode', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2026-10-01',
          next_episode_air_date: '2026-10-30',
          number_of_episodes: 16,
          last_episode_number: 8,
          tmdb_status: 'Returning Series',
        },
        nowKST
      );
      expect(status).toBe('airing');
    });

    it('returns airing if status is Returning Series', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2026-08-01',
          number_of_episodes: 20,
          last_episode_number: 12,
          tmdb_status: 'Returning Series',
        },
        nowKST
      );
      expect(status).toBe('airing');
    });

    it('returns airing if not all episodes have aired yet', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2026-10-10',
          number_of_episodes: 16,
          last_episode_number: 6,
          tmdb_status: '',
        },
        nowKST
      );
      expect(status).toBe('airing');
    });
  });

  describe('Ended Status', () => {
    it('returns ended if TMDB status is explicitly Ended', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2020-02-01',
          last_air_date: '2020-04-01',
          number_of_episodes: 16,
          last_episode_number: 16,
          tmdb_status: 'Ended',
        },
        nowKST
      );
      expect(status).toBe('ended');
    });

    it('returns ended if TMDB status is Canceled', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2023-01-01',
          tmdb_status: 'Canceled',
        },
        nowKST
      );
      expect(status).toBe('ended');
    });

    it('flips to ended once all episodes are aired', () => {
      const status = deriveDramaStatus(
        {
          first_air_date: '2026-09-01',
          last_air_date: '2026-10-25',
          number_of_episodes: 16,
          last_episode_number: 16,
          next_episode_air_date: null,
        },
        nowKST
      );
      expect(status).toBe('ended');
    });
  });
});
