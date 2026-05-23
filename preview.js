const tutors = [
  {
    id: 'aurelius',
    name: 'Aurelius',
    title: 'Tutor of Noble Character',
    domain: 'virtue',
    roomName: 'Great Hall',
    roomDescription: 'Judgment, kindness, service, and the first laws of noble conduct.',
    roomImageUrl: '/castle/great-hall.png',
    tone: 'warm, steady, and fatherly',
    motto: 'First rule the self, then serve the realm.',
    color: '#7b3f2f',
    accent: '#f3c969',
    imageUrl: '/tutors/aurelius.png'
  },
  {
    id: 'hypatia',
    name: 'Hypatia',
    title: 'Tutor of Number and Stars',
    domain: 'logic',
    roomName: 'Star Tower',
    roomDescription: 'Numbers, patterns, astronomy, memory, and the clean joy of proof.',
    roomImageUrl: '/castle/star-tower.png',
    tone: 'bright, exact, and encouraging',
    motto: 'A clear mind is a lantern in any dark hall.',
    color: '#174c63',
    accent: '#74d4c0',
    imageUrl: '/tutors/hypatia.png'
  },
  {
    id: 'sappho',
    name: 'Sappho',
    title: 'Tutor of Letters and Song',
    domain: 'language',
    roomName: 'Scriptorium',
    roomDescription: 'Letters, poetry, speech, story, and the power of exact words.',
    roomImageUrl: '/castle/scriptorium.png',
    tone: 'musical, playful, and precise',
    motto: 'A true word can carry a kingdom.',
    color: '#7d3c71',
    accent: '#f0a6ca',
    imageUrl: '/tutors/sappho.png'
  },
  {
    id: 'leonidas',
    name: 'Leonidas',
    title: 'Tutor of Courage and Body',
    domain: 'discipline',
    roomName: 'Training Yard',
    roomDescription: 'Breath, strength, patience, courage, and calm command of the body.',
    roomImageUrl: '/castle/training-yard.png',
    tone: 'brave, direct, and kind',
    motto: 'Strength protects what gentleness loves.',
    color: '#294936',
    accent: '#d6b46a',
    imageUrl: '/tutors/leonidas.png'
  },
  {
    id: 'ibn-sina',
    name: 'Ibn Sina',
    title: 'Tutor of Nature and Care',
    domain: 'nature',
    roomName: 'Garden Laboratory',
    roomDescription: 'Plants, medicine, observation, and reverence for living things.',
    roomImageUrl: '/castle/garden-lab.png',
    tone: 'curious, calm, and wise',
    motto: 'To know the world, look closely and ask why.',
    color: '#315c7c',
    accent: '#a8dadc',
    imageUrl: '/tutors/ibn-sina.png'
  }
];

const royalCurriculum = [
  {
    tier: 1,
    name: 'The Little Prince Learns Care',
    rank: 'Novice Regent',
    focus: 'Care, patterns, words, courage, and noticing.',
    steps: [
      {
        tutorId: 'aurelius',
        mode: 'Kindness Gate',
        seal: 'Kindness Seal',
        focus: 'Help first when someone is sad.',
        story: 'A little friend is crying by the block tower. A toy was taken and the tower fell.',
        childPrompt: 'What can the prince do first?',
        prompt: 'Say or tap one helpful move. A tiny answer is enough.',
        artifacts: ['help', 'kind voice', 'share', 'tell the truth'],
        answerStarters: ['I can help.', 'I can share.', 'I can ask nicely.', 'I can say sorry.'],
        successCriteria: ['chooses help', 'uses kind words', 'can point or act']
      },
      {
        tutorId: 'hypatia',
        mode: 'Star Pattern',
        seal: 'Star Gear',
        focus: 'Notice a repeating pattern.',
        story: 'The Star Tower has stepping stones: red, blue, red, blue. One stone is missing.',
        childPrompt: 'What comes next?',
        prompt: 'Say the next stone or build it with two toys.',
        artifacts: ['red', 'blue', 'again', 'next'],
        answerStarters: ['Red comes next.', 'Blue comes next.', 'It goes again.', 'I can show it.'],
        successCriteria: ['touches the pattern', 'says one color', 'shows the repeat']
      },
      {
        tutorId: 'sappho',
        mode: 'Brave Sentence',
        seal: 'Golden Word',
        focus: 'Turn one thought into one clear sentence.',
        story: 'In the Scriptorium, a small golden word waits for the prince to speak.',
        childPrompt: 'Can the prince say one brave sentence?',
        prompt: 'Let him say one sentence about a brave or kind thing.',
        artifacts: ['one word', 'one sentence', 'brave', 'clear voice'],
        answerStarters: ['I am brave.', 'I can help.', 'The prince tried.', 'I can say it.'],
        successCriteria: ['one sentence', 'clear voice', 'child words count']
      },
      {
        tutorId: 'leonidas',
        mode: 'Second Try',
        seal: 'Still Shield',
        focus: 'Breathe, stand, and try again.',
        story: 'In the Training Yard, the prince tries a jump and misses. The tutor smiles and waits.',
        childPrompt: 'What should he do next?',
        prompt: 'Take one breath together. Then say what the prince can try again.',
        artifacts: ['breath', 'stand tall', 'try again', 'slow'],
        answerStarters: ['I can breathe.', 'I can try again.', 'I can go slow.', 'I can stand tall.'],
        successCriteria: ['takes a breath', 'chooses a try', 'body is calm']
      },
      {
        tutorId: 'ibn-sina',
        mode: 'Garden Lens',
        seal: 'Garden Lens',
        focus: 'Look closely and name one true thing.',
        story: 'In the Garden Laboratory, a little leaf has lines, color, and a shape.',
        childPrompt: 'What do you notice?',
        prompt: 'Look at a plant, leaf, toy, or picture. Say one thing you see.',
        artifacts: ['color', 'shape', 'big or small', 'water'],
        answerStarters: ['I see green.', 'It is small.', 'It has a shape.', 'It needs water.'],
        successCriteria: ['one noticing word', 'points to it', 'uses eyes first']
      }
    ]
  },
  {
    tier: 2,
    name: 'The Household Prince Serves the Realm',
    rank: 'Household Steward',
    focus: 'Service, counting, gratitude, patience, and care.',
    steps: [
      {
        tutorId: 'aurelius',
        mode: 'Breakfast Service',
        seal: 'Service Bell',
        focus: 'Serve someone before self.',
        story: 'At breakfast, two people want the same cup. The prince can make the table peaceful.',
        childPrompt: 'What can he do?',
        prompt: 'Choose one peaceful service move.',
        artifacts: ['serve', 'wait', 'share', 'kind voice'],
        answerStarters: ['I can share.', 'I can wait.', 'I can help set the table.', 'I can use kind words.'],
        successCriteria: ['serves first', 'keeps peace', 'short reason']
      },
      {
        tutorId: 'hypatia',
        mode: 'Counting Table',
        seal: 'Counting Stone',
        focus: 'Match one item to each person.',
        story: 'There are three plates and three cups on the royal table. One napkin is missing.',
        childPrompt: 'What should we count?',
        prompt: 'Count slowly and find what each person needs.',
        artifacts: ['one each', 'plate', 'cup', 'napkin'],
        answerStarters: ['One for each.', 'We need a napkin.', 'I can count three.', 'They match.'],
        successCriteria: ['counts objects', 'matches one each', 'finds missing item']
      },
      {
        tutorId: 'sappho',
        mode: 'Thank-You Oath',
        seal: 'Gratitude Ribbon',
        focus: 'Say thanks with a full little sentence.',
        story: 'Someone gives the prince a warm bowl. The Scriptorium waits for noble words.',
        childPrompt: 'What can he say?',
        prompt: 'Say one thankful sentence.',
        artifacts: ['thank you', 'name the gift', 'kind voice', 'smile'],
        answerStarters: ['Thank you for the bowl.', 'That was kind.', 'I like it.', 'Thank you for helping me.'],
        successCriteria: ['says thanks', 'names the gift', 'uses kind tone']
      },
      {
        tutorId: 'leonidas',
        mode: 'Waiting Stance',
        seal: 'Patience Drum',
        focus: 'Wait without grabbing.',
        story: 'A favorite toy is in another child hand. The prince wants it now.',
        childPrompt: 'What can his brave body do?',
        prompt: 'Practice one waiting move.',
        artifacts: ['hands still', 'ask', 'wait', 'breathe'],
        answerStarters: ['I can wait.', 'I can ask.', 'I can breathe.', 'Hands stay still.'],
        successCriteria: ['does not grab', 'uses body control', 'asks or waits']
      },
      {
        tutorId: 'ibn-sina',
        mode: 'Plant Keeper',
        seal: 'Water Drop',
        focus: 'Care for a living thing gently.',
        story: 'A little plant droops by the window. The garden tutor brings a tiny cup of water.',
        childPrompt: 'What does the plant need?',
        prompt: 'Name one gentle care action.',
        artifacts: ['water', 'sun', 'gentle hands', 'look closely'],
        answerStarters: ['It needs water.', 'It needs sun.', 'I can be gentle.', 'I can look closely.'],
        successCriteria: ['names a need', 'uses gentle care', 'observes first']
      }
    ]
  },
  {
    tier: 3,
    name: 'The Young Steward Guards the City',
    rank: 'Young Steward',
    focus: 'Fairness, sorting, story order, repair, and causes.',
    steps: [
      {
        tutorId: 'aurelius',
        mode: 'Fair Share Council',
        seal: 'Fairness Coin',
        focus: 'Make a fair choice when two people want the same thing.',
        story: 'Two friends both want the last block for the castle gate.',
        childPrompt: 'How can the prince make it fair?',
        prompt: 'Choose a fair plan and say one small why.',
        artifacts: ['take turns', 'share', 'ask', 'fair'],
        answerStarters: ['They can take turns.', 'They can share.', 'I can ask.', 'That is fair.'],
        successCriteria: ['fair plan', 'one reason', 'keeps both people in mind']
      },
      {
        tutorId: 'hypatia',
        mode: 'Royal Sorting',
        seal: 'Order Key',
        focus: 'Sort by color, shape, or size.',
        story: 'The Star Tower has mixed gems: red circles, blue circles, and red squares.',
        childPrompt: 'How should we sort them?',
        prompt: 'Pick one sorting rule and show it.',
        artifacts: ['color', 'shape', 'size', 'same'],
        answerStarters: ['Sort by color.', 'Sort by shape.', 'These are the same.', 'This one is different.'],
        successCriteria: ['chooses one rule', 'sorts at least two', 'uses same or different']
      },
      {
        tutorId: 'sappho',
        mode: 'Tiny Chronicle',
        seal: 'Story Thread',
        focus: 'Tell beginning, middle, and end with help.',
        story: 'A small knight loses a shoe, asks for help, and finds it under the bed.',
        childPrompt: 'What happened first?',
        prompt: 'Tell one part of the story, then one more if he is ready.',
        artifacts: ['first', 'then', 'last', 'story'],
        answerStarters: ['First he lost it.', 'Then he asked.', 'Last he found it.', 'The shoe was under the bed.'],
        successCriteria: ['uses order word', 'remembers one event', 'can add another']
      },
      {
        tutorId: 'leonidas',
        mode: 'Repair After Mistake',
        seal: 'Repair Hammer',
        focus: 'Fix one small mistake without melting down.',
        story: 'The prince spills blocks across the floor. The work can be repaired.',
        childPrompt: 'What can he do now?',
        prompt: 'Choose one repair move.',
        artifacts: ['pick up', 'ask help', 'try again', 'calm body'],
        answerStarters: ['I can pick them up.', 'I can ask for help.', 'I can try again.', 'I can be calm.'],
        successCriteria: ['repairs action', 'stays calm', 'chooses next step']
      },
      {
        tutorId: 'ibn-sina',
        mode: 'Cause and Care',
        seal: 'Seed Key',
        focus: 'Connect one cause to one effect.',
        story: 'One plant has water and one plant is dry. The dry plant bends down.',
        childPrompt: 'Why is one plant drooping?',
        prompt: 'Say one cause or show it with a cup.',
        artifacts: ['dry', 'water', 'sun', 'because'],
        answerStarters: ['It needs water.', 'It is dry.', 'Because no water.', 'Water helps it stand.'],
        successCriteria: ['names cause', 'connects care', 'can point to evidence']
      }
    ]
  }
];

const nobleDoctrine = [
  ['Ruled Before Ruling', 'Truth, law, reverence, discipline, tutors, noble examples, and the common good rule the prince first.'],
  ['Hardship Before Command', 'Comfort without discipline makes softness; praise without correction makes vanity.'],
  ['Men And Systems', 'The prince studies soul, household, army, treasury, court, temple, archive, road, farm, and citizen.'],
  ['Truth-Tellers Near The Crown', 'A prince who cannot be corrected becomes dangerous before he becomes crowned.'],
  ['Wisdom Above Cleverness', 'The highest curriculum is choosing rightly when the cost is real.']
];

const civilizationCases = [
  {
    civilization: 'Persia',
    anchor: 'Herodotus, Xenophon',
    focus: 'Truth, riding, archery, justice cases, endurance',
    lesson: 'The ruler must be trained in truth before command.',
    reliability: 'Greek accounts; Xenophon is idealized and philosophical.'
  },
  {
    civilization: 'Macedonia',
    anchor: 'Aristotle, Plutarch, Alexander',
    focus: 'Philosophy, politics, Homer, medicine, heroic imagination',
    lesson: 'Courage needs philosophy so ambition does not become lawless.',
    reliability: 'Famous tradition, partly retrospective.'
  },
  {
    civilization: 'Greece',
    anchor: 'Plato, Republic',
    focus: 'Music, gymnastic, courage, temperance, mathematics, dialectic',
    lesson: 'The noble ruler must be neither brute nor dreamer.',
    reliability: 'Normative ideal, not a direct court manual.'
  },
  {
    civilization: 'Egypt',
    anchor: 'Instruction for Merikare',
    focus: 'Scribal order, palace learning, moral kingship, memory',
    lesson: 'Literacy is administrative power and moral responsibility.',
    reliability: 'Instructional royal literature with moral framing.'
  },
  {
    civilization: 'China',
    anchor: 'Xue Ji, Great Learning',
    focus: 'Teacher selection, self-cultivation, family order, state order',
    lesson: 'Public order begins in private order.',
    reliability: 'Classical normative education and rulership tradition.'
  },
  {
    civilization: 'Assyria',
    anchor: 'Ashurbanipal',
    focus: 'Archives, scholarship, omen interpretation, imperial intelligence',
    lesson: 'A ruler needs experts, records, and systems of interpretation.',
    reliability: 'Royal claims and surviving tablet collections.'
  },
  {
    civilization: 'Rome',
    anchor: 'Quintilian, Marcus Aurelius',
    focus: 'Rhetoric, philosophy, law, exemplars, moral memory',
    lesson: 'The good ruler must become a good man skilled in speech.',
    reliability: 'Elite educational ideals and imperial self-reflection.'
  },
  {
    civilization: 'India',
    anchor: 'Arthashastra',
    focus: 'Statecraft, counsel, discipline, political economy, crown training',
    lesson: 'Power must understand economy, law, advisors, and strategy.',
    reliability: 'Major statecraft source with prescriptive force.'
  }
];

const formationRings = [
  ['Soul', 'truth, reverence, restraint'],
  ['Body', 'stamina, courage, hardship'],
  ['Speech', 'rhetoric, consolation, command'],
  ['Law', 'justice, equity, punishment'],
  ['Memory', 'history, poetry, archives'],
  ['Statecraft', 'taxes, logistics, counsel'],
  ['Wisdom', 'first principles, mortality, the good']
];

const sourceLibrary = [
  ['Persia', 'Herodotus on Persian education', 'Primary / outsider account', 'truth-training, riding, archery'],
  ['Persia', 'Xenophon, Cyropaedia', 'Primary / idealized political fiction', 'justice-cases, endurance, self-command'],
  ['Greece', 'Plato, Republic', 'Philosophical ideal', 'guardian-education, music, gymnastic, dialectic'],
  ['Greece', 'Aristotle, Politics', 'Philosophical-political treatise', 'civic education, constitution, lawgiver'],
  ['Macedonia', 'Plutarch, Life of Alexander', 'Retrospective biography', 'Aristotle, Homer, heroic imagination'],
  ['Egypt', 'Instruction for Merikare', 'Royal instruction literature', 'moral kingship, scribal order'],
  ['China', 'Xue Ji and Great Learning', 'Classical education texts', 'teacher-selection, self-cultivation'],
  ['Assyria', 'Ashurbanipal library evidence', 'Royal and archaeological material', 'archives, scholarship, intelligence'],
  ['Rome', 'Marcus Aurelius, Meditations', 'Imperial philosophical journal', 'virtue memory, tutors, restraint'],
  ['Rome', 'Quintilian', 'Rhetorical education', 'good man skilled in speaking'],
  ['India', 'Kautilya, Arthashastra', 'Statecraft treatise', 'counsel, economy, prince training']
];

const ageStages = [
  ['Birth-5', 'Guarded Nurture', 'health, speech, reverence, affection, steadiness'],
  ['5-12', 'Truth And Noble Stories', 'reading, correction, simple justice, music, service'],
  ['12-17', 'Discipline And Shame-Resilience', 'hardship, martial basics, law memory, daily examination'],
  ['17-25', 'Apprenticeship In Rule', 'council, courts, logistics, speeches, advisor judgment'],
  ['25-30', 'Command Under Supervision', 'districts, audits, petitions, policy, formal rebuke'],
  ['30+', 'Philosophical Rule', 'justice, mortality, force, succession, common good']
];

const careProtocol = [
  ['Physical Care', 'sleep, stamina, posture, body discipline, stress tolerance'],
  ['Moral Care', 'truthfulness, humility, mercy, appetite, correction history'],
  ['Intellectual Care', 'canon, exemplars, memory work, philosophical themes'],
  ['Civic Care', 'statecraft labs, welfare cases, decision journals, field observation']
];

const curriculumMatrix = [
  ['Self-Command', 'truth, restraint, courage, reverence'],
  ['Truth And Speech', 'clear words, debate, command, consolation'],
  ['Justice And Law', 'cases, equity, contracts, oaths, false accusation'],
  ['Sacred And Civic Order', 'ritual, ceremony, temples, ancestors, public duty'],
  ['History And Exemplars', 'founders, tyrants, reformers, failed heirs'],
  ['Rhetoric And Diplomacy', 'persuasion, treaty speech, negotiation'],
  ['Martial Discipline', 'riding, archery, spear, formations, logistics'],
  ['Administration', 'grain, taxes, roads, records, officials'],
  ['Archives And Intelligence', 'experts, tablets, reports, risk interpretation'],
  ['Philosophy', 'ethics, politics, death, the good'],
  ['Counsel And Anti-Flattery', 'advisors, rebuke, incentives, truth-tellers'],
  ['Mercy, Power, Legacy', 'punishment, compassion, succession, common good']
];

const engagementLabs = [
  ['Justice Cases', 'judge theft, insult, false accusation, mercy, severity'],
  ['Socratic Questions', 'what is courage, law, mercy, victory, legitimacy'],
  ['Heroic Imitation', 'study founders, sages, tyrants, failed heirs'],
  ['Hardship Exposure', 'waiting, fatigue, defeat, criticism, controlled discomfort'],
  ['Council Simulation', 'ask who knows, who benefits, who flatters, what happens later'],
  ['Decision Journal', 'situation, options, counsel, decision, risk, result, critique']
];

const tutorManual = [
  ['Moral Authority', 'correct the prince without flattery'],
  ['Subject Mastery', 'law, rhetoric, history, military, political order'],
  ['Psychological Discernment', 'adapt to temperament and learning difficulty'],
  ['Embodied Virtue', 'the lesson must be lived, not merely spoken'],
  ['Daily Watch', 'reading, speech, table habits, friendships, correction, courage'],
  ['Core Question', 'what kind of ruler is this knowledge making him']
];

const readinessRubric = [
  ['Truthfulness', 78, 'tells truth under cost'],
  ['Self-command', 64, 'delays pleasure and masters emotion'],
  ['Justice', 58, 'judges by law, equity, public good'],
  ['Courage', 62, 'faces danger with discipline'],
  ['Speech', 70, 'speaks clearly and with timing'],
  ['Learning Depth', 54, 'asks and changes under evidence'],
  ['Counsel', 48, 'welcomes correction and competent advisors'],
  ['Mercy', 57, 'balances compassion and order'],
  ['Administration', 38, 'understands records, logistics, people'],
  ['Public Spirit', 52, 'sees rule as stewardship']
];

const progressStorageKey = 'prince-academy.adaptive-progress.v1';
const recentTrialStorageKey = 'prince-academy.recent-trials.v1';
const generatedCurriculumStorageKey = 'prince-academy.generated-curriculum.v1';

let activeTutor = tutors[0];
let activeTrial;
let selectedArtifacts = [];
let generatedCurriculum = loadGeneratedCurriculum();
let progress = loadProgress();
let recentTrials = loadRecentTrials();
let lastResultText = '';
let lastSubmissionId = 0;
let curriculumBuilderStatus = 'The next tier is being forged in the background.';
const curriculumBuildsInFlight = new Set();
const curriculumBuildAttempts = new Set();
let themeAudio;
let voiceAudio;
let activeAudioUrl = '';

const app = document.querySelector('#app');
const roomNav = document.querySelector('#roomNav');
const answerInput = document.querySelector('#answerInput');
const resultCard = document.querySelector('#resultCard');
const musicButton = document.querySelector('#musicToggle');
const continueButton = document.querySelector('#continuePath');

function defaultProfile(tutorId) {
  return {
    tutorId,
    tier: 1,
    mastery: 0,
    xp: 0,
    attempts: 0,
    mastered: 0,
    streak: 0,
    lastScore: 0,
    rankName: 'Novice Regent'
  };
}

function defaultRoyalPath() {
  return {
    version: 2,
    tier: 1,
    stepIndex: 0,
    completedSteps: [],
    totalSeals: 0,
    completedTiers: 0
  };
}

function migrateRoyalPath(parsed = {}) {
  const path = { ...defaultRoyalPath(), ...(parsed.__path || {}) };

  if (!parsed.__path) {
    let stepIndex = 0;
    while (stepIndex < tutors.length && Number(parsed[tutors[stepIndex].id]?.mastery || 0) >= 60) {
      stepIndex += 1;
    }

    if (stepIndex >= tutors.length) {
      return {
        ...path,
        tier: 2,
        stepIndex: 0,
        completedSteps: [],
        totalSeals: tutors.length,
        completedTiers: 1
      };
    }

    return {
      ...path,
      stepIndex,
      completedSteps: Array.from({ length: stepIndex }, (_, index) => index),
      totalSeals: stepIndex
    };
  }

  const plan = currentTierPlan(path);
  path.tier = Math.max(1, Math.round(Number(path.tier || 1)));
  path.stepIndex = Math.max(0, Math.min(plan.steps.length - 1, Number(path.stepIndex || 0)));
  path.completedSteps = Array.isArray(path.completedSteps)
    ? [...new Set(path.completedSteps.map((item) => Number(item)).filter((item) => item >= 0 && item < plan.steps.length))]
    : [];
  path.totalSeals = Math.max(path.completedSteps.length, Number(path.totalSeals || 0));
  path.completedTiers = Math.max(0, Number(path.completedTiers || 0));
  return path;
}

function loadGeneratedCurriculum() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(generatedCurriculumStorageKey) || '[]');
    return Array.isArray(parsed)
      ? parsed.map((plan) => normalizeTierPlan(plan)).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function saveGeneratedCurriculum() {
  window.localStorage.setItem(generatedCurriculumStorageKey, JSON.stringify(generatedCurriculum));
}

function allCurriculumPlans() {
  return [...royalCurriculum, ...generatedCurriculum].sort((a, b) => a.tier - b.tier);
}

function upsertGeneratedTier(plan) {
  if (!plan || plan.tier <= royalCurriculum.length) {
    return;
  }

  generatedCurriculum = [
    ...generatedCurriculum.filter((existing) => existing.tier !== plan.tier),
    plan
  ].sort((a, b) => a.tier - b.tier);
  saveGeneratedCurriculum();
}

function tutorProfile(tutorId = activeTutor.id) {
  progress[tutorId] ??= defaultProfile(tutorId);
  return progress[tutorId];
}

function tutorById(tutorId) {
  return tutors.find((tutor) => tutor.id === tutorId);
}

function royalPath() {
  progress.__path ??= defaultRoyalPath();
  return progress.__path;
}

function currentTierPlan(path = royalPath()) {
  const tier = Math.max(1, Number(path.tier || 1));
  const existing = allCurriculumPlans().find((plan) => plan.tier === tier);

  if (existing) {
    return existing;
  }

  const fallback = createLocalTierPlan(tier);
  upsertGeneratedTier(fallback);
  return fallback;
}

function currentPathStep(path = royalPath()) {
  const plan = currentTierPlan(path);
  return plan.steps[Math.min(path.stepIndex, plan.steps.length - 1)];
}

function curriculumStepIndexForTutor(tutorId, path = royalPath()) {
  return currentTierPlan(path).steps.findIndex((step) => step.tutorId === tutorId);
}

function curriculumStepForTutor(tutorId, path = royalPath()) {
  const index = curriculumStepIndexForTutor(tutorId, path);
  return index >= 0 ? currentTierPlan(path).steps[index] : currentPathStep(path);
}

function roomPathState(tutorId, path = royalPath()) {
  const index = curriculumStepIndexForTutor(tutorId, path);
  if (index < 0) {
    return 'locked';
  }
  if (index < path.stepIndex || path.completedSteps.includes(index)) {
    return 'complete';
  }
  if (index === path.stepIndex) {
    return 'current';
  }
  return 'locked';
}

function pathRank(path = royalPath()) {
  return currentTierPlan(path).rank;
}

function normalizeTierPlan(plan) {
  if (!plan || !Number(plan.tier) || !Array.isArray(plan.steps)) {
    return null;
  }

  const tier = Math.max(1, Math.round(Number(plan.tier)));
  const fallback = createLocalTierPlan(tier, false);
  const normalizedSteps = tutors.map((tutor, index) => {
    const supplied = plan.steps.find((step) => step?.tutorId === tutor.id) || plan.steps[index] || {};
    const base = fallback.steps[index];
    return {
      tutorId: tutor.id,
      mode: cleanGeneratedText(supplied.mode || base.mode, 80),
      seal: cleanGeneratedText(supplied.seal || base.seal, 80),
      focus: cleanGeneratedText(supplied.focus || base.focus, 160),
      story: cleanGeneratedText(supplied.story || base.story, 320),
      childPrompt: cleanGeneratedText(supplied.childPrompt || base.childPrompt, 180),
      prompt: cleanGeneratedText(supplied.prompt || base.prompt, 320),
      artifacts: normalizeSimpleArray(supplied.artifacts, base.artifacts, 5),
      answerStarters: normalizeSimpleArray(supplied.answerStarters, base.answerStarters, 5),
      successCriteria: normalizeSimpleArray(supplied.successCriteria, base.successCriteria, 3)
    };
  });

  return {
    tier,
    name: cleanGeneratedText(plan.name || fallback.name, 100),
    rank: cleanGeneratedText(plan.rank || fallback.rank, 100),
    focus: cleanGeneratedText(plan.focus || fallback.focus, 220),
    builtFrom: cleanGeneratedText(plan.builtFrom || fallback.builtFrom || '', 160),
    source: cleanGeneratedText(plan.source || 'ai', 16),
    steps: normalizedSteps
  };
}

function normalizeSimpleArray(value, fallback, maxLength) {
  return (Array.isArray(value) && value.length ? value : fallback)
    .slice(0, maxLength)
    .map((item) => cleanGeneratedText(item, 80));
}

function cleanGeneratedText(value, maxLength) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function createLocalTierPlan(tier, includeSource = true) {
  const rank = rankForTier(tier);
  const cycle = Math.floor((tier - 1) / 3);
  const ageBand = tier < 4 ? 'little prince' : tier < 8 ? 'growing prince' : tier < 12 ? 'crown prince' : 'young king';
  const virtues = ['care', 'service', 'fairness', 'truth', 'mercy', 'justice', 'stewardship', 'law', 'wisdom', 'civilization'];
  const virtue = virtues[(tier - 1) % virtues.length];
  const tierName = tier >= 12 ? `The Young King Builds Civilization ${cycle + 1}` : `Royal Ascent ${tier}: ${titleCase(virtue)}`;

  const steps = [
    {
      tutorId: 'aurelius',
      mode: `${titleCase(virtue)} Council`,
      seal: `${titleCase(virtue)} Seal`,
      focus: `Use ${virtue} to help the realm.`,
      story: `A small problem appears in the castle. The ${ageBand} can make one noble choice.`,
      childPrompt: 'What should the prince do first?',
      prompt: 'Choose one noble action and say a tiny why.',
      artifacts: ['help', 'truth', 'fair', 'kind voice'],
      answerStarters: ['I can help.', 'I can tell the truth.', 'I can be fair.', 'I can use kind words.'],
      successCriteria: ['noble action', 'one tiny reason', 'care for another']
    },
    {
      tutorId: 'hypatia',
      mode: `Order of ${tier}`,
      seal: 'Order Key',
      focus: 'Find the rule beneath the visible things.',
      story: 'The Star Tower shows objects in a hidden order. One piece belongs next.',
      childPrompt: 'What is the rule?',
      prompt: 'Find one pattern, count, sort, or match.',
      artifacts: ['pattern', 'count', 'same', 'next'],
      answerStarters: ['It goes next.', 'These match.', 'I can count.', 'The rule is same.'],
      successCriteria: ['finds a rule', 'uses one math word', 'shows with objects']
    },
    {
      tutorId: 'sappho',
      mode: 'Royal Speech',
      seal: 'Clear Word',
      focus: 'Speak one clear thought with courage.',
      story: 'The Scriptorium opens a page for the prince to explain what he saw.',
      childPrompt: 'What can the prince say?',
      prompt: 'Say one clear sentence, then add one word if ready.',
      artifacts: ['sentence', 'because', 'story', 'voice'],
      answerStarters: ['I think it is good.', 'Because it helps.', 'The prince can say it.', 'I can explain.'],
      successCriteria: ['clear sentence', 'child words', 'one added detail']
    },
    {
      tutorId: 'leonidas',
      mode: 'Command the Self',
      seal: 'Self Command Shield',
      focus: 'Rule the body before ruling anything else.',
      story: 'The Training Yard grows loud. The prince can choose calm strength.',
      childPrompt: 'What does a strong prince do?',
      prompt: 'Practice one body-control move.',
      artifacts: ['breathe', 'wait', 'try again', 'steady hands'],
      answerStarters: ['I can breathe.', 'I can wait.', 'I can try again.', 'My hands are steady.'],
      successCriteria: ['body control', 'calm choice', 'keeps trying']
    },
    {
      tutorId: 'ibn-sina',
      mode: 'Living World Inquiry',
      seal: 'World Lens',
      focus: 'Observe the world and care for what lives.',
      story: 'The Garden Laboratory gives the prince a real thing to notice: color, shape, sound, or change.',
      childPrompt: 'What do you notice?',
      prompt: 'Name one true detail and one care move.',
      artifacts: ['observe', 'color', 'shape', 'care'],
      answerStarters: ['I see it.', 'It is changing.', 'It needs care.', 'I can look closely.'],
      successCriteria: ['true detail', 'care move', 'slow looking']
    }
  ];

  return {
    tier,
    name: tierName,
    rank,
    focus: `Build from earlier ${virtue}, order, speech, self-command, and observation.`,
    builtFrom: tier > 1 ? `Tier ${tier - 1}` : 'First principles',
    ...(includeSource ? { source: 'local' } : {}),
    steps
  };
}

function rankForTier(tier) {
  if (tier >= 20) {
    return `Civilization Builder ${tier}`;
  }
  if (tier >= 16) {
    return `Wise King ${tier}`;
  }
  if (tier >= 12) {
    return `King of the Realm ${tier}`;
  }
  if (tier >= 10) {
    return 'King in Training';
  }
  if (tier >= 8) {
    return 'Crown Prince';
  }
  if (tier >= 6) {
    return 'Royal Strategist';
  }
  if (tier >= 4) {
    return 'Scholar Prince';
  }
  if (tier >= 3) {
    return 'Young Steward';
  }
  if (tier >= 2) {
    return 'Household Steward';
  }
  return 'Novice Regent';
}

function titleCase(value) {
  return String(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function loadProgress() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(progressStorageKey) || '{}');
    const next = tutors.reduce((profiles, tutor) => {
      profiles[tutor.id] = { ...defaultProfile(tutor.id), ...(parsed[tutor.id] || {}) };
      return profiles;
    }, {});
    next.__path = migrateRoyalPath(parsed);
    return next;
  } catch {
    const next = tutors.reduce((profiles, tutor) => {
      profiles[tutor.id] = defaultProfile(tutor.id);
      return profiles;
    }, {});
    next.__path = defaultRoyalPath();
    return next;
  }
}

function saveProgress() {
  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
}

function loadRecentTrials() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(recentTrialStorageKey) || '[]');
    return Array.isArray(parsed) ? parsed.slice(-12) : [];
  } catch {
    return [];
  }
}

function saveRecentTrials() {
  window.localStorage.setItem(recentTrialStorageKey, JSON.stringify(recentTrials.slice(-12)));
}

function castleMastery() {
  return royalPath().totalSeals;
}

function renderRooms() {
  roomNav.innerHTML = '';
  const path = royalPath();
  const plan = currentTierPlan(path);
  tutors.forEach((tutor) => {
    const index = curriculumStepIndexForTutor(tutor.id, path);
    const step = plan.steps[index] || currentPathStep(path);
    const state = roomPathState(tutor.id, path);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = [
      'room-card',
      tutor.id === activeTutor.id ? 'active' : '',
      state === 'complete' ? 'complete' : '',
      state === 'current' ? 'current' : '',
      state === 'locked' ? 'locked' : ''
    ].filter(Boolean).join(' ');
    button.disabled = state === 'locked';
    button.setAttribute('aria-label', `${tutor.roomName}: ${pathStatusLabel(state)}`);
    button.style.setProperty('--tutor-color', tutor.color);
    button.style.setProperty('--tutor-accent', tutor.accent);
    button.style.setProperty('--room-image', `url("${tutor.roomImageUrl}")`);

    const tower = document.createElement('span');
    tower.className = 'room-tower';
    const portrait = document.createElement('img');
    portrait.src = tutor.imageUrl;
    portrait.alt = `${tutor.name} portrait`;
    tower.appendChild(portrait);

    const copy = document.createElement('span');
    copy.className = 'room-copy';
    const roomName = document.createElement('strong');
    roomName.textContent = tutor.roomName;
    const status = document.createElement('small');
    status.textContent = `${pathStatusLabel(state)} - Step ${index + 1}/${plan.steps.length}`;
    const focus = document.createElement('em');
    focus.textContent = step.focus;
    copy.append(roomName, status, focus);

    const seal = document.createElement('span');
    seal.className = 'room-seal';
    seal.setAttribute('aria-hidden', 'true');
    button.append(tower, copy, seal);
    button.addEventListener('click', () => selectTutor(tutor));
    roomNav.appendChild(button);
  });
}

function renderMasteryList() {
  const list = document.querySelector('#masteryList');
  const path = royalPath();
  const plan = currentTierPlan(path);
  list.innerHTML = '';
  plan.steps.forEach((step, index) => {
    const tutor = tutorById(step.tutorId);
    const state = index < path.stepIndex || path.completedSteps.includes(index)
      ? 'complete'
      : index === path.stepIndex
        ? 'current'
        : 'locked';
    const item = document.createElement('li');
    item.className = state;
    const mode = document.createElement('strong');
    mode.textContent = step.mode;
    const detail = document.createElement('span');
    detail.textContent = `${tutor.roomName} - ${pathStatusLabel(state)} - ${step.focus}`;
    item.append(mode, detail);
    list.appendChild(item);
  });
}

function pathStatusLabel(state) {
  if (state === 'complete') {
    return 'Earned';
  }
  if (state === 'current') {
    return 'Now';
  }
  return 'Locked';
}

function renderFormationBoard() {
  document.querySelector('#doctrineBoard').innerHTML = nobleDoctrine.map(([title, body]) => `
    <article>
      <strong>${title}</strong>
      <p>${body}</p>
    </article>
  `).join('');

  document.querySelector('#civilizationMap').innerHTML = civilizationCases.map((item) => `
    <button type="button" class="case-pod" style="--case-accent:${caseColor(item.civilization)}">
      <strong>${item.civilization}</strong>
      <span>${item.focus}</span>
      <em>${item.lesson}</em>
      <small>${item.reliability}</small>
    </button>
  `).join('');

  document.querySelector('#formationTimeline').innerHTML = ageStages.map(([age, title, focus]) => `
    <div>
      <strong>${age}</strong>
      <span>${title}</span>
      <p>${focus}</p>
    </div>
  `).join('');

  document.querySelector('#formationRings').innerHTML = `
    <div class="ring-center">Noble Prince</div>
    ${formationRings.map(([ring, focus]) => `
      <div>
        <strong>${ring}</strong>
        <span>${focus}</span>
      </div>
    `).join('')}
  `;

  document.querySelector('#careProtocol').innerHTML = careProtocol.map(([title, body]) => `
    <div>
      <strong>${title}</strong>
      <span>${body}</span>
    </div>
  `).join('');

  document.querySelector('#sourceLibrary').innerHTML = sourceLibrary.map(([civilization, source, type, tags]) => `
    <div>
      <strong>${civilization}</strong>
      <span>${source}</span>
      <em>${type}</em>
      <small>${tags}</small>
    </div>
  `).join('');

  document.querySelector('#curriculumMatrix').innerHTML = curriculumMatrix.map(([course, focus]) => `
    <div>
      <strong>${course}</strong>
      <span>${focus}</span>
    </div>
  `).join('');

  document.querySelector('#engagementLabs').innerHTML = engagementLabs.map(([lab, practice]) => `
    <div>
      <strong>${lab}</strong>
      <span>${practice}</span>
    </div>
  `).join('');

  document.querySelector('#tutorManual').innerHTML = tutorManual.map(([standard, practice]) => `
    <div>
      <strong>${standard}</strong>
      <span>${practice}</span>
    </div>
  `).join('');

  document.querySelector('#readinessDashboard').innerHTML = readinessRubric.map(([standard, score, sign]) => `
    <div>
      <label><span>${standard}</span><strong>${score}%</strong></label>
      <div class="readiness-track"><i style="width:${score}%"></i></div>
      <small>${sign}</small>
    </div>
  `).join('');
}

function caseColor(civilization) {
  const colors = {
    Persia: '#d6b46a',
    Macedonia: '#74d4c0',
    Greece: '#8db7ff',
    Egypt: '#f0a66b',
    China: '#e66d5c',
    Assyria: '#b99cff',
    Rome: '#dfb55f',
    India: '#65c49b'
  };
  return colors[civilization] || '#dfb55f';
}

function renderTrial() {
  const profile = tutorProfile();
  const path = royalPath();
  const plan = currentTierPlan(path);
  const step = curriculumStepForTutor(activeTutor.id, path);
  const stepIndex = curriculumStepIndexForTutor(activeTutor.id, path);
  app.style.setProperty('--tutor-color', activeTutor.color);
  app.style.setProperty('--tutor-accent', activeTutor.accent);
  app.style.setProperty('--room-image', `url("${activeTutor.roomImageUrl}")`);

  document.querySelector('#roomName').textContent = activeTutor.roomName;
  document.querySelector('#roomDescription').textContent = activeTutor.roomDescription;
  document.querySelector('#mentorPortrait').src = activeTutor.imageUrl;
  document.querySelector('#mentorPortrait').alt = `${activeTutor.name} portrait`;
  document.querySelector('#mentorTitle').textContent = activeTutor.title;
  document.querySelector('#mentorName').textContent = activeTutor.name;
  document.querySelector('#mentorMotto').textContent = activeTutor.motto;
  document.querySelector('#mentorTone').textContent = activeTutor.tone;
  document.querySelector('#currentLevelLabel').textContent = `Tier ${path.tier} - Step ${path.stepIndex + 1}/${plan.steps.length}`;
  document.querySelector('#rankName').textContent = pathRank(path);
  document.querySelector('#progressFill').style.width = `${Math.round((path.stepIndex / plan.steps.length) * 100)}%`;
  document.querySelector('#progressText').textContent = `${path.stepIndex}/${plan.steps.length} chambers earned in ${plan.name}`;
  document.querySelector('#sealCount').textContent = String(castleMastery());
  document.querySelector('.seal-count span').textContent = 'royal seals earned';
  document.querySelector('#nextUnlock').textContent = nextUnlockText();
  document.querySelector('#builderStatus').textContent = curriculumBuilderStatus;
  document.querySelector('#newTrial').textContent = activeTutor.id === currentPathStep(path).tutorId ? 'New Trial' : 'Go To Next Lesson';

  renderRooms();
  renderMasteryList();
  primeCurriculumBuilder(path);

  if (!activeTrial) {
    document.querySelector('#lessonLevel').textContent = `${plan.name}`;
    document.querySelector('#sealName').textContent = `${step?.seal || activeTutor.roomName} - Step ${Math.max(1, stepIndex + 1)}/${plan.steps.length}`;
    document.querySelector('#lessonTitle').textContent = 'The tutor is preparing a royal trial.';
    document.querySelector('#lessonOpening').textContent = 'The chamber is reading the prince\'s record.';
    document.querySelector('#guideAsk').textContent = 'Ask the big question.';
    document.querySelector('#trialStory').textContent = '';
    document.querySelector('#childPrompt').textContent = '';
    document.querySelector('#lessonPrompt').textContent = 'A new challenge is being forged.';
    document.querySelector('#trialObjective').textContent = '';
    document.querySelector('#trialRitual').textContent = '';
    document.querySelector('#coachSteps').innerHTML = '';
    document.querySelector('#artifactRack').innerHTML = '';
    document.querySelector('#starterRack').innerHTML = '';
    document.querySelector('#criteriaGrid').innerHTML = '';
    document.querySelector('#parentCue').textContent = '';
    return;
  }

  document.querySelector('#lessonLevel').textContent = roomPathState(activeTutor.id, path) === 'complete' ? 'Review chamber' : 'Current royal lesson';
  document.querySelector('#sealName').textContent = `${step.seal} - Step ${Math.max(1, stepIndex + 1)}/${plan.steps.length}`;
  document.querySelector('#lessonTitle').textContent = activeTrial.title;
  document.querySelector('#lessonOpening').textContent = activeTrial.scene;
  document.querySelector('#guideAsk').textContent = activeTrial.childPrompt;
  document.querySelector('#trialStory').textContent = activeTrial.story;
  document.querySelector('#childPrompt').textContent = activeTrial.childPrompt;
  document.querySelector('#lessonPrompt').textContent = activeTrial.prompt;
  document.querySelector('#trialObjective').textContent = activeTrial.objective;
  document.querySelector('#trialRitual').textContent = activeTrial.ritual;
  document.querySelector('#parentCue').textContent = activeTrial.parentCue;

  const coachSteps = document.querySelector('#coachSteps');
  coachSteps.innerHTML = '';
  activeTrial.coachSteps.forEach((step) => {
    const item = document.createElement('span');
    item.textContent = step;
    coachSteps.appendChild(item);
  });

  const rack = document.querySelector('#artifactRack');
  rack.innerHTML = '';
  activeTrial.artifacts.forEach((artifact) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = artifact;
    button.classList.toggle('selected', selectedArtifacts.includes(artifact));
    button.addEventListener('click', () => toggleArtifact(artifact));
    rack.appendChild(button);
  });

  const starters = document.querySelector('#starterRack');
  starters.innerHTML = '';
  activeTrial.answerStarters.forEach((starter) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = starter;
    button.classList.toggle('selected', answerInput.value.trim() === starter.trim());
    button.addEventListener('click', () => addStarter(starter));
    starters.appendChild(button);
  });

  const criteriaGrid = document.querySelector('#criteriaGrid');
  criteriaGrid.innerHTML = '';
  activeTrial.successCriteria.forEach((criterion) => {
    const item = document.createElement('span');
    item.textContent = criterion;
    criteriaGrid.appendChild(item);
  });
}

function nextUnlockText() {
  const path = royalPath();
  const plan = currentTierPlan(path);
  const step = currentPathStep(path);
  const tutor = tutorById(step.tutorId);
  return `Complete ${plan.name}: ${tutor.roomName} - ${step.focus}`;
}

function primeCurriculumBuilder(path = royalPath()) {
  const plan = currentTierPlan(path);
  const nextTier = path.tier + 1;
  const ready = allCurriculumPlans().find((item) => item.tier === nextTier);

  if (ready?.source !== 'local') {
    curriculumBuilderStatus = `Tier ${nextTier} is ready: ${ready.name}`;
    updateBuilderStatus();
    return;
  }

  if (path.stepIndex < Math.max(0, plan.steps.length - 1)) {
    curriculumBuilderStatus = `Tier ${nextTier} queued. The builder wakes at the final chamber.`;
    updateBuilderStatus();
    return;
  }

  if (window.localStorage.getItem('prince-academy.ai-curriculum') === 'off') {
    curriculumBuilderStatus = `Tier ${nextTier} local path is ready. AI builder is paused.`;
    updateBuilderStatus();
    return;
  }

  buildTierInBackground(nextTier);
}

async function buildTierInBackground(tier) {
  if (tier <= royalCurriculum.length || curriculumBuildsInFlight.has(tier)) {
    return;
  }

  const existing = allCurriculumPlans().find((plan) => plan.tier === tier);
  if (existing?.source === 'ai') {
    curriculumBuilderStatus = `Tier ${tier} is ready: ${existing.name}`;
    updateBuilderStatus();
    return;
  }

  const fallback = existing || createLocalTierPlan(tier);
  upsertGeneratedTier(fallback);
  if (curriculumBuildAttempts.has(tier)) {
    curriculumBuilderStatus = `Tier ${tier} is ready: ${fallback.name}`;
    updateBuilderStatus();
    return;
  }

  curriculumBuildsInFlight.add(tier);
  curriculumBuildAttempts.add(tier);
  curriculumBuilderStatus = `Forging Tier ${tier}: ${fallback.name}`;
  updateBuilderStatus();

  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 70000);
    const response = await fetch('/api/curriculum-tier', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        tier,
        currentPath: royalPath(),
        previousTier: currentTierPlan({ ...royalPath(), tier: Math.max(1, tier - 1) }),
        baseTiers: royalCurriculum,
        tutors
      })
    });
    window.clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('Curriculum builder request failed');
    }

    const generated = normalizeTierPlan({ ...(await response.json()), tier, source: 'ai' });
    if (generated) {
      upsertGeneratedTier(generated);
      curriculumBuilderStatus = `Tier ${tier} is ready: ${generated.name}`;
    }
  } catch {
    curriculumBuilderStatus = `Tier ${tier} is ready: ${fallback.name}`;
  } finally {
    curriculumBuildsInFlight.delete(tier);
    updateBuilderStatus();
  }
}

function updateBuilderStatus() {
  const status = document.querySelector('#builderStatus');
  if (status) {
    status.textContent = curriculumBuilderStatus;
  }
}

function selectTutor(tutor) {
  if (roomPathState(tutor.id) === 'locked') {
    return;
  }

  app.classList.add('room-changing');
  activeTutor = tutor;
  selectedArtifacts = [];
  answerInput.value = '';
  resultCard.className = 'result-card';
  continueButton.hidden = true;
  activeTrial = undefined;
  renderTrial();
  loadAdaptiveTrial();
  window.setTimeout(() => app.classList.remove('room-changing'), 520);
}

async function loadAdaptiveTrial() {
  const baseProfile = tutorProfile();
  const path = royalPath();
  const plan = currentTierPlan(path);
  const curriculumStage = curriculumStepForTutor(activeTutor.id, path);
  const profile = {
    ...baseProfile,
    tier: path.tier,
    pathTier: path.tier,
    pathStepIndex: path.stepIndex,
    pathName: plan.name,
    rankName: pathRank(path)
  };
  const tutorId = activeTutor.id;

  activeTrial = localFallbackTrial(activeTutor, profile, curriculumStage);
  activeTrial.tutorId = tutorId;
  activeTrial.profileTier = path.tier;
  selectedArtifacts = [];
  answerInput.value = '';
  resultCard.className = 'result-card';
  continueButton.hidden = true;
  renderTrial();

  if (window.localStorage.getItem('prince-academy.ai-trials') !== 'on') {
    recentTrials = [...recentTrials, { tutorId: activeTutor.id, title: activeTrial.title, mode: activeTrial.mode }].slice(-12);
    saveRecentTrials();
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    const response = await fetch('/api/adaptive-trial', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        tutor: activeTutor,
        profile,
        royalPath: path,
        tierPlan: plan,
        curriculumStage,
        recentTrials: recentTrials.filter((trial) => trial.tutorId === activeTutor.id).slice(-5)
      })
    });
    window.clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('Trial request failed');
    }

    const generatedTrial = await response.json();
    if (activeTutor.id === tutorId && !answerInput.value.trim()) {
      activeTrial = mergeTrialScaffold(generatedTrial, activeTrial);
    }
  } catch {
    // The local trial is already on screen.
  }

  activeTrial.tutorId = tutorId;
  activeTrial.profileTier = path.tier;
  recentTrials = [...recentTrials, { tutorId: activeTutor.id, title: activeTrial.title, mode: activeTrial.mode }].slice(-12);
  saveRecentTrials();
  renderTrial();
}

function toggleArtifact(artifact) {
  selectedArtifacts = selectedArtifacts.includes(artifact)
    ? selectedArtifacts.filter((item) => item !== artifact)
    : [...selectedArtifacts, artifact];
  renderTrial();
}

function addStarter(starter) {
  const cleanStarter = starter.replace(/\s+$/, '');
  answerInput.value = cleanStarter;
  document.querySelectorAll('#starterRack button').forEach((button) => {
    button.classList.toggle('selected', button.textContent.trim() === cleanStarter.trim());
  });
  document.querySelector('#submitAnswer').focus();
}

function continueRoyalPath() {
  const nextStep = currentPathStep();
  const nextTutor = tutorById(nextStep.tutorId);

  if (!nextTutor) {
    loadAdaptiveTrial();
    return;
  }

  if (activeTutor.id === nextTutor.id) {
    loadAdaptiveTrial();
    return;
  }

  selectTutor(nextTutor);
}

async function submitTrial() {
  const rawAnswer = answerInput.value.trim();

  if (!rawAnswer || !activeTrial) {
    return;
  }

  const evaluation = localEvaluate(activeTrial, rawAnswer);
  const submissionId = Date.now();
  lastSubmissionId = submissionId;
  const tutorSnapshot = activeTutor;
  const trialSnapshot = activeTrial;
  const profileSnapshot = { ...tutorProfile() };
  const pathSnapshot = JSON.parse(JSON.stringify(royalPath()));
  const planSnapshot = currentTierPlan(pathSnapshot);
  const stageSnapshot = curriculumStepForTutor(tutorSnapshot.id, pathSnapshot);
  applyEvaluation(evaluation);
  showEvaluation(evaluation);
  speak(lastResultText);
  if (window.localStorage.getItem('prince-academy.ai-feedback') === 'on') {
    refineEvaluationInBackground(submissionId, rawAnswer, tutorSnapshot, trialSnapshot, profileSnapshot, pathSnapshot, planSnapshot, stageSnapshot);
  }
}

function showEvaluation(evaluation) {
  renderTrial();
  document.querySelector('#resultKicker').textContent = evaluation.mastered
    ? `Reward earned - ${evaluation.earnedTitle}`
    : 'Try again together';
  document.querySelector('#resultLine').textContent = evaluation.mentorLine;
  document.querySelector('#resultEvent').textContent = evaluation.event || '';
  document.querySelector('#resultRelic').textContent = evaluation.relic ? `Relic: ${evaluation.relic}` : '';
  document.querySelector('#resultSpark').textContent = evaluation.spark ? `Spark: ${evaluation.spark}` : '';
  document.querySelector('#resultStretch').textContent = evaluation.mastered
    ? `Victory move: ${evaluation.nextChallenge}`
    : `Try this: ${evaluation.nextChallenge}`;
  continueButton.hidden = !evaluation.mastered;
  continueButton.textContent = evaluation.mastered ? 'Continue Path' : 'Try Again';
  resultCard.className = 'result-card';
  void resultCard.offsetWidth;
  resultCard.className = `result-card visible ${evaluation.mastered ? 'correct' : ''}`;
  lastResultText = `${evaluation.mentorLine} ${evaluation.event || ''} ${evaluation.relic ? `Relic earned: ${evaluation.relic}.` : ''} ${evaluation.nextChallenge}`;
}

async function refineEvaluationInBackground(submissionId, rawAnswer, tutorSnapshot, trialSnapshot, profileSnapshot, pathSnapshot, planSnapshot, stageSnapshot) {
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    const response = await fetch('/api/adaptive-evaluate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        tutor: tutorSnapshot,
        trial: trialSnapshot,
        answer: rawAnswer,
        profile: profileSnapshot,
        royalPath: pathSnapshot,
        tierPlan: planSnapshot,
        curriculumStage: stageSnapshot
      })
    });
    window.clearTimeout(timeout);

    if (!response.ok || submissionId !== lastSubmissionId) {
      return;
    }

    const refined = await response.json();
    if (!refined.mentorLine || refined.mentorLine === document.querySelector('#resultLine').textContent) {
      return;
    }

    if (hasNegativeRewardText(`${refined.mentorLine} ${refined.insight} ${refined.nextChallenge}`)) {
      return;
    }

    document.querySelector('#resultLine').textContent = refined.mentorLine;
    document.querySelector('#resultEvent').textContent = refined.event || document.querySelector('#resultEvent').textContent;
    document.querySelector('#resultRelic').textContent = refined.relic ? `Relic: ${refined.relic}` : document.querySelector('#resultRelic').textContent;
    document.querySelector('#resultSpark').textContent = refined.spark ? `Spark: ${refined.spark}` : document.querySelector('#resultSpark').textContent;
    document.querySelector('#resultStretch').textContent = refined.mastered
      ? `Victory move: ${refined.nextChallenge}`
      : `Try this: ${refined.nextChallenge}`;
    lastResultText = `${refined.mentorLine} ${refined.event || ''} ${refined.relic ? `Relic earned: ${refined.relic}.` : ''} ${refined.nextChallenge}`;
  } catch {
    // The immediate local evaluation is already shown.
  }
}

function hasNegativeRewardText(text) {
  return /\b(not a guess|wrong|failed|harder|needs|evidence|explanation|however|but)\b/i.test(String(text || ''));
}

function applyEvaluation(evaluation) {
  const profile = tutorProfile();
  const path = royalPath();
  const plan = currentTierPlan(path);
  const score = Math.max(0, Math.min(100, Number(evaluation.score || 0)));
  const previousMastery = profile.mastery;
  const stepIndex = curriculumStepIndexForTutor(activeTutor.id, path);

  profile.attempts += 1;
  profile.lastScore = score;
  profile.xp += score;
  profile.tier = path.tier;
  profile.mastery = Math.round(previousMastery * 0.58 + score * 0.42);

  if (evaluation.mastered) {
    profile.mastered += 1;
    profile.streak += 1;
  } else {
    profile.streak = 0;
  }

  if (evaluation.mastered && stepIndex === path.stepIndex) {
    const completedStep = plan.steps[stepIndex];
    const nextStepIndex = stepIndex + 1;

    path.completedSteps = [...new Set([...path.completedSteps, stepIndex])];
    path.totalSeals += 1;
    evaluation.relic = completedStep.seal || evaluation.relic;

    if (nextStepIndex >= plan.steps.length) {
      path.completedTiers += 1;
      path.tier = Math.min(12, path.tier + 1);
      path.stepIndex = 0;
      path.completedSteps = [];
      const nextPlan = currentTierPlan(path);
      const nextStep = currentPathStep(path);
      const nextTutor = tutorById(nextStep.tutorId);
      evaluation.event = `Tier ${plan.tier} complete! ${nextPlan.name} opens.`;
      evaluation.spark = `Tier ${path.tier}`;
      evaluation.nextChallenge = `Begin ${nextPlan.name} in the ${nextTutor.roomName}.`;
    } else {
      path.stepIndex = nextStepIndex;
      const nextStep = currentPathStep(path);
      const nextTutor = tutorById(nextStep.tutorId);
      evaluation.event = `${nextTutor.roomName} unlocked!`;
      evaluation.spark = `Step ${path.stepIndex + 1} of ${plan.steps.length}`;
      evaluation.nextChallenge = `Continue to the ${nextTutor.roomName}: ${nextStep.focus}`;
    }
  }

  profile.rankName = pathRank(path);
  saveProgress();
}

function rankForProfile(profile) {
  return rankForTier(Number(profile.tier || royalPath().tier || 1));
}

function localFallbackTrial(tutor, profile, curriculumStage = curriculumStepForTutor(tutor.id)) {
  if (curriculumStage) {
    return {
      id: `local-${Date.now()}`,
      title: `${curriculumStage.mode}: Tier ${profile.tier}`,
      rankName: pathRank(),
      mode: curriculumStage.mode,
      scene: `The ${tutor.roomName} opens ${curriculumStage.seal} for ${currentTierPlan().name}.`,
      story: curriculumStage.story,
      childPrompt: curriculumStage.childPrompt,
      objective: `Learn this: ${curriculumStage.focus}`,
      prompt: curriculumStage.prompt,
      ritual: 'Parent move: read the story, ask the question, accept pointing, acting, or a short spoken answer.',
      coachSteps: ['1. Read the story', '2. Ask the prince question', '3. Tap or write his words'],
      artifacts: curriculumStage.artifacts,
      answerStarters: curriculumStage.answerStarters,
      successCriteria: curriculumStage.successCriteria,
      hint: 'Use one card, one action, or one tiny sentence.',
      parentCue: `Parent cue: This connects to the royal path: ${curriculumStage.focus}`,
      difficulty: profile.tier,
      xpTarget: 60 + profile.tier * 5
    };
  }

  const trial = {
    virtue: {
      mode: 'Council Judgment',
      story: 'A little friend is crying by the block tower. A toy was taken and the tower fell.',
      childPrompt: 'What can the prince do first?',
      prompt: 'Tell one kind thing the prince can do. A short answer is enough.',
      artifacts: ['help', 'kind voice', 'share', 'tell the truth'],
      answerStarters: ['I can help.', 'I can share.', 'I can say sorry.', 'I can ask nicely.']
    },
    logic: {
      mode: 'Pattern Forge',
      story: 'The Star Tower has stepping stones: red, blue, red, blue. One stone is missing.',
      childPrompt: 'What comes next?',
      prompt: 'Say the next stone. If he can, ask him to make the pattern with toys.',
      artifacts: ['red', 'blue', 'again', 'next'],
      answerStarters: ['Red comes next.', 'Blue comes next.', 'It goes again.', 'I can show it.']
    },
    language: {
      mode: 'Story Smithing',
      story: 'In the Scriptorium, a tiny word is hiding inside a story.',
      childPrompt: 'Can the prince say one brave sentence?',
      prompt: 'Let him say one sentence about a brave or kind thing.',
      artifacts: ['one word', 'one sentence', 'brave', 'clear voice'],
      answerStarters: ['I am brave.', 'I can help.', 'The prince tried.', 'I can say it.']
    },
    discipline: {
      mode: 'Second-Try Arena',
      story: 'In the Training Yard, the prince tries a jump and misses. The tutor smiles and waits.',
      childPrompt: 'What should he do next?',
      prompt: 'Take one breath together. Then say what the prince can try again.',
      artifacts: ['breath', 'stand tall', 'try again', 'slow'],
      answerStarters: ['I can breathe.', 'I can try again.', 'I can go slow.', 'I can stand tall.']
    },
    nature: {
      mode: 'Observation Hunt',
      story: 'In the Garden Laboratory, a little leaf has lines, color, and a shape.',
      childPrompt: 'What do you notice?',
      prompt: 'Look at a plant, leaf, or picture. Say one thing you see.',
      artifacts: ['color', 'shape', 'big or small', 'water'],
      answerStarters: ['I see green.', 'It is small.', 'It has a shape.', 'It needs water.']
    }
  }[tutor.domain];

  return {
    id: `local-${Date.now()}`,
    title: `${trial.mode}: Tier ${profile.tier}`,
    rankName: rankForProfile(profile),
    mode: trial.mode,
    scene: `The ${tutor.roomName} opens a little gate for a four-year-old prince.`,
    story: trial.story,
    childPrompt: trial.childPrompt,
    objective: 'Listen, point, say one idea, then try one tiny reason.',
    prompt: trial.prompt,
    ritual: 'Parent move: read the story, ask the question, accept a short spoken answer.',
    coachSteps: ['1. Read it', '2. Let him point or act', '3. Write his words'],
    artifacts: trial.artifacts,
    answerStarters: trial.answerStarters,
    successCriteria: ['one clear idea', 'uses a word card', 'tries a reason'],
    hint: 'Point to one card. Say one small sentence.',
    parentCue: 'Parent cue: If he freezes, offer two choices and let him point.',
    difficulty: profile.tier,
    xpTarget: 60 + profile.tier * 5
  };
}

function mergeTrialScaffold(generatedTrial, scaffoldTrial) {
  return {
    ...generatedTrial,
    story: generatedTrial.story || scaffoldTrial.story,
    childPrompt: generatedTrial.childPrompt || scaffoldTrial.childPrompt,
    coachSteps: normalizeArray(generatedTrial.coachSteps, scaffoldTrial.coachSteps),
    answerStarters: normalizeArray(generatedTrial.answerStarters, scaffoldTrial.answerStarters),
    parentCue: generatedTrial.parentCue || scaffoldTrial.parentCue,
    prompt: generatedTrial.prompt || scaffoldTrial.prompt,
    ritual: generatedTrial.ritual || scaffoldTrial.ritual,
    artifacts: normalizeArray(generatedTrial.artifacts, scaffoldTrial.artifacts),
    successCriteria: normalizeArray(generatedTrial.successCriteria, scaffoldTrial.successCriteria)
  };
}

function normalizeArray(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

const rewardFeedbackPools = {
  virtue: {
    mastered: [
      'Aurelius smiles wide. The Great Hall cheers for that kind choice!',
      'A gold banner rises. The prince chose help!',
      'The council celebrates. Kindness won the room!',
      'Aurelius awards a bright nod for noble help!'
    ],
    developing: [
      'Aurelius gives a warm hint. Pick one helpful move.',
      'The hall is ready. Choose help, share, or kind words.',
      'Almost there. Tap one kind answer and try again.'
    ],
    events: ['The Kindness Gate opens!', 'A gold banner drops in the Great Hall!', 'The council table lights up!', 'The service bell rings!'],
    tryEvents: ['A small lantern turns on.', 'The gate glows a little.', 'The council waits warmly.'],
    relics: ['Kindness Seal', 'Helping Hand', 'Truth Coin', 'Gentle Crown'],
    sparks: ['service', 'mercy', 'fairness', 'truth'],
    insights: ['Kindness power gained.', 'The hall accepts the answer.', 'The prince made the room brighter.'],
    next: ['Collect the relic and choose another room.', 'Give a royal high five.', 'Ring the hall bell once.', 'Act it out with two toys for a bonus crown.'],
    scaffold: ['Offer: help or walk away?', 'Point to the help card and say it together.', 'Act out the crying friend with a toy.'],
    titles: ['Keeper of Kindness', 'Little Shield of the Hall', 'Friend of the Realm']
  },
  logic: {
    mastered: [
      'Hypatia lights a star. Correct path found!',
      'The Star Tower clicks into place. The pattern gate opens!',
      'Hypatia smiles. The prince found the next stone!',
      'A star gear spins above the tower. Pattern power unlocked!'
    ],
    developing: [
      'Hypatia points to the stones. Touch each color slowly.',
      'The tower is ready. Say red, blue, red, blue.',
      'Almost there. Let him tap the stones as he says them.'
    ],
    events: ['A constellation draws itself!', 'The Pattern Gate unlocks!', 'A star gear turns!', 'The counting stairs glow!'],
    tryEvents: ['One star blinks, waiting.', 'The gate hums softly.', 'The stones reset for another try.'],
    relics: ['Star Gear', 'Pattern Key', 'Counting Stone', 'Moon Compass'],
    sparks: ['pattern', 'next', 'counting', 'rule'],
    insights: ['Pattern power gained.', 'The tower accepts the answer.', 'The prince found the hidden repeat.'],
    next: ['Collect the Star Gear.', 'Build the pattern with fingers.', 'Let him be the tutor and quiz you.', 'Choose a new room for a bonus spark.'],
    scaffold: ['Say it together: red, blue, red, blue.', 'Cover the last stone and reveal it.', 'Use two toys instead of words.'],
    titles: ['Star Finder', 'Pattern Prince', 'Keeper of the Next Stone']
  },
  language: {
    mastered: [
      'Sappho rings the golden bell. That sentence shines!',
      'The Scriptorium catches his words and turns them gold!',
      'Sappho heard a clear prince voice!',
      'The word gate opens. A brave sentence enters the book!'
    ],
    developing: [
      'Sappho offers one word first. Let him say just that.',
      'The page is ready for one brave word.',
      'Try a tiny sentence: I can help.'
    ],
    events: ['Ink turns gold on the page!', 'A story ribbon curls open!', 'The word bell rings!', 'A tiny book unlocks!'],
    tryEvents: ['The page waits with a dot of ink.', 'A small word lantern glows.', 'The quill pauses warmly.'],
    relics: ['Golden Word', 'Story Ribbon', 'Clear Voice Bell', 'Brave Sentence'],
    sparks: ['word', 'voice', 'story', 'sentence'],
    insights: ['Word power gained.', 'The page accepts the sentence.', 'The prince gave his thought a voice.'],
    next: ['Collect the Golden Word.', 'Say it in a silly royal voice.', 'Draw the sentence for a bonus ribbon.', 'Choose a new room while the words still sparkle.'],
    scaffold: ['Give him the first word and let him finish.', 'Offer two sentence buttons.', 'Ask him to repeat your sentence.'],
    titles: ['Keeper of Words', 'Little Bard', 'Sentence Knight']
  },
  discipline: {
    mastered: [
      'Leonidas taps the shield. Courage spark earned!',
      'The Training Yard cheers. The prince found his brave body!',
      'Leonidas raises the bronze shield. Calm power unlocked!',
      'The courage drum booms once. Second-try strength gained!'
    ],
    developing: [
      'Leonidas lowers the pace. One breath first.',
      'The yard is ready. Breathe, stand, try one thing.',
      'Make it tiny. One breath is enough.'
    ],
    events: ['The shield wall rises!', 'The courage drum beats!', 'The practice gate opens!', 'A bronze shield flashes!'],
    tryEvents: ['The shield warms up.', 'The yard quiets down.', 'The drum waits for one breath.'],
    relics: ['Still Shield', 'Second-Try Drum', 'Calm Breath', 'Bronze Step'],
    sparks: ['courage', 'breath', 'patience', 'try again'],
    insights: ['Courage power gained.', 'The yard accepts the answer.', 'The prince chose a strong next move.'],
    next: ['Collect the Still Shield.', 'Do one victory breath together.', 'Show the strong stance.', 'March to another room for a bonus spark.'],
    scaffold: ['Model one breath for him.', 'Offer: try again or stop?', 'Let him point to the breath card.'],
    titles: ['Shield Bearer', 'Second-Try Prince', 'Calm Captain']
  },
  nature: {
    mastered: [
      'Ibn Sina opens the garden lens. Discovery spark earned!',
      'The Garden Laboratory blooms. Great noticing!',
      'Ibn Sina smiles. The prince looked closely!',
      'A leaf unfurls. The prince found a true thing!'
    ],
    developing: [
      'Ibn Sina brings it closer. Name one thing you see.',
      'The garden is ready. Color, shape, or size.',
      'Try one noticing word.'
    ],
    events: ['A leaf unfurls!', 'The garden lens clears!', 'A water channel opens!', 'The seed cabinet unlocks!'],
    tryEvents: ['A seed wiggles in the soil.', 'The lens clears a little.', 'A small leaf waits.'],
    relics: ['Garden Lens', 'Leaf Mark', 'Water Drop', 'Seed Key'],
    sparks: ['observe', 'color', 'shape', 'care'],
    insights: ['Discovery power gained.', 'The garden accepts the observation.', 'The prince looked like a scholar.'],
    next: ['Collect the Garden Lens.', 'Point to the part he noticed.', 'Find one more color in the room.', 'Water an imaginary seed for a bonus bloom.'],
    scaffold: ['Offer: green or round?', 'Point to one leaf edge.', 'Let him touch an object and name it.'],
    titles: ['Little Observer', 'Garden Scholar', 'Keeper of the Leaf']
  }
};

function localEvaluate(trial, answer) {
  const pools = rewardFeedbackPools[activeTutor.domain] || rewardFeedbackPools.virtue;
  const words = answer.split(/\s+/).filter(Boolean).length;
  const lowerAnswer = answer.toLowerCase();
  const toolHits = (trial.artifacts || []).filter((artifact) =>
    lowerAnswer.includes(String(artifact).toLowerCase().split(' ')[0])
  ).length;
  const hasAction = /\b(help|share|try|breathe|see|show|ask|say|give|red|blue|green|water|sorry|stand|slow)\b/i.test(answer);
  const hasReason = /\bbecause\b|\bso\b|\bto\b|\bfor\b/i.test(answer);
  const score = Math.max(28, Math.min(95, 35 + Math.min(words, 8) * 5 + toolHits * 10 + (hasAction ? 16 : 0) + (hasReason ? 10 : 0)));
  const mastered = score >= 60;
  const seed = `${activeTutor.id}|${trial.title}|${answer}|${tutorProfile().attempts}|${Date.now()}`;
  const mentorLine = mastered ? pick(pools.mastered, seed) : pick(pools.developing, seed);
  const event = pick(mastered ? pools.events : pools.tryEvents, `${seed}|event`);
  const relic = pick(pools.relics, `${seed}|relic`);
  const spark = pick(pools.sparks, `${seed}|spark`);
  const nextChallenge = mastered ? pick(pools.next, `${seed}|next`) : pick(pools.scaffold, `${seed}|scaffold`);

  return {
    score,
    mastered,
    mentorLine,
    insight: mastered ? pick(pools.insights, `${seed}|insight`) : 'Good trying. Make one small choice and tap submit again.',
    nextChallenge,
    parentCue: mastered ? 'Celebrate first. Then move on or play one tiny bonus.' : 'Offer two choices and let him point.',
    earnedTitle: mastered ? pick(pools.titles, `${seed}|title`) : 'Gate Seeker',
    event,
    relic,
    spark
  };
}

function pick(items, seed) {
  return items[Math.abs(hash(seed)) % items.length];
}

function hash(value) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = ((result << 5) - result + value.charCodeAt(index)) | 0;
  }
  return result;
}

const feedbackPools = {
  virtue: {
    mastered: [
      'Aurelius raises the hall banner. That was a kind prince move.',
      'The Great Hall heard him choose help before pride.',
      'Aurelius nods. Small kindness, real strength.',
      'The prince protected the little friend. That matters.'
    ],
    developing: [
      'Aurelius kneels beside the prince. Choose one kind move.',
      'The hall waits. Help, share, or kind words. Pick one.',
      'Almost. Make the prince do one helpful thing.'
    ],
    events: ['The Kindness Gate opens.', 'A gold banner drops in the Great Hall.', 'The council table lights up.', 'The service bell rings.'],
    tryEvents: ['The gate stays half-open.', 'The council waits quietly.', 'A small lantern turns on.'],
    relics: ['Kindness Seal', 'Helping Hand', 'Truth Coin', 'Gentle Crown'],
    sparks: ['service', 'mercy', 'fairness', 'truth'],
    insights: ['He named a real action, not a vague idea.', 'He chose care in a concrete situation.', 'He practiced the first law of nobility: help first.'],
    next: ['Now ask: “Who does that help?”', 'Let him act it out with two toys.', 'Ask for one more kind move, then stop.', 'Give him the relic and change rooms.'],
    scaffold: ['Offer: “help” or “walk away?”', 'Point to the help card and ask him to repeat it.', 'Act out the crying friend with a toy.'],
    titles: ['Keeper of Kindness', 'Little Shield of the Hall', 'Friend of the Realm']
  },
  logic: {
    mastered: [
      'Hypatia lights a star. He saw the rule.',
      'The Star Tower clicks into place. That pattern answer works.',
      'Hypatia smiles. The prince found what comes next.',
      'A little proof spark appears over the tower.'
    ],
    developing: [
      'Hypatia points to the stones. Say the colors slowly.',
      'The tower needs one more look. Red, blue, red, blue...',
      'Almost. Let him touch each step as he says it.'
    ],
    events: ['A constellation draws itself.', 'The Pattern Gate unlocks.', 'A star gear turns.', 'The counting stairs glow.'],
    tryEvents: ['One star blinks, waiting.', 'The gate hums softly.', 'The stones reset for another try.'],
    relics: ['Star Gear', 'Pattern Key', 'Counting Stone', 'Moon Compass'],
    sparks: ['pattern', 'next', 'counting', 'rule'],
    insights: ['He followed a rule across more than one step.', 'He used order, not guessing.', 'He saw the hidden repeat.'],
    next: ['Ask him to build the pattern with fingers.', 'Add one more color only if he is smiling.', 'Let him be the tutor and quiz you.', 'Move to a new room before it gets stale.'],
    scaffold: ['Say it together: red, blue, red, blue.', 'Cover the last stone and reveal it.', 'Use two toys instead of words.'],
    titles: ['Star Finder', 'Pattern Prince', 'Keeper of the Next Stone']
  },
  language: {
    mastered: [
      'Sappho rings the little bell. That sentence stood up.',
      'The Scriptorium catches his words and turns them gold.',
      'Sappho heard a clear prince voice.',
      'The word gate opens. He said something real.'
    ],
    developing: [
      'Sappho offers one word first. Let him say just that.',
      'The page is waiting for one brave word.',
      'Try a tiny sentence: “I can help.”'
    ],
    events: ['Ink turns gold on the page.', 'A story ribbon curls open.', 'The word bell rings.', 'A tiny book unlocks.'],
    tryEvents: ['The page waits with a dot of ink.', 'A small word lantern glows.', 'The quill pauses.'],
    relics: ['Golden Word', 'Story Ribbon', 'Clear Voice Bell', 'Brave Sentence'],
    sparks: ['word', 'voice', 'story', 'sentence'],
    insights: ['He turned a thought into words.', 'He used his voice to make meaning.', 'He practiced saying one clear idea.'],
    next: ['Ask him to say it in a silly royal voice.', 'Have him choose one word to keep.', 'Let him draw the sentence.', 'Stop while the word still feels fun.'],
    scaffold: ['Give him the first word and let him finish.', 'Offer two sentence buttons.', 'Ask him to repeat your sentence.'],
    titles: ['Keeper of Words', 'Little Bard', 'Sentence Knight']
  },
  discipline: {
    mastered: [
      'Leonidas taps the shield. That was a strong second try.',
      'The Training Yard goes still. He found his brave body.',
      'Leonidas approves. Calm first, action second.',
      'The prince did not quit. That is the lesson.'
    ],
    developing: [
      'Leonidas lowers the pace. One breath first.',
      'The yard waits. Breathe, stand, try one thing.',
      'Make it smaller. One breath is enough.'
    ],
    events: ['The shield wall rises.', 'The courage drum beats once.', 'The practice gate opens.', 'A bronze shield flashes.'],
    tryEvents: ['The shield is still warming.', 'The yard quiets down.', 'The drum waits for one breath.'],
    relics: ['Still Shield', 'Second-Try Drum', 'Calm Breath', 'Bronze Step'],
    sparks: ['courage', 'breath', 'patience', 'try again'],
    insights: ['He named a way back into the work.', 'He practiced calm before action.', 'He found a doable next step.'],
    next: ['Do the breath together once.', 'Let him show the strong stance.', 'Ask what he can try again today.', 'Change rooms after one good rep.'],
    scaffold: ['Model one breath for him.', 'Offer: “try again” or “throw it?”', 'Let him point to the breath card.'],
    titles: ['Shield Bearer', 'Second-Try Prince', 'Calm Captain']
  },
  nature: {
    mastered: [
      'Ibn Sina opens the garden lens. He noticed something real.',
      'The Garden Laboratory blooms. Observation succeeded.',
      'Ibn Sina smiles. Looking closely is science.',
      'The prince saw one true thing with his own eyes.'
    ],
    developing: [
      'Ibn Sina brings it closer. Name one thing you see.',
      'The garden waits. Color, shape, or size.',
      'Try one noticing word.'
    ],
    events: ['A leaf unfurls.', 'The garden lens clears.', 'A water channel opens.', 'The seed cabinet unlocks.'],
    tryEvents: ['A seed wiggles in the soil.', 'The lens fogs, then clears a little.', 'A small leaf waits.'],
    relics: ['Garden Lens', 'Leaf Mark', 'Water Drop', 'Seed Key'],
    sparks: ['observe', 'color', 'shape', 'care'],
    insights: ['He used his senses instead of guessing.', 'He named an observable detail.', 'He practiced the beginning of science.'],
    next: ['Ask him to point to the part he noticed.', 'Find one more color in the room.', 'Let him water an imaginary seed.', 'Move rooms after one good observation.'],
    scaffold: ['Offer: “green” or “round?”', 'Point to one leaf edge.', 'Let him touch an object and name it.'],
    titles: ['Little Observer', 'Garden Scholar', 'Keeper of the Leaf']
  }
};

function setSpeaking(isSpeaking) {
  app.classList.toggle('is-speaking', isSpeaking);
}

function setVoiceStatus(message, failed = false) {
  if (failed) {
    console.warn(message);
  }
}

function stopVoicePlayback() {
  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio = undefined;
  }

  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = '';
  }
}

async function speak(text) {
  stopVoicePlayback();
  setSpeaking(true);

  try {
    const response = await fetch('/api/voice', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, tutorId: activeTutor.id })
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({ error: 'Voice request failed' }));
      throw new Error(detail.error || 'Voice request failed');
    }

    await playElevenLabsAudio(await response.blob());
  } catch (error) {
    setSpeaking(false);
    setVoiceStatus(`${error.message}. ElevenLabs needs a usable API key or voice access.`, true);
  }
}

async function playElevenLabsAudio(blob) {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  activeAudioUrl = url;
  voiceAudio = audio;

  const finish = () => {
    if (voiceAudio === audio) {
      setSpeaking(false);
      voiceAudio = undefined;
    }

    URL.revokeObjectURL(url);

    if (activeAudioUrl === url) {
      activeAudioUrl = '';
    }
  };

  audio.addEventListener('ended', finish, { once: true });
  audio.addEventListener('error', finish, { once: true });

  await audio.play();
}

function ensureThemeAudio() {
  if (!themeAudio) {
    themeAudio = new Audio('/audio/princes-vow.wav');
    themeAudio.loop = true;
    themeAudio.volume = 0.42;
  }
  return themeAudio;
}

async function checkApiStatus() {
  try {
    const response = await fetch('/api/status');
    await response.json();
  } catch {
    // Keep diagnostics out of the royal interface.
  }
}

musicButton.addEventListener('click', async () => {
  const audio = ensureThemeAudio();
  if (audio.paused) {
    await audio.play();
    musicButton.classList.add('active');
    musicButton.textContent = 'Pause Theme';
  } else {
    audio.pause();
    musicButton.classList.remove('active');
    musicButton.textContent = 'Play Theme';
  }
});

document.querySelector('#newTrial').addEventListener('click', () => continueRoyalPath());
continueButton.addEventListener('click', () => continueRoyalPath());
document.querySelector('#speakLesson').addEventListener('click', () => {
  if (!activeTrial) {
    return;
  }
  speak(`${activeTrial.scene} ${activeTrial.objective} ${activeTrial.prompt}`);
});
document.querySelector('#speakResult').addEventListener('click', () => speak(lastResultText));
document.querySelector('#submitAnswer').addEventListener('click', submitTrial);

activeTutor = tutorById(currentPathStep().tutorId) || activeTutor;
renderFormationBoard();
renderTrial();
checkApiStatus();
loadAdaptiveTrial();
