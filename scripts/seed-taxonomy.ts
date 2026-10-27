import { pool } from '../lib/db';

const MOODS = [
  { name: 'Healing & Warmth', name_ko: '힐링 & 따뜻한', slug: 'healing', icon: 'Sun' },
  { name: 'Melancholy & Resonance', name_ko: '먹먹한 & 깊은 여운', slug: 'melancholy', icon: 'CloudRain' },
  { name: 'Heart-fluttering Romance', name_ko: '심쿵 & 설레는 로맨스', slug: 'romance', icon: 'Heart' },
  { name: 'High-Tension Thriller', name_ko: '짜릿한 긴장감 & 스릴러', slug: 'thriller', icon: 'Zap' },
  { name: 'Soulful Tearjerker', name_ko: '눈물 쏙 빼는 감동', slug: 'tearjerker', icon: 'Droplets' },
  { name: 'Witty & Comedic', name_ko: '유쾌한 힐링 코미디', slug: 'comedy', icon: 'Smile' },
  { name: 'Dark Revenge & Justice', name_ko: '통쾌한 복수 & 정의', slug: 'revenge', icon: 'Flame' },
  { name: 'Nostalgic Youth', name_ko: '그 시절 우리의 청춘', slug: 'youth', icon: 'Sparkles' },
];

const GENRES = [
  { tmdb_id: 18, name: 'Drama', name_ko: '드라마', slug: 'drama' },
  { tmdb_id: 10759, name: 'Action & Adventure', name_ko: '액션 & 모험', slug: 'action-adventure' },
  { tmdb_id: 35, name: 'Comedy', name_ko: '코미디', slug: 'comedy' },
  { tmdb_id: 80, name: 'Crime', name_ko: '범죄', slug: 'crime' },
  { tmdb_id: 9648, name: 'Mystery', name_ko: '미스터리', slug: 'mystery' },
  { tmdb_id: 10765, name: 'Sci-Fi & Fantasy', name_ko: 'SF & 판타지', slug: 'sci-fi-fantasy' },
  { tmdb_id: 10766, name: 'Soap', name_ko: '일일극 & 연속극', slug: 'soap' },
  { tmdb_id: 10768, name: 'War & Politics', name_ko: '정치 & 전쟁', slug: 'war-politics' },
  { tmdb_id: 10751, name: 'Family', name_ko: '가족', slug: 'family' },
  { tmdb_id: 99, name: 'Documentary', name_ko: '다큐멘터리', slug: 'documentary' },
];

async function seedTaxonomy() {
  console.log('[Seed] Seeding Moods and Genres...');
  const client = await pool.connect();
  try {
    for (const mood of MOODS) {
      await client.query(
        `INSERT INTO moods (name, name_ko, slug, icon)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name, name_ko = EXCLUDED.name_ko, icon = EXCLUDED.icon`,
        [mood.name, mood.name_ko, mood.slug, mood.icon]
      );
    }

    for (const genre of GENRES) {
      await client.query(
        `INSERT INTO genres (tmdb_id, name, name_ko, slug)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (tmdb_id) DO UPDATE
         SET name = EXCLUDED.name, name_ko = EXCLUDED.name_ko, slug = EXCLUDED.slug`,
        [genre.tmdb_id, genre.name, genre.name_ko, genre.slug]
      );
    }
    console.log('[Seed] Moods and Genres seeded successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

seedTaxonomy().catch((err) => {
  console.error('[Seed] Error seeding taxonomy:', err);
  process.exit(1);
});
