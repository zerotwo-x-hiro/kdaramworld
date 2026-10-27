import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query<{ count: string }>('SELECT count(*) FROM dramas');
    const dramasCount = parseInt(res.rows[0]?.count || '0', 10);

    return NextResponse.json(
      {
        ok: true,
        dramas: dramasCount,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Healthcheck Failed]', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Database connection error',
      },
      { status: 503 }
    );
  }
}
