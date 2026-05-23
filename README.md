# Prince Academy

An Angular 21 learning app for a four-year-old "young prince": animated tutors, daily lessons, virtue-based challenges, Neon Postgres persistence, and an ElevenLabs-ready voice endpoint.

## Stack

- Angular 21.x standalone app
- Vercel static hosting plus serverless API routes in `api/`
- Neon Postgres through `@neondatabase/serverless`
- ElevenLabs text-to-speech through `/api/voice`
- OpenAI mentor feedback through `/api/quest` and the local preview `/api/mentor`
- Local theme music at `/audio/princes-vow.wav`

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment values:

   ```bash
   copy .env.example .env.local
   ```

3. Add a Neon pooled connection string to `DATABASE_URL`.

4. Run the schema in `migrations/001_prince_academy.sql` against the Neon database.

5. Start the app:

   ```bash
   npm start
   ```

The API falls back to built-in seed lessons when `DATABASE_URL` is not set, so the first screen remains usable before the database is connected.

## Vercel

Set these project environment variables in Vercel:

- `DATABASE_URL`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_DEFAULT_VOICE_ID` or per-tutor `voice_id` rows in Neon
- `ELEVENLABS_MODEL_ID` if you want to override `eleven_multilingual_v2`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` if you want to override `gpt-5.5-pro`

Vercel will run `npm install` and `npm run build`, then serve `dist/prince-academy/browser`.

## Local Preview Notes

The zero-install preview server at `preview-server.js` reads `.env.local` or `.env` if present. Add `ELEVENLABS_API_KEY`, `ELEVENLABS_DEFAULT_VOICE_ID`, and `OPENAI_API_KEY` there to enable live tutor voices and AI-generated mentor responses locally. Without keys, it falls back to browser speech and deterministic answer feedback.

### Neon Integration Path

The cleanest production setup is the Neon integration for Vercel:

1. Create or connect a Neon project.
2. Add the Neon integration to the Vercel project.
3. Let the integration inject `DATABASE_URL` for production, preview, and development.
4. Run `migrations/001_prince_academy.sql` once on the target database.

If you prefer the Vercel CLI and already have it installed:

```bash
vercel link
vercel integration add neon
vercel env pull
vercel deploy
```

The app reads `DATABASE_URL`, `POSTGRES_URL`, or `NEON_DATABASE_URL`, in that order.
