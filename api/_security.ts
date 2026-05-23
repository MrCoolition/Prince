import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const sessionCookieName = 'pa_sid';
const sessionPattern = /^pa_[0-9a-f-]{36}$/i;

export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function sendHttpError(res: VercelResponse, error: unknown): void {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof Error && statusCode < 500 ? error.message : 'Request failed';
  res.status(statusCode).json({ error: message });
}

export function applyRateLimit(
  req: VercelRequest,
  res: VercelResponse,
  scope: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const key = `${scope}:${clientKey(req)}`;
  const current = buckets.get(key);
  const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };

  bucket.count += 1;
  buckets.set(key, bucket);

  const remaining = Math.max(0, maxRequests - bucket.count);
  res.setHeader('x-ratelimit-limit', String(maxRequests));
  res.setHeader('x-ratelimit-remaining', String(remaining));
  res.setHeader('x-ratelimit-reset', String(Math.ceil(bucket.resetAt / 1000)));

  if (bucket.count > maxRequests) {
    res.setHeader('retry-after', String(Math.ceil((bucket.resetAt - now) / 1000)));
    res.status(429).json({ error: 'Too many requests. Try again soon.' });
    return false;
  }

  pruneBuckets(now);
  return true;
}

export function sessionStudentId(req: VercelRequest, res: VercelResponse): string {
  const existing = readCookie(req, sessionCookieName);
  if (existing && sessionPattern.test(existing)) {
    return existing;
  }

  const next = `pa_${randomUUID()}`;
  const secure = process.env['VERCEL_ENV'] && process.env['VERCEL_ENV'] !== 'development' ? '; Secure' : '';
  res.setHeader(
    'set-cookie',
    `${sessionCookieName}=${next}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`
  );
  return next;
}

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

export function safeId(value: unknown, field: string): string {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!/^[a-z0-9][a-z0-9_-]{0,63}$/i.test(text)) {
    throw new HttpError(400, `${field} is invalid`);
  }
  return text;
}

export function boundedInteger(value: unknown, field: string, min: number, max: number, fallback = min): number {
  const number = value === undefined || value === null || value === '' ? fallback : Number(value);
  if (!Number.isFinite(number)) {
    throw new HttpError(400, `${field} is invalid`);
  }
  return Math.max(min, Math.min(max, Math.round(number)));
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function clientKey(req: VercelRequest): string {
  const forwarded = firstHeader(req.headers['x-forwarded-for']);
  const realIp = firstHeader(req.headers['x-real-ip']);
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
}

function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function readCookie(req: VercelRequest, name: string): string | undefined {
  const cookie = firstHeader(req.headers.cookie);
  if (!cookie) {
    return undefined;
  }

  const found = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!found) {
    return undefined;
  }

  try {
    return decodeURIComponent(found.slice(name.length + 1));
  } catch {
    return undefined;
  }
}

function pruneBuckets(now: number): void {
  if (buckets.size < 1000) {
    return;
  }

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}
