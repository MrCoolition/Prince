# Prince Academy

A Vercel-native Next.js platform for royal formation: tutors, chambers, ritual, hardiness, moral correction, public responsibility, and a long path from young prince to king.

The north star lives in [docs/NORTH_STAR.md](docs/NORTH_STAR.md):

> A prince is not raised to be powerful. He is raised to become worthy of power.

## Stack

- Next.js App Router
- React client game surface
- Vercel route handlers in `app/api/*`
- Neon Postgres optional persistence through `@neondatabase/serverless`
- ElevenLabs tutor voice endpoint at `/api/voice`
- OpenAI mentor refinement endpoint at `/api/mentor`, gated behind `OPENAI_COST_MODE=premium`
- Castle, tutor, and theme assets in `public/`

## Local Setup

```bash
npm install
npm run dev
```

Copy environment values when you want live AI, voice, or Neon:

```bash
copy .env.example .env.local
```

The app remains playable without external services. Progress is saved locally in the browser; `/api/progress` records to Neon only when database env vars exist and `PRINCE_AUTO_MIGRATE=true`.

## Vercel Environment

Recommended variables:

- `DATABASE_URL`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_DEFAULT_VOICE_ID`
- `ELEVENLABS_AURELIUS_VOICE_ID`
- `ELEVENLABS_HYPATIA_VOICE_ID`
- `ELEVENLABS_SAPPHO_VOICE_ID`
- `ELEVENLABS_LEONIDAS_VOICE_ID`
- `ELEVENLABS_IBN_SINA_VOICE_ID`
- `ELEVENLABS_MODEL_ID`
- `ELEVENLABS_MAX_CHARS`
- `OPENAI_API_KEY`
- `OPENAI_CHEAP_MODEL`
- `OPENAI_COST_MODE`
- `PRINCE_AUTO_MIGRATE`

`OPENAI_COST_MODE` defaults to saver behavior. Set it to `premium` only when you want live mentor refinement.

## Product Direction

Prince Academy is not a quiz app. It is a formation game and research system:

- Civilization Map
- Source Library
- Formation Timeline
- Curriculum Matrix
- Tutor Profile System
- Care Protocol
- Engagement Labs
- Noble Prince Rubric

The first playable loop is the castle path: five chambers, five tutors, five seals, tangible relics, and a tiered ascent. The next platform layer should add parent dashboards, source-backed curriculum generation, council simulations, decision journals, and civilization campaigns.
