import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { env } from '@/lib/env';
import { runImdbRatingsSync } from '@/lib/sync/imdb-ratings';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expectedAuth = `Bearer ${env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedAuth) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing Bearer token' },
      { status: 401 }
    );
  }

  try {
    const summary = await runImdbRatingsSync({ maxTitles: 30 });

    try {
      revalidateTag('dramas');
    } catch (e) {
      console.warn('[Cron ratings] revalidate notice:', e);
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('[Cron sync-ratings] Unhandled error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
