import { NextResponse } from 'next/server';
import { boundedText, fetchWithTimeout, handleRouteError, rateLimit } from '@/lib/server-security';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const limited = rateLimit(request, 'mentor', 25, 60_000);
  if (limited) {
    return limited;
  }

  try {
    const body = await request.json();
    const fallback = normalizeReward(body.reward);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || process.env.OPENAI_COST_MODE !== 'premium') {
      return NextResponse.json(fallback);
    }

    const answer = boundedText(body.answer, 'answer', 700, false);
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
          'You are a wise royal tutor for a four-year-old prince.',
          'Return compact JSON: mastered,score,title,line,event,relic,next.',
          'Celebrate success first. Never shame. Make feedback concrete, noble, and playable.',
          'Use the doctrine: a prince is raised to become worthy of power.'
        ].join(' '),
        input: JSON.stringify({
          trial: body.trial,
          answer,
          artifacts: Array.isArray(body.artifacts) ? body.artifacts.slice(0, 5) : [],
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
    return NextResponse.json(normalizeReward({ ...fallback, ...parsed }));
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
