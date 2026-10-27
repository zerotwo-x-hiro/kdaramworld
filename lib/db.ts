import 'server-only';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

// Global singleton pattern to prevent multiple pools during Next.js hot reload
declare global {
  // eslint-disable-next-line no-var
  var __kdramaPool: Pool | undefined;
}

function createPool(): Pool {
  const isTest = process.env.NODE_ENV === 'test';
  const connectionString = (isTest && env.TEST_DATABASE_URL) ? env.TEST_DATABASE_URL : env.DATABASE_URL;

  const needsSsl = connectionString.includes('supabase.com') ||
    connectionString.includes('sslmode=require') ||
    connectionString.includes('sslmode=prefer');

  const poolConfig = {
    connectionString,
    max: isTest ? 5 : env.DATABASE_POOL_MAX,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  };

  return new Pool(poolConfig);
}

export const pool = globalThis.__kdramaPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__kdramaPool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    return res;
  } catch (error) {
    console.error('[Database Error]', {
      text: text.slice(0, 200),
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (globalThis.__kdramaPool) {
    await globalThis.__kdramaPool.end();
    globalThis.__kdramaPool = undefined;
  }
}
