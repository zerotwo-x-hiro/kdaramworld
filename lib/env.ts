import 'server-only';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/kdramaworld'),
  TEST_DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/kdramaworld_test'),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
  AUTH_SECRET: z.string().min(16, 'AUTH_SECRET must be at least 16 characters').default('development-insecure-secret-key-32-chars-long!'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_EMAILS: z.string().default(''),
  TMDB_ACCESS_TOKEN: z.string().optional(),
  OMDB_API_KEY: z.string().optional(),
  CRON_SECRET: z.string().default('dev-cron-secret'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsedEnv = envSchema.safeParse(process.env);

export const env = parsedEnv.success ? parsedEnv.data : {
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kdramaworld',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kdramaworld_test',
  DATABASE_POOL_MAX: 10,
  AUTH_SECRET: process.env.AUTH_SECRET || 'development-insecure-secret-key-32-chars-long!',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || '',
  TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
  OMDB_API_KEY: process.env.OMDB_API_KEY,
  CRON_SECRET: process.env.CRON_SECRET || 'dev-cron-secret',
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
};

export function getAdminEmails(): string[] {
  return env.ADMIN_EMAILS.split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
