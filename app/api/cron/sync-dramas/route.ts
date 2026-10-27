import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { env } from '@/lib/env';
import { runTmdbSync } from '@/lib/sync/tmdb-sync';

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
    const summary = await runTmdbSync({
      maxDiscoveryPages: 2,
      maxOldestRefresh: 10,
      syncAiring: true,
    });

    // Invalidate cached catalog views
    try {
      revalidateTag('dramas');
      revalidatePath('/');
      revalidatePath('/discover');
    } catch (e) {
      console.warn('[Cron] revalidate notice:', e);
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('[Cron sync-dramas] Unhandled error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
