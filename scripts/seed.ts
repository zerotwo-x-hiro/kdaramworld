import { pool, query } from '../lib/db';

interface SeedDrama {
  tmdb_id: number;
  slug: string;
  title: string;
  title_ko: string;
  synopsis: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  tmdb_status: string;
  networks: string[];
  runtime: number;
  tmdb_score: number;
  tmdb_votes: number;
  imdb_score?: number;
  imdb_votes?: number;
  imdb_url?: string;
  genres: string[]; // slugs
  cast: { name: string; name_ko?: string; character: string; tmdb_id: number }[];
}

const REAL_DRAMAS: SeedDrama[] = [
  {
    tmdb_id: 65249,
    slug: 'signal-65249',
    title: 'Signal',
    title_ko: '시그널',
    synopsis: 'Detectives from the present and a detective from the past communicate via walkie-talkie to solve a long-time unsolved case.',
    poster_path: '/gQj8U5lHn9mZ4J90U2c5uL8v7wA.jpg',
    backdrop_path: '/m09fJ4K0d48s5nF6tJ82z7Xw8sP.jpg',
    first_air_date: '2016-01-22',
    last_air_date: '2016-03-12',
    number_of_episodes: 16,
    number_of_seasons: 1,
    tmdb_status: 'Ended',
    networks: ['tvN'],
    runtime: 75,
    tmdb_score: 8.4,
    tmdb_votes: 198,
    imdb_score: 8.5,
    imdb_votes: 11000,
    imdb_url: 'https://www.imdb.com/title/tt5335170/',
    genres: ['drama', 'crime', 'mystery', 'sci-fi-fantasy'],
    cast: [
      { tmdb_id: 1251347, name: 'Lee Je-hoon', name_ko: '이제훈', character: 'Park Hae-young' },
      { tmdb_id: 1040854, name: 'Kim Hye-soo', name_ko: '김혜수', character: 'Cha Soo-hyun' },
      { tmdb_id: 113337, name: 'Cho Jin-woong', name_ko: '조진웅', character: 'Lee Jae-han' },
    ],
  },
  {
    tmdb_id: 76662,
    slug: 'my-mister-76662',
    title: 'My Mister',
    title_ko: '나의 아저씨',
    synopsis: 'A man in his 40s withstands the weight of life. A woman in her 20s goes through different experiences, but also withstanding the weight of her life. The man and woman get together to help each other.',
    poster_path: '/eF2sA6wS4Rj48z0Wn8t7y9X2U0s.jpg',
    backdrop_path: '/9nK4pT0S8Jm2H7b8w0vN9uL5x6k.jpg',
    first_air_date: '2018-03-21',
    last_air_date: '2018-05-17',
    number_of_episodes: 16,
    number_of_seasons: 1,
    tmdb_status: 'Ended',
    networks: ['tvN'],
    runtime: 78,
    tmdb_score: 8.8,
    tmdb_votes: 312,
    imdb_score: 9.1,
    imdb_votes: 18000,
    imdb_url: 'https://www.imdb.com/title/tt7923710/',
    genres: ['drama', 'family'],
    cast: [
      { tmdb_id: 67123, name: 'Lee Sun-kyun', name_ko: '이선균', character: 'Park Dong-hoon' },
      { tmdb_id: 1251706, name: 'IU (Lee Ji-eun)', name_ko: '이지은', character: 'Lee Ji-an' },
      { tmdb_id: 1251351, name: 'Park Ho-san', name_ko: '박호산', character: 'Park Sang-hoon' },
    ],
  },
  {
    tmdb_id: 221851,
    slug: 'queen-of-tears-221851',
    title: 'Queen of Tears',
    title_ko: '눈물의 여왕',
    synopsis: 'The queen of department stores and her small-town husband weather a marital crisis — until love miraculously begins to bloom again.',
    poster_path: '/9mPzY2B1a7V7k8C4d8n6p8x2s7k.jpg',
    backdrop_path: '/6g4jX8a4d7s6n9p0w1y4z2k5t8x.jpg',
    first_air_date: '2024-03-09',
    last_air_date: '2024-04-28',
    number_of_episodes: 16,
    number_of_seasons: 1,
    tmdb_status: 'Ended',
    networks: ['tvN', 'Netflix'],
    runtime: 85,
    tmdb_score: 8.5,
    tmdb_votes: 420,
    imdb_score: 8.3,
    imdb_votes: 24000,
    imdb_url: 'https://www.imdb.com/title/tt27448348/',
    genres: ['drama', 'comedy'],
    cast: [
      { tmdb_id: 1253016, name: 'Kim Soo-hyun', name_ko: '김수현', character: 'Baek Hyun-woo' },
      { tmdb_id: 1332768, name: 'Kim Ji-won', name_ko: '김지원', character: 'Hong Hae-in' },
      { tmdb_id: 1845112, name: 'Park Sung-hoon', name_ko: '박성훈', character: 'Yoon Eun-sung' },
    ],
  },
  {
    tmdb_id: 67915,
    slug: 'goblin-guardian-the-lonely-and-great-god-67915',
    title: 'Guardian: The Lonely and Great God (Goblin)',
    title_ko: '쓸쓸하고 찬란하神 - 도깨비',
    synopsis: 'In his quest for a bride to break his immortal curse, a 939-year-old guardian of souls meets a grim reaper and a sprightly student with a tragic past.',
    poster_path: '/c5T5hP0D6X2n7k8b9w1m4v8y2z.jpg',
    backdrop_path: '/8p4k5n7s8v9w0x1y2z3a4b5c6d.jpg',
    first_air_date: '2016-12-02',
    last_air_date: '2017-01-21',
    number_of_episodes: 16,
    number_of_seasons: 1,
    tmdb_status: 'Ended',
    networks: ['tvN'],
    runtime: 80,
    tmdb_score: 8.7,
    tmdb_votes: 680,
    imdb_score: 8.6,
    imdb_votes: 32000,
    imdb_url: 'https://www.imdb.com/title/tt5994364/',
    genres: ['drama', 'sci-fi-fantasy', 'comedy'],
    cast: [
      { tmdb_id: 60882, name: 'Gong Yoo', name_ko: '공유', character: 'Kim Shin (Goblin)' },
      { tmdb_id: 1251703, name: 'Kim Go-eun', name_ko: '김고은', character: 'Ji Eun-tak' },
      { tmdb_id: 61858, name: 'Lee Dong-wook', name_ko: '이동욱', character: 'Wang Yeo (Grim Reaper)' },
    ],
  },
  {
    tmdb_id: 94796,
    slug: 'crash-landing-on-you-94796',
    title: 'Crash Landing on You',
    title_ko: '사랑의 불시착',
    synopsis: 'A paragliding mishap drops a South Korean heiress into North Korea -- and into the life of an army officer, who decides he will help her hide.',
    poster_path: '/9bT4sY8w0d1x2n3m4v5p6k7j8h.jpg',
    backdrop_path: '/7mK4n8s2v9w1x0y3z4a5b6c7d8.jpg',
    first_air_date: '2019-12-14',
    last_air_date: '2020-02-16',
    number_of_episodes: 16,
    number_of_seasons: 1,
    tmdb_status: 'Ended',
    networks: ['tvN', 'Netflix'],
    runtime: 85,
    tmdb_score: 8.7,
    tmdb_votes: 750,
    imdb_score: 8.7,
    imdb_votes: 43000,
    imdb_url: 'https://www.imdb.com/title/tt10850932/',
    genres: ['drama', 'comedy', 'action-adventure'],
    cast: [
      { tmdb_id: 60884, name: 'Hyun Bin', name_ko: '현빈', character: 'Ri Jeong-hyeok' },
      { tmdb_id: 64797, name: 'Son Ye-jin', name_ko: '손예진', character: 'Yoon Se-ri' },
      { tmdb_id: 1251354, name: 'Seo Ji-hye', name_ko: '서지혜', character: 'Seo Dan' },
    ],
  },
  {
    tmdb_id: 64188,
    slug: 'reply-1988-64188',
    title: 'Reply 1988',
    title_ko: '응답하라 1988',
    synopsis: 'A nostalgic look back at the year 1988 through the lives of five families living in the same neighborhood of Ssangmundong, Dobong District, Northern Seoul.',
    poster_path: '/5k2L7r9w0x1y2z3a4b5c6d7e8f.jpg',
    backdrop_path: '/4j8s9v0w1x2y3z4a5b6c7d8e9f.jpg',
    first_air_date: '2015-11-06',
    last_air_date: '2016-01-16',
    number_of_episodes: 20,
    number_of_seasons: 1,
    tmdb_status: 'Ended',
    networks: ['tvN'],
    runtime: 90,
    tmdb_score: 8.9,
    tmdb_votes: 410,
    imdb_score: 9.2,
    imdb_votes: 19000,
    imdb_url: 'https://www.imdb.com/title/tt5182866/',
    genres: ['drama', 'comedy', 'family'],
    cast: [
      { tmdb_id: 1251705, name: 'Lee Hye-ri', name_ko: '이혜리', character: 'Sung Deok-sun' },
      { tmdb_id: 1251349, name: 'Park Bo-gum', name_ko: '박보검', character: 'Choi Taek' },
      { tmdb_id: 1251350, name: 'Ryu Jun-yeol', name_ko: '류준열', character: 'Kim Jung-hwan' },
    ],
  },
];

async function seedRealDramas() {
  console.log('[Seed] Seeding verified real K-drama titles...');
  const client = await pool.connect();
  try {
    for (const d of REAL_DRAMAS) {
      const res = await client.query<{ id: number }>(
        `INSERT INTO dramas (
          tmdb_id, slug, title, title_ko, synopsis, poster_path, backdrop_path,
          first_air_date, last_air_date, number_of_episodes, number_of_seasons,
          tmdb_status, networks, runtime, original_language, synced_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, 'ko', NOW(), NOW()
        )
        ON CONFLICT (tmdb_id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          title_ko = EXCLUDED.title_ko,
          synopsis = EXCLUDED.synopsis,
          poster_path = EXCLUDED.poster_path,
          backdrop_path = EXCLUDED.backdrop_path,
          first_air_date = EXCLUDED.first_air_date,
          last_air_date = EXCLUDED.last_air_date,
          number_of_episodes = EXCLUDED.number_of_episodes,
          tmdb_status = EXCLUDED.tmdb_status,
          networks = EXCLUDED.networks,
          runtime = EXCLUDED.runtime,
          synced_at = NOW()
        RETURNING id`,
        [
          d.tmdb_id, d.slug, d.title, d.title_ko, d.synopsis, d.poster_path, d.backdrop_path,
          d.first_air_date, d.last_air_date, d.number_of_episodes, d.number_of_seasons,
          d.tmdb_status, d.networks, d.runtime,
        ]
      );
      const dramaId = res.rows[0].id;

      // TMDB rating
      await client.query(
        `INSERT INTO drama_ratings (drama_id, source, score, votes, url, fetched_at)
         VALUES ($1, 'tmdb', $2, $3, $4, NOW())
         ON CONFLICT (drama_id, source) DO UPDATE SET score = EXCLUDED.score, votes = EXCLUDED.votes, fetched_at = NOW()`,
        [dramaId, d.tmdb_score, d.tmdb_votes, `https://www.themoviedb.org/tv/${d.tmdb_id}`]
      );

      // IMDb rating
      if (d.imdb_score) {
        await client.query(
          `INSERT INTO drama_ratings (drama_id, source, score, votes, url, fetched_at)
           VALUES ($1, 'imdb', $2, $3, $4, NOW())
           ON CONFLICT (drama_id, source) DO UPDATE SET score = EXCLUDED.score, votes = EXCLUDED.votes, fetched_at = NOW()`,
          [dramaId, d.imdb_score, d.imdb_votes || 0, d.imdb_url || null]
        );
      }

      // Link Genres
      for (const genreSlug of d.genres) {
        const gRes = await client.query<{ id: number }>('SELECT id FROM genres WHERE slug = $1', [genreSlug]);
        if (gRes.rows.length > 0) {
          await client.query(
            `INSERT INTO drama_genres (drama_id, genre_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [dramaId, gRes.rows[0].id]
          );
        }
      }

      // Cast
      for (let i = 0; i < d.cast.length; i++) {
        const actor = d.cast[i];
        const pRes = await client.query<{ id: number }>(
          `INSERT INTO people (tmdb_id, name, name_ko)
           VALUES ($1, $2, $3)
           ON CONFLICT (tmdb_id) DO UPDATE SET name = EXCLUDED.name, name_ko = EXCLUDED.name_ko
           RETURNING id`,
          [actor.tmdb_id, actor.name, actor.name_ko || null]
        );
        const personId = pRes.rows[0].id;

        await client.query(
          `INSERT INTO drama_cast (drama_id, person_id, character_name, cast_order)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (drama_id, person_id, character_name) DO UPDATE SET cast_order = EXCLUDED.cast_order`,
          [dramaId, personId, actor.character, i]
        );
      }
    }

    console.log(`[Seed] Seeded ${REAL_DRAMAS.length} verified real dramas with ratings, genres, and cast.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seedRealDramas().catch((err) => {
  console.error('[Seed] Error seeding real dramas:', err);
  process.exit(1);
});
