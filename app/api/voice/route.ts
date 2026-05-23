import { NextResponse } from 'next/server';
import { HttpError, boundedText, fetchWithTimeout, handleRouteError, rateLimit, safeId } from '@/lib/server-security';

export const runtime = 'nodejs';

const tutorKeys = new Set(['aurelius', 'hypatia', 'sappho', 'leonidas', 'ibn-sina']);
const assignedVoiceIds: Record<string, string> = {
  aurelius: 'scOwDtmlUjD3prqpp97I',
  hypatia: 'LTdCOVuNg0GlsSue75IB',
  sappho: '8JVbfL6oEdmuxKn5DK2C',
  leonidas: 'c8GqgOMlDjKmhWVDfhvI',
  'ibn-sina': 'Umdp1GYPcONfcWXrMinP'
};

const assignedDefaultVoiceId = 'L0Dsvb3SLTyegXwtm47J';
const voiceCache = new Map<string, { audio: ArrayBuffer; expiresAt: number }>();
const voiceCacheTtlMs = envNumber('ELEVENLABS_VOICE_CACHE_TTL_MS', 6 * 60 * 60 * 1000);
const voiceCacheMaxItems = envNumber('ELEVENLABS_VOICE_CACHE_MAX_ITEMS', 40);

export async function POST(request: Request) {
  return voiceRequest(request, async () => {
    const body = await request.json();
    return {
      text: body.text,
      tutorId: body.tutorId
    };
  });
}

export async function GET(request: Request) {
  return voiceRequest(request, async () => {
    const url = new URL(request.url);
    return {
      text: url.searchParams.get('text'),
      tutorId: url.searchParams.get('tutorId')
    };
  });
}

async function voiceRequest(request: Request, readInput: () => Promise<{ text: unknown; tutorId: unknown }>) {
  const limited = rateLimit(request, 'voice', 30, 60_000);
  if (limited) {
    return limited;
  }

  try {
    const input = await readInput();
    const text = boundedText(input.text, 'text', Number(process.env.ELEVENLABS_MAX_CHARS || 900));
    const tutorId = safeId(input.tutorId, 'aurelius');
    if (!tutorKeys.has(tutorId)) {
      throw new HttpError(400, 'Unknown tutor');
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = voiceForTutor(tutorId);
    if (!apiKey || !voiceId) {
      return NextResponse.json({ error: 'Tutor voice is resting' }, { status: 412 });
    }

    const cacheKey = `${tutorId}:${voiceId}:${text}`;
    const cached = cachedVoice(cacheKey);
    if (cached) {
      return audioResponse(cached, 'HIT');
    }

    const outputFormat = encodeURIComponent(process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128');
    const response = await fetchWithTimeout(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=${outputFormat}`, {
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
      console.warn('[voice] ElevenLabs request failed', { tutorId, status: response.status });
      return NextResponse.json({ error: 'Tutor voice is resting' }, { status: 502 });
    }

    const audio = await response.arrayBuffer();
    cacheVoice(cacheKey, audio);
    return audioResponse(audio, 'MISS');
  } catch (error) {
    return handleRouteError(error);
  }
}

function voiceForTutor(tutorId: string) {
  const key = tutorId.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return process.env[`ELEVENLABS_${key}_VOICE_ID`]
    || assignedVoiceIds[tutorId]
    || process.env.ELEVENLABS_DEFAULT_VOICE_ID
    || assignedDefaultVoiceId;
}

function audioResponse(audio: ArrayBuffer, cache: 'HIT' | 'MISS') {
  return new NextResponse(audio.slice(0), {
    headers: {
      'content-type': 'audio/mpeg',
      'cache-control': 'private, max-age=300',
      'x-prince-voice-cache': cache
    }
  });
}

function cachedVoice(key: string) {
  const entry = voiceCache.get(key);
  if (!entry) {
    return null;
  }
  if (entry.expiresAt <= Date.now()) {
    voiceCache.delete(key);
    return null;
  }
  return entry.audio;
}

function cacheVoice(key: string, audio: ArrayBuffer) {
  if (voiceCacheTtlMs <= 0) {
    return;
  }
  voiceCache.set(key, { audio, expiresAt: Date.now() + voiceCacheTtlMs });
  if (voiceCache.size <= voiceCacheMaxItems) {
    return;
  }
  for (const [entryKey, entry] of voiceCache) {
    if (entry.expiresAt <= Date.now() || voiceCache.size > voiceCacheMaxItems) {
      voiceCache.delete(entryKey);
    }
    if (voiceCache.size <= voiceCacheMaxItems) {
      break;
    }
  }
}

function envNumber(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}
