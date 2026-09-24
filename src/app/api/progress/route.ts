/**
 * Progress sync endpoint, backed by MongoDB Atlas.
 *
 * GET  /api/progress  -> the saved document (solved flags, notes, your code)
 * POST /api/progress  -> upsert the whole document
 *
 * The wire format is exactly the ProgressDoc the browser keeps locally, so the
 * local copy can be pushed up unchanged and works as an offline cache.
 */

import { NextResponse } from 'next/server';
import { PROGRESS_DOC_ID, mongoConfigured, progressCollection } from '@/lib/mongo';
import type { ProgressDoc } from '@/lib/types';

// This route touches a live database, so it must never be statically cached.
export const dynamic = 'force-dynamic';

function emptyDoc(): ProgressDoc {
  return { version: 1, problems: {}, updatedAt: new Date().toISOString() };
}

export async function GET() {
  if (!mongoConfigured) {
    return NextResponse.json(
      { error: 'MONGODB_URI is not set; running on local storage only.' },
      { status: 501 },
    );
  }

  try {
    const col = await progressCollection();
    const found = await col.findOne({ _id: PROGRESS_DOC_ID });

    // Nothing saved yet is a normal first-run state, not an error.
    if (!found) return NextResponse.json(emptyDoc());

    const { _id, ...doc } = found;
    void _id; // the client does not need Mongo's key
    return NextResponse.json(doc);
  } catch (err) {
    // Surface the reason (bad password, IP not allow-listed, cluster paused)
    // so the banner in the UI can say something useful.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to read progress' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!mongoConfigured) {
    return NextResponse.json(
      { error: 'MONGODB_URI is not set; running on local storage only.' },
      { status: 501 },
    );
  }

  let doc: ProgressDoc;
  try {
    doc = (await request.json()) as ProgressDoc;
  } catch {
    return NextResponse.json({ error: 'Body was not valid JSON' }, { status: 400 });
  }

  // Reject anything that is not a progress document rather than writing junk
  // into the collection.
  if (doc?.version !== 1 || typeof doc.problems !== 'object' || doc.problems === null) {
    return NextResponse.json({ error: 'Unexpected document shape' }, { status: 400 });
  }

  try {
    const col = await progressCollection();
    await col.updateOne(
      { _id: PROGRESS_DOC_ID },
      { $set: { version: 1, problems: doc.problems, updatedAt: new Date().toISOString() } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true, problems: Object.keys(doc.problems).length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save progress' },
      { status: 500 },
    );
  }
}
