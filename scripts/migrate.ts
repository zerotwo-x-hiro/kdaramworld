import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.argv.includes('--test');
const connectionString = isTest
  ? (process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kdramaworld_test')
  : (process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/kdramaworld');

const needsSsl = connectionString.includes('supabase.com') ||
  connectionString.includes('sslmode=require');

const pool = new Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});

async function runMigrations() {
  console.log(`[Migrations] Connecting to ${isTest ? 'TEST' : 'MAIN'} database...`);
  const client = await pool.connect();
  try {
    // Ensure migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('[Migrations] No migrations directory found.');
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    const { rows: appliedRows } = await client.query('SELECT version FROM schema_migrations');
    const appliedSet = new Set(appliedRows.map((r) => r.version));

    let count = 0;
    for (const file of files) {
      if (appliedSet.has(file)) {
        continue;
      }

      console.log(`[Migrations] Applying ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`[Migrations] Successfully applied ${file}`);
        count++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[Migrations] Failed to apply ${file}:`, err);
        throw err;
      }
    }

    console.log(`[Migrations] Completed. Applied ${count} new migration(s).`);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('[Migrations] Fatal error:', err);
  process.exit(1);
});
