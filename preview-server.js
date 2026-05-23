import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, join, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4307);
const logPath = join(root, '.preview-server.log');
const aiCachePath = join(root, '.ai-response-cache.json');
const publicRoot = join(root, 'public');
const maxJsonBytes = Number(process.env.PREVIEW_MAX_JSON_BYTES || 160_000);
loadLocalEnv();
const voiceIdCache = new Map();
const aiCache = loadAiCache();
const aiCostStats = {
  hits: 0,
  misses: 0,
  writes: 0,
  networkCalls: 0,
  skipped: 0
};
const cheapModel = process.env.OPENAI_CHEAP_MODEL || 'gpt-4o-mini';
const premiumMode = process.env.OPENAI_COST_MODE === 'premium';
const curriculumTutorOrder = [
  { id: 'aurelius', roomName: 'Great Hall', domain: 'virtue' },
  { id: 'hypatia', roomName: 'Star Tower', domain: 'logic' },
  { id: 'sappho', roomName: 'Scriptorium', domain: 'language' },
  { id: 'leonidas', roomName: 'Training Yard', domain: 'discipline' },
  { id: 'ibn-sina', roomName: 'Garden Laboratory', domain: 'nature' }
];

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const staticRouteMap = new Map([
  ['/', 'preview.html'],
  ['/preview.html', 'preview.html'],
  ['/preview.css', 'preview.css'],
  ['/preview.js', 'preview.js']
]);

function resolveStaticPath(pathname) {
  const staticFile = staticRouteMap.get(pathname);
  if (staticFile) {
    return join(root, staticFile);
  }

  const allowedPublicPrefixes = ['/tutors/', '/castle/', '/audio/'];
  if (!allowedPublicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.some((segment) => segment === '.' || segment === '..' || segment.startsWith('.') || segment.includes('\\'))) {
    return null;
  }

  const resolved = normalize(join(publicRoot, ...segments));
  return isPathInside(publicRoot, resolved) ? resolved : null;
}

function isPathInside(base, target) {
  const path = relative(base, target);
  return path === '' || Boolean(path && !path.startsWith('..') && !isAbsolute(path));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

    if (url.pathname === '/api/voice' && request.method === 'POST') {
      await handleVoice(request, response);
      return;
    }

    if (url.pathname === '/api/status' && request.method === 'GET') {
      await handleStatus(response);
      return;
    }

    if (url.pathname === '/api/mentor' && request.method === 'POST') {
      await handleMentor(request, response);
      return;
    }

    if (url.pathname === '/api/adaptive-trial' && request.method === 'POST') {
      await handleAdaptiveTrial(request, response);
      return;
    }

    if (url.pathname === '/api/adaptive-evaluate' && request.method === 'POST') {
      await handleAdaptiveEvaluate(request, response);
      return;
    }

    if (url.pathname === '/api/curriculum-tier' && request.method === 'POST') {
      await handleCurriculumTier(request, response);
      return;
    }

    const resolved = resolveStaticPath(url.pathname);

    if (!resolved) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    const body = await readFile(resolved);
    response.writeHead(200, {
      'content-type': contentTypes[extname(resolved)] || 'application/octet-stream',
      'cache-control': 'no-store'
    });
    response.end(body);
  } catch (error) {
    const status = Number(error.statusCode || error.status || 404);
    response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(status === 404 ? 'Not found' : error.message || 'Request failed');
  }
});

async function handleVoice(request, response) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const body = await readJson(request);
  const text = String(body.text || '').trim();
  const tutorId = String(body.tutorId || '').toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  const maxVoiceChars = Number(process.env.ELEVENLABS_MAX_CHARS || 900);

  if (!text) {
    sendJson(response, 400, { error: 'text is required' });
    return;
  }

  if (text.length > maxVoiceChars) {
    sendJson(response, 413, { error: `text must be ${maxVoiceChars} characters or fewer` });
    return;
  }

  if (!apiKey) {
    sendJson(response, 412, { error: 'ElevenLabs API key is not configured' });
    return;
  }

  const voiceId = await resolveVoiceId(apiKey, tutorId);

  if (!voiceId) {
    sendJson(response, 412, { error: 'No ElevenLabs voices are available for this account' });
    return;
  }

  const eleven = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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
  });

  if (!eleven.ok) {
    sendJson(response, eleven.status, { error: 'ElevenLabs request failed' });
    return;
  }

  response.writeHead(200, {
    'content-type': 'audio/mpeg',
    'cache-control': 'private, max-age=300'
  });
  response.end(Buffer.from(await eleven.arrayBuffer()));
}

async function handleStatus(response) {
  const voiceKeys = ['AURELIUS', 'HYPATIA', 'SAPPHO', 'LEONIDAS', 'IBN_SINA'];
  sendJson(response, 200, {
    openAI: Boolean(process.env.OPENAI_API_KEY),
    openAIModel: premiumMode ? process.env.OPENAI_MODEL || 'gpt-5.5-pro' : cheapModel,
    openAICostMode: premiumMode ? 'premium' : 'saver',
    openAICache: {
      entries: Object.keys(aiCache.entries || {}).length,
      ...aiCostStats
    },
    elevenLabs: Boolean(process.env.ELEVENLABS_API_KEY),
    defaultVoice: Boolean(process.env.ELEVENLABS_DEFAULT_VOICE_ID),
    tutorVoices: Object.fromEntries(
      voiceKeys.map((key) => [key.toLowerCase(), Boolean(process.env[`ELEVENLABS_${key}_VOICE_ID`])])
    )
  });
}

async function handleMentor(request, response) {
  const body = await readJson(request);
  const fallback = evaluateLocally(body);

  if (!process.env.OPENAI_API_KEY || !premiumMode) {
    aiCostStats.skipped += 1;
    sendJson(response, 200, fallback);
    return;
  }

  try {
    const parsed = await askOpenAI(body, fallback);
    sendJson(response, 200, parsed);
  } catch (error) {
    log(`adaptive trial failed: ${error.stack || error.message || error}`);
    sendJson(response, 200, fallback);
  }
}

async function handleAdaptiveTrial(request, response) {
  const body = await readJson(request);
  const fallback = createFallbackTrial(body);

  if (!process.env.OPENAI_API_KEY || !premiumMode) {
    aiCostStats.skipped += 1;
    sendJson(response, 200, fallback);
    return;
  }

  try {
    const trial = await askOpenAIJson({
      instructions: [
        'You are the chief pedagogue and game master for Prince Academy.',
        'Design one adaptive, four-year-old appropriate educational trial that feels like a noble castle quest.',
        'A four-year-old needs concrete context before being asked to answer. Give a tiny story, a direct child question, and simple answer starters.',
        'Honor the supplied curriculumStage exactly. Its focus is the spine of this lesson; do not jump ahead or invent a disconnected topic.',
        'Connect the lesson to the supplied tierPlan so the prince feels one continuous royal education.',
        'The trial must be open-ended, physical or imaginative when possible, and never a multiple-choice quiz.',
        'Adapt difficulty from the supplied mastery profile, but do not demand adult phrasing. High difficulty means a slightly richer action or reason, not an essay.',
        'Keep it short enough for a child but rich enough to invite parent-child dialogue.',
        'Return only JSON with keys: title, rankName, mode, scene, story, childPrompt, objective, prompt, ritual, coachSteps, artifacts, answerStarters, successCriteria, hint, parentCue, difficulty, xpTarget.',
        'story must be 1 to 2 concrete child-facing sentences. childPrompt must be one short question.',
        'coachSteps must be an array of 3 parent actions. answerStarters must be an array of 3 to 5 short phrases a four-year-old can say.',
        'artifacts must be an array of 3 to 5 short tool-card strings. successCriteria must be an array of 3 short rubric strings.'
      ].join(' '),
      input: {
        tutor: body.tutor,
        profile: body.profile,
        royalPath: body.royalPath,
        tierPlan: body.tierPlan,
        curriculumStage: body.curriculumStage,
        recentTrials: body.recentTrials || [],
        fallback
      },
      fallback
    });

    sendJson(response, 200, normalizeTrial(trial, fallback));
  } catch (error) {
    log(`adaptive trial failed: ${error.stack || error.message || error}`);
    sendJson(response, 200, fallback);
  }
}

async function handleAdaptiveEvaluate(request, response) {
  const body = await readJson(request);
  const fallback = evaluateAdaptiveLocally(body);

  if (!process.env.OPENAI_API_KEY || !premiumMode) {
    aiCostStats.skipped += 1;
    sendJson(response, 200, fallback);
    return;
  }

  try {
    const evaluation = await askOpenAIJson({
      instructions: [
        'You are the chief pedagogue for Prince Academy evaluating a four-year-old child.',
        'Evaluate the answer with warmth and high standards. Look for reasoning, recall, courage, observation, clarity, and transfer.',
        'Do not require adult spelling, polished grammar, long explanations, or a written because-statement. Reward short spoken child reasoning and pointing/acting when represented in the parent transcript.',
        'Evaluate against the supplied curriculumStage and the concepts already built in the tierPlan, so progression feels coherent.',
        'For a mastered answer, lead with a celebration or reward. Never frame success by saying what the child did not do.',
        'Give an adaptive next step: if the score is high, make it a joyful bonus move; if low, give a concrete scaffold.',
        'Return only JSON with keys: score, mastered, mentorLine, insight, nextChallenge, parentCue, earnedTitle, event, relic, spark.',
        'Make the response feel like game feedback: a castle event, a relic earned, and a next move. Avoid generic praise.',
        'Do not use these words or phrases in mastered feedback: wrong, failed, not a guess, harder, needs, evidence, explanation, however, but.',
        'score must be an integer from 0 to 100. mastered must be true only when the answer shows real understanding.'
      ].join(' '),
      input: {
        tutor: body.tutor,
        trial: body.trial,
        answer: body.answer,
        profile: body.profile,
        royalPath: body.royalPath,
        tierPlan: body.tierPlan,
        curriculumStage: body.curriculumStage,
        fallback
      },
      fallback
    });

    sendJson(response, 200, normalizeEvaluation(evaluation, fallback));
  } catch (error) {
    log(`adaptive evaluation failed: ${error.stack || error.message || error}`);
    sendJson(response, 200, fallback);
  }
}

async function handleCurriculumTier(request, response) {
  const body = await readJson(request);
  const tier = Math.max(1, Math.round(Number(body.tier || body.currentPath?.tier || 1)));
  const fallback = createFallbackCurriculumTier(tier, body.previousTier);
  log(`curriculum builder requested tier=${tier} openai=${Boolean(process.env.OPENAI_API_KEY)}`);

  if (!process.env.OPENAI_API_KEY) {
    sendJson(response, 200, fallback);
    return;
  }

  try {
    const generated = await askOpenAIJson({
      instructions: [
        'Build one coherent next tier for Prince Academy.',
        'Connect to previousTier, deepen toward kingship, no multiple choice.',
        'Use tutor order: aurelius, hypatia, sappho, leonidas, ibn-sina.',
        'Return JSON: tier,name,rank,focus,builtFrom,steps.',
        'Each step: tutorId,mode,seal,focus,story,childPrompt,prompt,artifacts,answerStarters,successCriteria.',
        'Keep story and prompts short, concrete, parent-playable, and age-appropriate.'
      ].join(' '),
      input: {
        requestedTier: tier,
        previousTier: body.previousTier,
        currentPath: body.currentPath,
        tutors: curriculumTutorOrder,
        fallback
      },
      fallback,
      deadlineMs: 65000
    });

    sendJson(response, 200, normalizeCurriculumTier(generated, fallback));
  } catch (error) {
    log(`curriculum builder failed: ${error.stack || error.message || error}`);
    sendJson(response, 200, fallback);
  }
}

async function askOpenAIJson({ instructions, input, fallback, deadlineMs = 28000 }) {
  const preferredModel = premiumMode ? process.env.OPENAI_MODEL || 'gpt-5.5-pro' : cheapModel;
  const models = premiumMode
    ? [...new Set([preferredModel, cheapModel, 'gpt-4.1-mini', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4o', 'gpt-5.5-pro', 'gpt-5.5'])]
    : [cheapModel];
  const reasoningEfforts = ['xhigh', 'high', undefined];
  const deadline = Date.now() + deadlineMs;

  for (const model of models) {
    const efforts = premiumMode && /^gpt-5|^o\d/i.test(model) ? reasoningEfforts : [undefined];
    for (const effort of efforts) {
      if (Date.now() > deadline) {
        return fallback;
      }

      const payload = {
        model,
        instructions,
        input: JSON.stringify(input)
      };

      if (effort) {
        payload.reasoning = { effort };
      }

      const key = aiCacheKey('json', model, instructions, input, effort || 'none');
      const cached = readCachedAi(key);
      if (cached) {
        return cached;
      }

      let openai;
      try {
        aiCostStats.networkCalls += 1;
        openai = await fetchWithTimeout('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify(payload)
        }, Math.max(4000, Math.min(14000, deadline - Date.now())));
      } catch (error) {
        log(`openai json fetch failed model=${model} effort=${effort || 'none'} error=${error.message || error}`);
        continue;
      }

      if (!openai.ok) {
        log(`openai json non-ok model=${model} effort=${effort || 'none'} status=${openai.status}`);
        continue;
      }

      const data = await openai.json();
      const text = data.output_text || extractOutputText(data);
      const parsed = parseJsonOutput(text, fallback);
      if (parsed !== fallback) {
        writeCachedAi(key, {
          kind: 'json',
          model,
          effort: effort || 'none',
          output: parsed,
          usage: data.usage
        });
      }
      return parsed;
    }
  }

  return fallback;
}

async function askOpenAI(body, fallback) {
  const preferredModel = premiumMode ? process.env.OPENAI_MODEL || 'gpt-5.5-pro' : cheapModel;
  const models = premiumMode
    ? [...new Set([preferredModel, cheapModel, 'gpt-4.1-mini', 'gpt-4o-mini'])]
    : [cheapModel];
  const deadline = Date.now() + 22000;

  for (const model of models) {
    if (Date.now() > deadline) {
      return fallback;
    }

    const input = {
      tutor: body.tutor?.name,
      tutorTone: body.tutor?.tone,
      room: body.tutor?.roomName,
      lessonTitle: body.lesson?.title,
      prompt: body.lesson?.prompt,
      expectedAnswer: body.lesson?.answer,
      childAnswer: body.answer,
      fallback
    };
    const instructions = [
      'Wise tutor for a four-year-old.',
      'Concise, warm feedback.',
      'Never shame. Return JSON: correct, mentorLine, stretch.'
    ].join(' ');
    const key = aiCacheKey('mentor', model, instructions, input, 'none');
    const cached = readCachedAi(key);
    if (cached) {
      return cached;
    }

    let openai;
    try {
      aiCostStats.networkCalls += 1;
      openai = await fetchWithTimeout('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model,
          instructions,
          input: JSON.stringify(input)
        })
      }, Math.max(4000, Math.min(10000, deadline - Date.now())));
    } catch (error) {
      log(`openai mentor fetch failed model=${model} error=${error.message || error}`);
      continue;
    }

    if (!openai.ok) {
      log(`openai mentor non-ok model=${model} status=${openai.status}`);
      continue;
    }

    const data = await openai.json();
    const text = data.output_text || extractOutputText(data);
    const parsed = parseJsonOutput(text, fallback);
    const result = {
      correct: Boolean(parsed.correct),
      mentorLine: String(parsed.mentorLine || fallback.mentorLine),
      expected: body.lesson?.answer,
      stretch: String(parsed.stretch || fallback.stretch)
    };
    writeCachedAi(key, {
      kind: 'mentor',
      model,
      output: result,
      usage: data.usage
    });
    return result;
  }

  return fallback;
}

async function resolveVoiceId(apiKey, tutorId) {
  const explicitVoiceId = process.env[`ELEVENLABS_${tutorId}_VOICE_ID`] || process.env.ELEVENLABS_DEFAULT_VOICE_ID;

  if (explicitVoiceId) {
    return explicitVoiceId;
  }

  if (voiceIdCache.has(tutorId)) {
    return voiceIdCache.get(tutorId);
  }

  const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': apiKey }
  });

  if (!voicesResponse.ok) {
    return '';
  }

  const data = await voicesResponse.json();
  const voices = Array.isArray(data.voices) ? data.voices.filter((voice) => voice.voice_id) : [];

  if (!voices.length) {
    return '';
  }

  const tutorOrder = ['AURELIUS', 'HYPATIA', 'SAPPHO', 'LEONIDAS', 'IBN_SINA'];
  const index = Math.max(0, tutorOrder.indexOf(tutorId));
  const voice = voices[index % voices.length];
  voiceIdCache.set(tutorId, voice.voice_id);
  return voice.voice_id;
}

function evaluateLocally(body) {
  const answer = String(body.answer || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
  const expected = String(body.lesson?.answer || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');
  const correct = Boolean(answer && expected && answer === expected);

  return {
    correct,
    mentorLine: correct
      ? String(body.lesson?.praise || 'Well done. You have claimed this seal.')
      : `A prince may miss once and still learn. The answer I was guarding is: ${body.lesson?.answer}.`,
    expected: body.lesson?.answer,
    stretch: String(body.lesson?.stretch || 'Try the challenge again with a calm mind.')
  };
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function createFallbackCurriculumTier(tier, previousTier = {}) {
  const rank = rankForTier(tier);
  const cycle = Math.floor((tier - 1) / 3);
  const ageBand = tier < 4 ? 'little prince' : tier < 8 ? 'growing prince' : tier < 12 ? 'crown prince' : 'young king';
  const virtues = ['care', 'service', 'fairness', 'truth', 'mercy', 'justice', 'stewardship', 'law', 'wisdom', 'civilization'];
  const virtue = virtues[(tier - 1) % virtues.length];
  const tierName = tier >= 12 ? `The Young King Builds Civilization ${cycle + 1}` : `Royal Ascent ${tier}: ${titleCase(virtue)}`;
  const builtFrom = previousTier?.name ? `Built from ${previousTier.name}` : `Built from Tier ${Math.max(1, tier - 1)}`;

  return {
    tier,
    name: tierName,
    rank,
    focus: `Deepen ${virtue}, order, speech, self-command, and observation from the earlier seals.`,
    builtFrom,
    source: 'local',
    steps: [
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
    ]
  };
}

function normalizeCurriculumTier(plan, fallback) {
  const tier = Math.max(1, Math.round(Number(plan?.tier || fallback.tier)));
  const steps = curriculumTutorOrder.map((tutor, index) => {
    const supplied = Array.isArray(plan?.steps)
      ? plan.steps.find((step) => step?.tutorId === tutor.id) || plan.steps[index] || {}
      : {};
    const base = fallback.steps[index];

    return {
      tutorId: tutor.id,
      mode: String(supplied.mode || base.mode),
      seal: String(supplied.seal || base.seal),
      focus: String(supplied.focus || base.focus),
      story: String(supplied.story || base.story),
      childPrompt: String(supplied.childPrompt || base.childPrompt),
      prompt: String(supplied.prompt || base.prompt),
      artifacts: normalizeStringArray(supplied.artifacts, base.artifacts, 5),
      answerStarters: normalizeStringArray(supplied.answerStarters, base.answerStarters, 5),
      successCriteria: normalizeStringArray(supplied.successCriteria, base.successCriteria, 3)
    };
  });

  return {
    tier,
    name: String(plan?.name || fallback.name),
    rank: String(plan?.rank || fallback.rank),
    focus: String(plan?.focus || fallback.focus),
    builtFrom: String(plan?.builtFrom || fallback.builtFrom),
    source: plan?.source === 'local' ? 'local' : 'ai',
    steps
  };
}

function parseJsonOutput(text, fallback) {
  const raw = String(text || '').trim();

  try {
    return JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```\s*([\s\S]*?)```/i);
    const candidate = jsonMatch ? jsonMatch[1] : raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);

    try {
      return JSON.parse(candidate);
    } catch {
      log(`openai json parse failed output=${raw.slice(0, 240).replace(/\s+/g, ' ')}`);
      return fallback;
    }
  }
}

function loadAiCache() {
  try {
    const parsed = JSON.parse(readFileSync(aiCachePath, 'utf8'));
    return {
      version: 1,
      entries: parsed.entries && typeof parsed.entries === 'object' ? parsed.entries : {}
    };
  } catch {
    return { version: 1, entries: {} };
  }
}

function saveAiCache() {
  try {
    const entries = Object.entries(aiCache.entries || {})
      .sort(([, a], [, b]) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
      .slice(0, 200);
    aiCache.entries = Object.fromEntries(entries);
    writeFileSync(aiCachePath, JSON.stringify({
      version: 1,
      updatedAt: new Date().toISOString(),
      entries: aiCache.entries
    }, null, 2), 'utf8');
  } catch (error) {
    log(`ai cache write failed: ${error.message || error}`);
  }
}

function aiCacheKey(kind, model, instructions, input, effort) {
  return createHash('sha256')
    .update(stableStringify({ kind, model, effort, instructions, input }))
    .digest('hex');
}

function readCachedAi(key) {
  const entry = aiCache.entries?.[key];
  if (!entry) {
    aiCostStats.misses += 1;
    return undefined;
  }

  entry.hits = Number(entry.hits || 0) + 1;
  entry.updatedAt = Date.now();
  aiCostStats.hits += 1;
  return entry.output;
}

function writeCachedAi(key, entry) {
  aiCache.entries[key] = {
    ...entry,
    createdAt: aiCache.entries[key]?.createdAt || Date.now(),
    updatedAt: Date.now(),
    hits: Number(aiCache.entries[key]?.hits || 0)
  };
  aiCostStats.writes += 1;
  saveAiCache();
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }

  return JSON.stringify(value);
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

function createFallbackTrial(body) {
  const tutor = body.tutor || {};
  const profile = body.profile || {};
  const tier = Math.max(1, Math.round(Number(profile.tier || 1)));
  const stage = body.curriculumStage || {};
  const domain = String(tutor.domain || 'wisdom');
  const modes = {
    virtue: ['Council Judgment', 'Service Quest', 'Choice Defense'],
    logic: ['Pattern Forge', 'Number Expedition', 'Proof Gate'],
    language: ['Story Smithing', 'Rhyme Court', 'Word Oath'],
    discipline: ['Courage Trial', 'Breath Command', 'Second-Try Arena'],
    nature: ['Observation Hunt', 'Garden Inquiry', 'Healer Study']
  };
  const artifacts = {
    virtue: ['help', 'kind voice', 'share', 'tell the truth'],
    logic: ['red', 'blue', 'again', 'next'],
    language: ['one word', 'one sentence', 'brave', 'clear voice'],
    discipline: ['breath', 'stand tall', 'try again', 'slow'],
    nature: ['color', 'shape', 'big or small', 'water']
  };
  const starters = {
    virtue: ['I can help.', 'I can share.', 'I can ask nicely.', 'I can say sorry.'],
    logic: ['Red comes next.', 'Blue comes next.', 'It goes again.', 'I can show it.'],
    language: ['I am brave.', 'I can help.', 'The prince tried.', 'I can say it.'],
    discipline: ['I can breathe.', 'I can try again.', 'I can go slow.', 'I can stand tall.'],
    nature: ['I see green.', 'It is small.', 'It has a shape.', 'It needs water.']
  };
  const modeList = modes[domain] || ['Wisdom Trial', 'Memory Gate', 'Royal Defense'];
  const toolCards = Array.isArray(stage.artifacts) && stage.artifacts.length
    ? stage.artifacts
    : artifacts[domain] || ['observe', 'explain', 'remember', 'choose'];
  const mode = stage.mode || modeList[(tier - 1) % modeList.length];

  return {
    id: `trial-${Date.now()}`,
    title: `${mode}: Tier ${tier}`,
    rankName: rankForTier(tier),
    mode,
    scene: `The ${tutor.roomName || 'castle chamber'} opens ${stage.seal || 'a royal seal'} for ${body.tierPlan?.name || `Tier ${tier}`}.`,
    story: stage.story || fallbackStory(domain),
    childPrompt: stage.childPrompt || fallbackChildPrompt(domain),
    objective: stage.focus ? `Learn this: ${stage.focus}` : 'Listen, point, say one idea, then try one tiny reason.',
    prompt: stage.prompt || fallbackPrompt(domain, tier),
    ritual: 'Parent move: read the story, ask the question, accept a short spoken answer.',
    coachSteps: ['1. Read it', '2. Let him point or act', '3. Write his words'],
    artifacts: toolCards,
    answerStarters: Array.isArray(stage.answerStarters) && stage.answerStarters.length ? stage.answerStarters : starters[domain] || ['I can help.', 'I can show it.', 'I can try.', 'I see it.'],
    successCriteria: Array.isArray(stage.successCriteria) && stage.successCriteria.length ? stage.successCriteria : ['one clear idea', 'uses a word card', 'tries a reason'],
    hint: 'Point to one card. Say one small sentence.',
    parentCue: 'Parent cue: If he freezes, offer two choices and let him point.',
    difficulty: tier,
    xpTarget: 60 + tier * 5
  };
}

function fallbackPrompt(domain, tier) {
  if (domain === 'logic') {
    return 'Say the next stone. If he can, ask him to make the pattern with toys.';
  }
  if (domain === 'language') {
    return 'Let him say one sentence about a brave or kind thing.';
  }
  if (domain === 'discipline') {
    return 'Take one breath together. Then say what the prince can try again.';
  }
  if (domain === 'nature') {
    return 'Look at a plant, leaf, or picture. Say one thing you see.';
  }
  return 'Tell one kind thing the prince can do. A short answer is enough.';
}

function fallbackStory(domain) {
  if (domain === 'logic') {
    return 'The Star Tower has stepping stones: red, blue, red, blue. One stone is missing.';
  }
  if (domain === 'language') {
    return 'In the Scriptorium, a tiny word is hiding inside a story.';
  }
  if (domain === 'discipline') {
    return 'In the Training Yard, the prince tries a jump and misses. The tutor smiles and waits.';
  }
  if (domain === 'nature') {
    return 'In the Garden Laboratory, a little leaf has lines, color, and a shape.';
  }
  return 'A little friend is crying by the block tower. A toy was taken and the tower fell.';
}

function fallbackChildPrompt(domain) {
  if (domain === 'logic') {
    return 'What comes next?';
  }
  if (domain === 'language') {
    return 'Can the prince say one brave sentence?';
  }
  if (domain === 'discipline') {
    return 'What should he do next?';
  }
  if (domain === 'nature') {
    return 'What do you notice?';
  }
  return 'What can the prince do first?';
}

const rewardFeedbackPools = {
  virtue: {
    mastered: ['Aurelius smiles wide. The Great Hall cheers for that kind choice!', 'A gold banner rises. The prince chose help!', 'The council celebrates. Kindness won the room!', 'Aurelius awards a bright nod for noble help!'],
    developing: ['Aurelius gives a warm hint. Pick one helpful move.', 'The hall is ready. Choose help, share, or kind words.', 'Almost there. Tap one kind answer and try again.'],
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
    mastered: ['Hypatia lights a star. Correct path found!', 'The Star Tower clicks into place. The pattern gate opens!', 'Hypatia smiles. The prince found the next stone!', 'A star gear spins above the tower. Pattern power unlocked!'],
    developing: ['Hypatia points to the stones. Touch each color slowly.', 'The tower is ready. Say red, blue, red, blue.', 'Almost there. Let him tap the stones as he says them.'],
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
    mastered: ['Sappho rings the golden bell. That sentence shines!', 'The Scriptorium catches his words and turns them gold!', 'Sappho heard a clear prince voice!', 'The word gate opens. A brave sentence enters the book!'],
    developing: ['Sappho offers one word first. Let him say just that.', 'The page is ready for one brave word.', 'Try a tiny sentence: I can help.'],
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
    mastered: ['Leonidas taps the shield. Courage spark earned!', 'The Training Yard cheers. The prince found his brave body!', 'Leonidas raises the bronze shield. Calm power unlocked!', 'The courage drum booms once. Second-try strength gained!'],
    developing: ['Leonidas lowers the pace. One breath first.', 'The yard is ready. Breathe, stand, try one thing.', 'Make it tiny. One breath is enough.'],
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
    mastered: ['Ibn Sina opens the garden lens. Discovery spark earned!', 'The Garden Laboratory blooms. Great noticing!', 'Ibn Sina smiles. The prince looked closely!', 'A leaf unfurls. The prince found a true thing!'],
    developing: ['Ibn Sina brings it closer. Name one thing you see.', 'The garden is ready. Color, shape, or size.', 'Try one noticing word.'],
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

function evaluateAdaptiveLocally(body) {
  const answer = String(body.answer || '').trim();
  const domain = String(body.tutor?.domain || 'virtue');
  const pools = rewardFeedbackPools[domain] || rewardFeedbackPools.virtue;
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const artifactHits = (body.trial?.artifacts || []).filter((artifact) =>
    answer.toLowerCase().includes(String(artifact).toLowerCase().split(' ')[0])
  ).length;
  const hasAction = /\b(help|share|try|breathe|see|show|ask|say|give|red|blue|green|water|sorry)\b/i.test(answer);
  const hasReason = /\bbecause\b|\bso\b|\bto\b|\bfor\b/i.test(answer);
  const score = Math.max(28, Math.min(95, 35 + Math.min(wordCount, 8) * 5 + artifactHits * 10 + (hasAction ? 16 : 0) + (hasReason ? 10 : 0)));
  const mastered = score >= 60;
  const seed = `${domain}|${body.trial?.title || ''}|${answer}|${Date.now()}`;

  return {
    score,
    mastered,
    mentorLine: mastered ? pick(pools.mastered, seed) : pick(pools.developing, seed),
    insight: mastered ? pick(pools.insights, `${seed}|insight`) : 'Good trying. Make one small choice and tap submit again.',
    nextChallenge: mastered ? pick(pools.next, `${seed}|next`) : pick(pools.scaffold, `${seed}|scaffold`),
    parentCue: mastered ? 'Celebrate first. Then move on or play one tiny bonus.' : 'Offer two choices and let him point.',
    earnedTitle: mastered ? pick(pools.titles, `${seed}|title`) : 'Gate Seeker',
    event: pick(mastered ? pools.events : pools.tryEvents, `${seed}|event`),
    relic: pick(pools.relics, `${seed}|relic`),
    spark: pick(pools.sparks, `${seed}|spark`)
  };
}

function normalizeTrial(trial, fallback) {
  return {
    id: String(trial.id || fallback.id),
    title: String(trial.title || fallback.title),
    rankName: String(trial.rankName || fallback.rankName),
    mode: String(trial.mode || fallback.mode),
    scene: String(trial.scene || fallback.scene),
    story: String(trial.story || fallback.story),
    childPrompt: String(trial.childPrompt || fallback.childPrompt),
    objective: String(trial.objective || fallback.objective),
    prompt: String(trial.prompt || fallback.prompt),
    ritual: String(trial.ritual || fallback.ritual),
    coachSteps: normalizeStringArray(trial.coachSteps, fallback.coachSteps, 3),
    artifacts: normalizeStringArray(trial.artifacts, fallback.artifacts, 5),
    answerStarters: normalizeStringArray(trial.answerStarters, fallback.answerStarters, 5),
    successCriteria: normalizeStringArray(trial.successCriteria, fallback.successCriteria, 3),
    hint: String(trial.hint || fallback.hint),
    parentCue: String(trial.parentCue || fallback.parentCue),
    difficulty: Math.max(1, Math.round(Number(trial.difficulty || fallback.difficulty || 1))),
    xpTarget: Math.max(30, Math.round(Number(trial.xpTarget || fallback.xpTarget || 70)))
  };
}

function normalizeEvaluation(evaluation, fallback) {
  const score = Math.max(0, Math.min(100, Number(evaluation.score ?? fallback.score)));
  const mastered = Boolean(evaluation.mastered ?? score >= 60);
  return {
    score,
    mastered,
    mentorLine: rewardSafeText(evaluation.mentorLine, fallback.mentorLine),
    insight: rewardSafeText(evaluation.insight, fallback.insight),
    nextChallenge: rewardSafeText(evaluation.nextChallenge, fallback.nextChallenge),
    parentCue: String(evaluation.parentCue || fallback.parentCue),
    earnedTitle: String(evaluation.earnedTitle || fallback.earnedTitle),
    event: String(evaluation.event || fallback.event || ''),
    relic: String(evaluation.relic || fallback.relic || ''),
    spark: String(evaluation.spark || fallback.spark || '')
  };
}

function rewardSafeText(value, fallback) {
  const text = String(value || '').trim();
  if (!text || /\b(not a guess|wrong|failed|harder|needs|evidence|explanation|however|but)\b/i.test(text)) {
    return String(fallback || '');
  }
  return text;
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
    mastered: ['Aurelius raises the hall banner. That was a kind prince move.', 'The Great Hall heard him choose help before pride.', 'Aurelius nods. Small kindness, real strength.', 'The prince protected the little friend. That matters.'],
    developing: ['Aurelius kneels beside the prince. Choose one kind move.', 'The hall waits. Help, share, or kind words. Pick one.', 'Almost. Make the prince do one helpful thing.'],
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
    mastered: ['Hypatia lights a star. He saw the rule.', 'The Star Tower clicks into place. That pattern answer works.', 'Hypatia smiles. The prince found what comes next.', 'A little proof spark appears over the tower.'],
    developing: ['Hypatia points to the stones. Say the colors slowly.', 'The tower needs one more look. Red, blue, red, blue...', 'Almost. Let him touch each step as he says it.'],
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
    mastered: ['Sappho rings the little bell. That sentence stood up.', 'The Scriptorium catches his words and turns them gold.', 'Sappho heard a clear prince voice.', 'The word gate opens. He said something real.'],
    developing: ['Sappho offers one word first. Let him say just that.', 'The page is waiting for one brave word.', 'Try a tiny sentence: “I can help.”'],
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
    mastered: ['Leonidas taps the shield. That was a strong second try.', 'The Training Yard goes still. He found his brave body.', 'Leonidas approves. Calm first, action second.', 'The prince did not quit. That is the lesson.'],
    developing: ['Leonidas lowers the pace. One breath first.', 'The yard waits. Breathe, stand, try one thing.', 'Make it smaller. One breath is enough.'],
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
    mastered: ['Ibn Sina opens the garden lens. He noticed something real.', 'The Garden Laboratory blooms. Observation succeeded.', 'Ibn Sina smiles. Looking closely is science.', 'The prince saw one true thing with his own eyes.'],
    developing: ['Ibn Sina brings it closer. Name one thing you see.', 'The garden waits. Color, shape, or size.', 'Try one noticing word.'],
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

function normalizeStringArray(value, fallback, maxLength) {
  const source = Array.isArray(value) && value.length ? value : fallback;
  return source.slice(0, maxLength).map((item) => String(item));
}

function extractOutputText(data) {
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.text) {
        chunks.push(content.text);
      }
    }
  }
  return chunks.join('\n');
}

async function readJson(request) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of request) {
    totalBytes += Buffer.byteLength(chunk);
    if (totalBytes > maxJsonBytes) {
      throw httpError(413, `Request body must be ${maxJsonBytes} bytes or fewer`);
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    throw httpError(400, 'Invalid JSON');
  }
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  response.end(JSON.stringify(payload));
}

process.on('uncaughtException', (error) => {
  log(`uncaught: ${error.stack || error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  log(`unhandled: ${error}`);
  process.exit(1);
});

server.on('error', (error) => {
  log(`server error: ${error.stack || error.message}`);
});

const host = process.env.ALLOW_LAN === 'true' ? '0.0.0.0' : '127.0.0.1';
server.listen(port, host, () => {
  const displayHost = host === '0.0.0.0' ? '127.0.0.1' : host;
  log(`Prince Academy preview running at http://${displayHost}:${port}`);
});

function log(message) {
  appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`, 'utf8');
}

function loadLocalEnv() {
  for (const file of ['.env.local', '.env']) {
    const path = join(root, file);
    if (!existsSync(path)) {
      continue;
    }

    for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!match || process.env[match[1]]) {
        continue;
      }
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}
