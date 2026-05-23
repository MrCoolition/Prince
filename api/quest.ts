import { createHash } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLesson, getQuest } from './_db';
import {
  applyRateLimit,
  boundedInteger,
  boundedText,
  fetchWithTimeout,
  safeId,
  sendHttpError
} from './_security';

type AnswerResult = {
  correct: boolean;
  mentorLine: string;
  expected: string;
  stretch: string;
};

const answerCache = new Map<string, { expiresAt: number; value: AnswerResult }>();
const cacheTtlMs = Number(process.env['OPENAI_RESPONSE_CACHE_TTL_MS'] || 24 * 60 * 60 * 1000);
const cheapModel = process.env['OPENAI_CHEAP_MODEL'] || 'gpt-4o-mini';
const premiumMode = process.env['OPENAI_COST_MODE'] === 'premium';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method === 'GET') {
    if (!applyRateLimit(req, res, 'quest:get', 120, 60_000)) {
      return;
    }

    try {
      const tutorId = readSingle(req.query['tutorId']) || 'aurelius';
      const level = boundedInteger(readSingle(req.query['level']), 'level', 1, 100, 1);
      const quest = await getQuest(safeId(tutorId, 'tutorId'), level);
      res.status(200).json({ quest });
    } catch (error) {
      sendHttpError(res, error);
    }
    return;
  }

  if (req.method === 'POST') {
    if (!applyRateLimit(req, res, 'quest:post', 30, 60_000)) {
      return;
    }

    try {
      const { lessonId, answer } = (req.body ?? {}) as { lessonId?: string; answer?: string };
      const safeLessonId = safeId(lessonId, 'lessonId');
      const childAnswer = boundedText(answer, 'answer', 1200);

      const lesson = await getLesson(safeLessonId);
      if (!lesson) {
        res.status(404).json({ error: 'Lesson not found' });
        return;
      }

      const fallback = deterministicResult(childAnswer, lesson.answer, lesson.praise, lesson.stretch);

      if (process.env['OPENAI_API_KEY']) {
        const result = await askOpenAI({
          lessonTitle: lesson.title,
          prompt: lesson.prompt,
          expectedAnswer: lesson.answer,
          childAnswer,
          fallback
        });
        res.status(200).json(result);
        return;
      }

      res.status(200).json(fallback);
    } catch (error) {
      sendHttpError(res, error);
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}

async function askOpenAI(input: {
  lessonTitle: string;
  prompt: string;
  expectedAnswer: string;
  childAnswer: string;
  fallback: AnswerResult;
}): Promise<AnswerResult> {
  const key = cacheKey(input);
  const cached = readCachedAnswer(key);
  if (cached) {
    return cached;
  }

  const preferredModel = premiumMode ? process.env['OPENAI_MODEL'] || 'gpt-5.5-pro' : cheapModel;
  const models = premiumMode
    ? [...new Set([preferredModel, cheapModel, 'gpt-4.1-mini'])]
    : [cheapModel];

  for (const model of models) {
    const payload: Record<string, unknown> = {
      model,
      max_output_tokens: 220,
      instructions: 'You are a wise Prince Academy tutor for a four-year-old. Return only compact JSON with keys correct, mentorLine, and stretch. Be warm, concrete, noble, and never shaming.',
      input: JSON.stringify({
        lessonTitle: input.lessonTitle,
        prompt: input.prompt,
        expectedAnswer: input.expectedAnswer,
        childAnswer: input.childAnswer
      })
    };

    if (premiumMode && /^gpt-5|^o\d/i.test(model)) {
      payload.reasoning = { effort: process.env['OPENAI_REASONING_EFFORT'] || 'high' };
    }

    let response: Response;
    try {
      response = await fetchWithTimeout('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${process.env['OPENAI_API_KEY']}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      }, 10_000);
    } catch {
      continue;
    }

    if (!response.ok) {
      continue;
    }

    try {
      const data = await response.json();
      const text = data.output_text || extractOutputText(data);
      const parsed = JSON.parse(text);
      const result = {
        correct: Boolean(parsed.correct),
        mentorLine: String(parsed.mentorLine || input.fallback.mentorLine).slice(0, 300),
        expected: input.expectedAnswer,
        stretch: String(parsed.stretch || input.fallback.stretch).slice(0, 300)
      };
      writeCachedAnswer(key, result);
      return result;
    } catch {
      continue;
    }
  }

  return input.fallback;
}

function deterministicResult(answer: string, expectedAnswer: string, praise: string, stretch: string): AnswerResult {
  const correct = normalize(answer) === normalize(expectedAnswer);
  return {
    correct,
    mentorLine: correct
      ? praise
      : `A prince may miss once and still learn. The answer I was guarding is: ${expectedAnswer}.`,
    expected: expectedAnswer,
    stretch
  };
}

function readSingle(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function cacheKey(input: {
  lessonTitle: string;
  prompt: string;
  expectedAnswer: string;
  childAnswer: string;
}): string {
  return createHash('sha256')
    .update(JSON.stringify({
      lessonTitle: input.lessonTitle,
      prompt: input.prompt,
      expectedAnswer: input.expectedAnswer,
      childAnswer: normalize(input.childAnswer)
    }))
    .digest('hex');
}

function readCachedAnswer(key: string): AnswerResult | undefined {
  const cached = answerCache.get(key);
  if (!cached) {
    return undefined;
  }
  if (cached.expiresAt <= Date.now()) {
    answerCache.delete(key);
    return undefined;
  }
  return cached.value;
}

function writeCachedAnswer(key: string, value: AnswerResult): void {
  if (answerCache.size > 500) {
    const oldest = answerCache.keys().next().value;
    if (oldest) {
      answerCache.delete(oldest);
    }
  }
  answerCache.set(key, { value, expiresAt: Date.now() + cacheTtlMs });
}

function extractOutputText(data: { output?: Array<{ content?: Array<{ text?: string }> }> }): string {
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || '')
    .join('\n');
}
