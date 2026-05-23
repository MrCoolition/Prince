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
);

alter table tutors
add column if not exists image_url text not null default '';

alter table tutors
add column if not exists room_name text not null default '';

alter table tutors
add column if not exists room_description text not null default '';

alter table tutors
add column if not exists room_image_url text not null default '';

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
);

create table if not exists progress (
  student_id text not null,
  lesson_id text not null references lessons(id) on delete cascade,
  tutor_id text not null references tutors(id) on delete cascade,
  status text not null check (status in ('started', 'answered', 'mastered')),
  answer text,
  score integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

create table if not exists formation_events (
  id bigserial primary key,
  prince_id text not null,
  chamber_id text not null,
  tier integer not null,
  score integer not null,
  relic text,
  answer text,
  created_at timestamptz not null default now()
);

insert into tutors (id, name, title, domain, room_name, room_description, room_image_url, tone, motto, color, accent, sigil, image_url, sort_order)
values
  ('aurelius', 'Aurelius', 'Tutor of Noble Character', 'virtue', 'Great Hall', 'Judgment, kindness, service, and the first laws of noble conduct.', '/castle/great-hall.png', 'warm, steady, and fatherly', 'First rule the self, then serve the realm.', '#7b3f2f', '#f3c969', 'A', '/tutors/aurelius.png', 1),
  ('hypatia', 'Hypatia', 'Tutor of Number and Stars', 'logic', 'Star Tower', 'Numbers, patterns, astronomy, memory, and the clean joy of proof.', '/castle/star-tower.png', 'bright, exact, and encouraging', 'A clear mind is a lantern in any dark hall.', '#174c63', '#74d4c0', 'H', '/tutors/hypatia.png', 2),
  ('sappho', 'Sappho', 'Tutor of Letters and Song', 'language', 'Scriptorium', 'Letters, poetry, speech, story, and the power of exact words.', '/castle/scriptorium.png', 'musical, playful, and precise', 'A true word can carry a kingdom.', '#7d3c71', '#f0a6ca', 'S', '/tutors/sappho.png', 3),
  ('leonidas', 'Leonidas', 'Tutor of Courage and Body', 'discipline', 'Training Yard', 'Breath, strength, patience, courage, and calm command of the body.', '/castle/training-yard.png', 'brave, direct, and kind', 'Strength protects what gentleness loves.', '#294936', '#d6b46a', 'L', '/tutors/leonidas.png', 4),
  ('ibn-sina', 'Ibn Sina', 'Tutor of Nature and Care', 'nature', 'Garden Laboratory', 'Plants, animals, medicine, observation, and reverence for living things.', '/castle/garden-lab.png', 'curious, calm, and wise', 'To know the world, look closely and ask why.', '#315c7c', '#a8dadc', 'I', '/tutors/ibn-sina.png', 5)
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
  sort_order = excluded.sort_order;

insert into lessons (id, tutor_id, level, title, opening, prompt, answer_type, choices, answer, praise, stretch, cadence)
values
  ('virtue-001', 'aurelius', 1, 'The Small Throne', 'A prince begins with one small choice done well.', 'Your little brother drops his blocks. What does a noble prince do first?', 'choice', '["Laugh and walk away", "Help him gather the blocks", "Take the biggest block"]'::jsonb, 'Help him gather the blocks', 'That is service. A ruler lifts others before asking to be lifted.', 'Name one helpful act you can do before supper.', 'daily'),
  ('logic-001', 'hypatia', 1, 'Three Bright Stars', 'Numbers are stars that stay where you put them.', 'You have two apples and I give you one more. How many apples shine in your basket?', 'choice', '["Two", "Three", "Five"]'::jsonb, 'Three', 'Exactly. You counted the world and made it clearer.', 'Show three with your fingers, then find three things in the room.', 'daily'),
  ('letters-001', 'sappho', 1, 'The Golden Sound', 'Letters are tiny gates. Open them and meaning walks out.', 'Which word begins with the same sound as prince?', 'choice', '["Pear", "Moon", "Sun"]'::jsonb, 'Pear', 'Well heard. P and prince begin with the same proud little puff.', 'Say three more words that begin with P.', 'daily'),
  ('discipline-001', 'leonidas', 1, 'The Still Shield', 'Courage can be quiet. Sometimes it stands still and breathes.', 'Before a hard task, what should a strong prince do first?', 'choice', '["Take one calm breath", "Shout at the task", "Run away quickly"]'::jsonb, 'Take one calm breath', 'Good. Breath is the handle of the shield.', 'Take three slow breaths and stand tall like a guardian.', 'daily'),
  ('nature-001', 'ibn-sina', 1, 'The Patient Leaf', 'Nature rewards the prince who looks twice.', 'What does a seed need to begin growing?', 'choice', '["Water, warmth, and time", "Loud music only", "A golden crown"]'::jsonb, 'Water, warmth, and time', 'Yes. Life grows by small faithful gifts.', 'Look at a plant and tell what shape its leaves make.', 'daily'),
  ('virtue-002', 'aurelius', 2, 'The Hidden Crown', 'A greater prince does the right thing even when no one claps.', 'You find a toy that is not yours and no one is watching. What is the noble choice?', 'choice', '["Hide it for later", "Return it to its owner", "Trade it without asking"]'::jsonb, 'Return it to its owner', 'That is honor. A true crown is worn inside first.', 'Tell me one thing you can do rightly even when no one sees.', 'daily'),
  ('logic-002', 'hypatia', 2, 'The Pattern Gate', 'A sharp mind sees what comes next.', 'The stones go red, blue, red, blue. Which stone should come next?', 'choice', '["Red", "Blue", "Gold"]'::jsonb, 'Red', 'Yes. You saw the pattern and stepped through the gate.', 'Make a two-color pattern with blocks or crayons.', 'daily'),
  ('letters-002', 'sappho', 2, 'The True Sentence', 'A prince speaks clearly so others can trust his meaning.', 'Which sentence tells a complete thought?', 'choice', '["The brave prince helped.", "Under the table", "Because the moon"]'::jsonb, 'The brave prince helped.', 'Well spoken. That sentence stands on its own feet.', 'Make one complete sentence about your day.', 'daily'),
  ('discipline-002', 'leonidas', 2, 'The Second Try', 'Discipline is returning to the work after the first stumble.', 'If a puzzle is hard and you fail once, what does a disciplined prince do?', 'choice', '["Try again calmly", "Throw the puzzle", "Say it is impossible"]'::jsonb, 'Try again calmly', 'That is discipline. Strength returns to the task.', 'Practice one hard thing for one quiet minute.', 'daily'),
  ('nature-002', 'ibn-sina', 2, 'The Careful Observer', 'A learned prince uses his eyes before his guesses.', 'Before deciding what an unknown plant needs, what should you do first?', 'choice', '["Observe it closely", "Pull it out", "Ignore it"]'::jsonb, 'Observe it closely', 'Exactly. Observation is the first kindness of science.', 'Describe one plant using color, shape, and size.', 'daily')
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
  cadence = excluded.cadence;
