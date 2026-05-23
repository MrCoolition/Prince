import { NextResponse } from 'next/server';
import type { Trial } from '@/lib/academy';
import { boundedText, fetchWithTimeout, handleRouteError, rateLimit } from '@/lib/server-security';
import { judgeTrialAnswer } from '@/lib/tutor-judgment';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const limited = rateLimit(request, 'mentor', 25, 60_000);
  if (limited) {
    return limited;
  }

  try {
    const body = await request.json();
    const answer = boundedText(body.answer, 'answer', 700, false);
    const artifacts = Array.isArray(body.artifacts) ? body.artifacts.slice(0, 5).map(String) : [];
    const fallback = judgeTrialAnswer(body.trial as Trial, answer, artifacts);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || process.env.OPENAI_COST_MODE !== 'premium') {
      return NextResponse.json(fallback);
    }

    const model = process.env.OPENAI_CHEAP_MODEL || 'gpt-4o-mini';
    const response = await fetchWithTimeout('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model,
        max_output_tokens: 220,
        instructions: [
          'You are a wise, deeply connected royal tutor for a four-year-old prince.',
          'Return compact JSON: mastered,score,title,line,event,relic,next.',
          'You are not a prompt pile or a quiz grader. You are a steady teacher who guards the child, remembers the formation aim, and corrects with warmth.',
          'Never grant mastery for profanity, cruelty, threats, humiliation, self-contempt, running away from the duty, or an answer that avoids the chamber question.',
          'If the answer fails, mastered must be false. Give one concrete next move a parent can coach in ten seconds.',
          'If the answer succeeds, celebrate specifically and connect it to virtue.',
          'Use the doctrine: a prince is raised to become worthy of power.'
        ].join(' '),
        input: JSON.stringify({
          trial: body.trial,
          answer,
          artifacts,
          fallback
        })
      })
    }, 9000);

    if (!response.ok) {
      return NextResponse.json(fallback);
    }

    const data = await response.json();
    const text = data.output_text || extractOutputText(data);
    const parsed = JSON.parse(text);
    const refined = normalizeReward({ ...fallback, ...parsed });
    if (!fallback.mastered && refined.mastered) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json(refined);
  } catch (error) {
    return handleRouteError(error);
  }
}

function normalizeReward(value: Record<string, unknown>) {
  return {
    mastered: Boolean(value?.mastered),
    score: Math.max(0, Math.min(100, Math.round(Number(value?.score || 70)))),
    title: String(value?.title || 'Royal Practice').slice(0, 80),
    line: String(value?.line || 'The prince takes one noble step.').slice(0, 260),
    event: String(value?.event || 'A chamber lantern brightens.').slice(0, 220),
    relic: String(value?.relic || 'Practice Spark').slice(0, 80),
    next: String(value?.next || 'Continue the path.').slice(0, 180)
  };
}

function extractOutputText(data: { output?: Array<{ content?: Array<{ text?: string }> }> }) {
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || '')
    .join('\n');
}
