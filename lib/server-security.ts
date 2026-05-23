import { NextResponse } from 'next/server';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function boundedText(value: unknown, field: string, maxLength: number, required = true): string {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text && required) {
    throw new HttpError(400, `${field} is required`);
  }
  if (text.length > maxLength) {
    throw new HttpError(413, `${field} must be ${maxLength} characters or fewer`);
  }
  return text;
}

export function boundedNumber(value: unknown, min: number, max: number, fallback = min): number {
  const next = value === undefined || value === null || value === '' ? fallback : Number(value);
  if (!Number.isFinite(next)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, Math.round(next)));
}

export function safeId(value: unknown, fallback = 'unknown'): string {
  const text = typeof value === 'string' ? value.trim() : fallback;
  return /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(text) ? text : fallback;
}

export function rateLimit(request: Request, scope: string, maxRequests: number, windowMs: number): NextResponse | null {
  const key = `${scope}:${clientKey(request)}`;
  const now = Date.now();
  const current = buckets.get(key);
  const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests. Try again soon.' },
      {
        status: 429,
        headers: { 'retry-after': String(Math.ceil((bucket.resetAt - now) / 1000)) }
      }
    );
  }

  if (buckets.size > 1000) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetAt <= now) {
        buckets.delete(bucketKey);
      }
    }
  }

  return null;
}

export async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  return NextResponse.json({ error: 'Request failed' }, { status: 500 });
}

export class HttpError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message);
  }
}

function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}
