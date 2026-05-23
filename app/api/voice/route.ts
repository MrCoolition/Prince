import { NextResponse } from 'next/server';
import { HttpError, boundedText, fetchWithTimeout, handleRouteError, rateLimit, safeId } from '@/lib/server-security';

export const runtime = 'nodejs';

const tutorKeys = new Set(['aurelius', 'hypatia', 'sappho', 'leonidas', 'ibn-sina']);
const fallbackOrder = ['AURELIUS', 'HYPATIA', 'SAPPHO', 'LEONIDAS', 'IBN_SINA'];

export async function POST(request: Request) {
  const limited = rateLimit(request, 'voice', 10, 60_000);
  if (limited) {
    return limited;
  }

  try {
    const body = await request.json();
    const text = boundedText(body.text, 'text', Number(process.env.ELEVENLABS_MAX_CHARS || 900));
    const tutorId = safeId(body.tutorId, 'aurelius');
    if (!tutorKeys.has(tutorId)) {
      throw new HttpError(400, 'Unknown tutor');
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = await voiceForTutor(apiKey, tutorId);
    if (!apiKey || !voiceId) {
      return NextResponse.json({ error: 'Tutor voice is resting' }, { status: 412 });
    }

    const response = await fetchWithTimeout(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        accept: 'audio/mpeg',
        'content-type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.72,
          similarity_boost: 0.78,
          style: 0.28,
          use_speaker_boost: true
        }
      })
    }, 12_000);

    if (!response.ok) {
      return NextResponse.json({ error: 'Tutor voice is resting' }, { status: 502 });
    }

    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        'content-type': 'audio/mpeg',
        'cache-control': 'private, max-age=300'
      }
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function voiceForTutor(apiKey: string | undefined, tutorId: string) {
  const key = tutorId.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const explicit = process.env[`ELEVENLABS_${key}_VOICE_ID`] || process.env.ELEVENLABS_DEFAULT_VOICE_ID;
  if (explicit || !apiKey) {
    return explicit || '';
  }

  const response = await fetchWithTimeout('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': apiKey }
  }, 8000);

  if (!response.ok) {
    return '';
  }

  const data = await response.json() as { voices?: Array<{ voice_id?: string }> };
  const voices = Array.isArray(data.voices) ? data.voices.filter((voice) => voice.voice_id) : [];
  const index = Math.max(0, fallbackOrder.indexOf(key));
  return voices[index % Math.max(1, voices.length)]?.voice_id || '';
}
