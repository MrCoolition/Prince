import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { boundedNumber, boundedText, handleRouteError, rateLimit, safeId } from '@/lib/server-security';

export const runtime = 'nodejs';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
const sql = connectionString ? neon(connectionString) : null;

export async function POST(request: Request) {
  const limited = rateLimit(request, 'progress', 60, 60_000);
  if (limited) {
    return limited;
  }

  try {
    const body = await request.json();
    const princeId = await sessionId();
    const payload = {
      princeId,
      chamberId: safeId(body.chamberId, 'great-hall'),
      tier: boundedNumber(body.tier, 1, 100, 1),
      score: boundedNumber(body.score, 0, 100, 0),
      relic: boundedText(body.relic, 'relic', 100, false),
      answer: boundedText(body.answer, 'answer', 700, false)
    };

    if (sql && process.env.PRINCE_AUTO_MIGRATE === 'true') {
      await sql`
        create table if not exists formation_events (
          id bigserial primary key,
          prince_id text not null,
          chamber_id text not null,
          tier integer not null,
          score integer not null,
          relic text,
          answer text,
          created_at timestamptz not null default now()
        )
      `;
      await sql`
        insert into formation_events (prince_id, chamber_id, tier, score, relic, answer)
        values (${payload.princeId}, ${payload.chamberId}, ${payload.tier}, ${payload.score}, ${payload.relic}, ${payload.answer})
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function sessionId() {
  const store = await cookies();
  const existing = store.get('pa_sid')?.value;
  if (existing && /^pa_[0-9a-f-]{36}$/i.test(existing)) {
    return existing;
  }

  const next = `pa_${randomUUID()}`;
  store.set('pa_sid', next, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  });
  return next;
}
