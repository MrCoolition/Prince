import { neon } from '@neondatabase/serverless';
import { LessonRecord, TutorRecord, seedLessons, seedTutors } from './_seed';

const connectionString = process.env['DATABASE_URL'] || process.env['POSTGRES_URL'] || process.env['NEON_DATABASE_URL'];
const sql = connectionString ? neon(connectionString) : null;
const autoMigrate = process.env['PRINCE_AUTO_MIGRATE'] === 'true';
let schemaReady: Promise<void> | undefined;

export async function listTutors(): Promise<TutorRecord[]> {
  if (!sql) {
    return seedTutors;
  }

  await ensureSchema();
  const rows = await sql`
    select
      id,
      name,
      title,
      domain,
      room_name as "roomName",
      room_description as "roomDescription",
      room_image_url as "roomImageUrl",
      tone,
      motto,
      color,
      accent,
      sigil,
      image_url as "imageUrl"
    from tutors
    order by sort_order asc, name asc
  `;

  return rows.length ? rows as TutorRecord[] : seedTutors;
}

export async function getQuest(tutorId: string, level = 1): Promise<LessonRecord> {
  if (!sql) {
    return seedLessons.find((lesson) => lesson.tutorId === tutorId && lesson.level === level)
      ?? seedLessons.find((lesson) => lesson.tutorId === tutorId)
      ?? seedLessons[0];
  }

  await ensureSchema();
  const rows = await sql`
    select
      id,
      tutor_id as "tutorId",
      level,
      title,
      opening,
      prompt,
      answer_type as "answerType",
      choices,
      answer,
      praise,
      stretch,
      cadence
    from lessons
    where tutor_id = ${tutorId}
      and level = ${level}
    order by level asc, id asc
    limit 1
  `;

  return (rows[0] as LessonRecord | undefined)
    ?? seedLessons.find((lesson) => lesson.tutorId === tutorId && lesson.level === level)
    ?? seedLessons[0];
}

export async function getLesson(lessonId: string): Promise<LessonRecord | undefined> {
  if (!sql) {
    return seedLessons.find((lesson) => lesson.id === lessonId);
  }

  await ensureSchema();
  const rows = await sql`
    select
      id,
      tutor_id as "tutorId",
      level,
      title,
      opening,
      prompt,
      answer_type as "answerType",
      choices,
      answer,
      praise,
      stretch,
      cadence
    from lessons
    where id = ${lessonId}
    limit 1
  `;

  return rows[0] as LessonRecord | undefined;
}

export async function saveProgress(update: {
  studentId: string;
  lessonId: string;
  tutorId: string;
  status: 'started' | 'answered' | 'mastered';
  answer?: string;
  score?: number;
}): Promise<void> {
  if (!sql) {
    return;
  }

  await ensureSchema();
  const answer = update.answer ? update.answer.slice(0, 1500) : null;
  const score = Math.max(0, Math.min(100, Math.round(Number(update.score ?? 0))));
  await sql`
    insert into progress (student_id, lesson_id, tutor_id, status, answer, score, updated_at)
    values (${update.studentId}, ${update.lessonId}, ${update.tutorId}, ${update.status}, ${answer}, ${score}, now())
    on conflict (student_id, lesson_id) do update set
      status = excluded.status,
      answer = excluded.answer,
      score = excluded.score,
      updated_at = now()
  `;
}

async function ensureSchema(): Promise<void> {
  if (!sql) {
    return;
  }

  if (!autoMigrate) {
    schemaReady ??= Promise.resolve();
    await schemaReady;
    return;
  }

  schemaReady ??= (async () => {
    await sql`
      create table if not exists tutors (
        id text primary key,
        name text not null,
        title text not null,
        domain text not null,
        room_name text not null default '',
        room_description text not null default '',
        room_image_url text not null default '',
        tone text not null,
        motto text not null,
        color text not null,
        accent text not null,
        sigil text not null,
        image_url text not null default '',
        voice_id text,
        sort_order integer not null default 0,
        created_at timestamptz not null default now()
      )
    `;

    await sql`
      alter table tutors
      add column if not exists image_url text not null default ''
    `;

    await sql`
      alter table tutors
      add column if not exists room_name text not null default ''
    `;

    await sql`
      alter table tutors
      add column if not exists room_description text not null default ''
    `;

    await sql`
      alter table tutors
      add column if not exists room_image_url text not null default ''
    `;

    await sql`
      create table if not exists lessons (
        id text primary key,
        tutor_id text not null references tutors(id) on delete cascade,
        level integer not null default 1,
        title text not null,
        opening text not null,
        prompt text not null,
        answer_type text not null check (answer_type in ('choice', 'spoken', 'text')),
        choices jsonb not null default '[]'::jsonb,
        answer text not null,
        praise text not null,
        stretch text not null,
        cadence text not null,
        created_at timestamptz not null default now()
      )
    `;

    await sql`
      create table if not exists progress (
        student_id text not null,
        lesson_id text not null references lessons(id) on delete cascade,
        tutor_id text not null references tutors(id) on delete cascade,
        status text not null check (status in ('started', 'answered', 'mastered')),
        answer text,
        score integer not null default 0,
        updated_at timestamptz not null default now(),
        primary key (student_id, lesson_id)
      )
    `;

    await seedDatabase();
  })();

  await schemaReady;
}

async function seedDatabase(): Promise<void> {
  if (!sql) {
    return;
  }

  for (const [index, tutor] of seedTutors.entries()) {
    await sql`
      insert into tutors (id, name, title, domain, room_name, room_description, room_image_url, tone, motto, color, accent, sigil, image_url, voice_id, sort_order)
      values (
        ${tutor.id},
        ${tutor.name},
        ${tutor.title},
        ${tutor.domain},
        ${tutor.roomName},
        ${tutor.roomDescription},
        ${tutor.roomImageUrl},
        ${tutor.tone},
        ${tutor.motto},
        ${tutor.color},
        ${tutor.accent},
        ${tutor.sigil},
        ${tutor.imageUrl},
        ${tutor.voiceId ?? null},
        ${index + 1}
      )
      on conflict (id) do update set
        name = excluded.name,
        title = excluded.title,
        domain = excluded.domain,
        room_name = excluded.room_name,
        room_description = excluded.room_description,
        room_image_url = excluded.room_image_url,
        tone = excluded.tone,
        motto = excluded.motto,
        color = excluded.color,
        accent = excluded.accent,
        sigil = excluded.sigil,
        image_url = excluded.image_url,
        sort_order = excluded.sort_order
    `;
  }

  for (const lesson of seedLessons) {
    await sql`
      insert into lessons (id, tutor_id, level, title, opening, prompt, answer_type, choices, answer, praise, stretch, cadence)
      values (
        ${lesson.id},
        ${lesson.tutorId},
        ${lesson.level},
        ${lesson.title},
        ${lesson.opening},
        ${lesson.prompt},
        ${lesson.answerType},
        ${JSON.stringify(lesson.choices)}::jsonb,
        ${lesson.answer},
        ${lesson.praise},
        ${lesson.stretch},
        ${lesson.cadence}
      )
      on conflict (id) do update set
        tutor_id = excluded.tutor_id,
        level = excluded.level,
        title = excluded.title,
        opening = excluded.opening,
        prompt = excluded.prompt,
        answer_type = excluded.answer_type,
        choices = excluded.choices,
        answer = excluded.answer,
        praise = excluded.praise,
        stretch = excluded.stretch,
        cadence = excluded.cadence
    `;
  }
}
