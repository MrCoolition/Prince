import type { VercelRequest, VercelResponse } from '@vercel/node';
import { HttpError, applyRateLimit, boundedText, fetchWithTimeout, sendHttpError } from './_security';

const voiceIdCache = new Map<string, string>();
const tutorVoiceKeys = new Set(['AURELIUS', 'HYPATIA', 'SAPPHO', 'LEONIDAS', 'IBN_SINA']);
const maxVoiceChars = Number(process.env['ELEVENLABS_MAX_CHARS'] || 900);

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!applyRateLimit(req, res, 'voice', 12, 60_000)) {
    return;
  }

  try {
    const apiKey = process.env['ELEVENLABS_API_KEY'];
    const body = (req.body ?? {}) as { text?: string; tutorId?: string };
    const text = boundedText(body.text, 'text', maxVoiceChars);
    const tutorKey = normalizeTutorKey(body.tutorId);
    const tutorVoiceKey = `ELEVENLABS_${tutorKey}_VOICE_ID`;
    const voiceId = process.env[tutorVoiceKey] || process.env['ELEVENLABS_DEFAULT_VOICE_ID'] || await resolveVoiceId(apiKey, tutorKey);

    if (!apiKey || !voiceId) {
      res.status(412).json({ error: 'ElevenLabs is not configured' });
      return;
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
        model_id: process.env['ELEVENLABS_MODEL_ID'] || 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.72,
          style: 0.2,
          use_speaker_boost: true
        }
      })
    }, 12_000);

    if (!response.ok) {
      res.status(502).json({ error: 'Voice request failed' });
      return;
    }

    const audio = Buffer.from(await response.arrayBuffer());
    res.setHeader('content-type', 'audio/mpeg');
    res.setHeader('cache-control', 'private, max-age=300');
    res.status(200).send(audio);
  } catch (error) {
    sendHttpError(res, error);
  }
}

async function resolveVoiceId(apiKey: string | undefined, tutorId: string): Promise<string> {
  if (!apiKey) {
    return '';
  }

  if (voiceIdCache.has(tutorId)) {
    return voiceIdCache.get(tutorId) || '';
  }

  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': apiKey }
  });

  if (!response.ok) {
    return '';
  }

  const data = await response.json() as { voices?: Array<{ voice_id?: string }> };
  const voices = Array.isArray(data.voices) ? data.voices.filter((voice) => voice.voice_id) : [];

  if (!voices.length) {
    return '';
  }

  const tutorOrder = ['AURELIUS', 'HYPATIA', 'SAPPHO', 'LEONIDAS', 'IBN_SINA'];
  const index = Math.max(0, tutorOrder.indexOf(tutorId));
  const voiceId = voices[index % voices.length].voice_id || '';
  voiceIdCache.set(tutorId, voiceId);
  return voiceId;
}

function normalizeTutorKey(tutorId: string | undefined): string {
  const key = (tutorId || 'aurelius').toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  if (!tutorVoiceKeys.has(key)) {
    throw new HttpError(400, 'Unknown tutor voice');
  }
  return key;
}
