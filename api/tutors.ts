import type { VercelRequest, VercelResponse } from '@vercel/node';
import { listTutors } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const tutors = (await listTutors()).map(({ voiceId: _voiceId, ...tutor }) => tutor);
  res.status(200).json({ tutors });
}
