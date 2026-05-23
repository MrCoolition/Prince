import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveProgress } from './_db';
import {
  HttpError,
  applyRateLimit,
  boundedInteger,
  boundedText,
  safeId,
  sendHttpError,
  sessionStudentId
} from './_security';

const allowedStatuses = new Set(['started', 'answered', 'mastered']);

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!applyRateLimit(req, res, 'progress', 60, 60_000)) {
    return;
  }

  const body = (req.body ?? {}) as {
    lessonId?: string;
    tutorId?: string;
    status?: 'started' | 'answered' | 'mastered';
    answer?: string;
    score?: number;
  };

  try {
    const status = boundedText(body.status, 'status', 16) as 'started' | 'answered' | 'mastered';
    if (!allowedStatuses.has(status)) {
      throw new HttpError(400, 'status is invalid');
    }

    await saveProgress({
      studentId: sessionStudentId(req, res),
      lessonId: safeId(body.lessonId, 'lessonId'),
      tutorId: safeId(body.tutorId, 'tutorId'),
      status,
      answer: boundedText(body.answer, 'answer', 1500, false) || undefined,
      score: boundedInteger(body.score, 'score', 0, 100, 0)
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    sendHttpError(res, error);
  }
}
