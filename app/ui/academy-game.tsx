'use client';

import {
  ArrowRight,
  Castle,
  Check,
  Crown,
  Gem,
  Lock,
  Music,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  Volume2
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  buildTrial,
  chamberById,
  chamberIndex,
  chambers,
  civilizationPods,
  dailyRegimen,
  doctrine,
  formationRings,
  nextChamberId,
  platformZones,
  readinessStandards,
  tierTitle,
  type ChamberId,
  type Trial
} from '@/lib/academy';
import { judgeTrialAnswer, type TutorReward } from '@/lib/tutor-judgment';

type Progress = {
  tier: number;
  step: number;
  xp: number;
  completed: string[];
  relics: string[];
  virtues: Record<string, number>;
  log: string[];
};

type Reward = TutorReward;

const storageKey = 'prince-academy.next.progress.v2';

const defaultProgress: Progress = {
  tier: 1,
  step: 0,
  xp: 0,
  completed: [],
  relics: [],
  virtues: {},
  log: ['Entered the citadel']
};

export function AcademyGame() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [activeId, setActiveId] = useState<ChamberId>('great-hall');
  const [answer, setAnswer] = useState('');
  const [chosen, setChosen] = useState<string[]>([]);
  const [reward, setReward] = useState<Reward | null>(null);
  const [judging, setJudging] = useState(false);
  const [hint, setHint] = useState(doctrine.question);
  const [musicOn, setMusicOn] = useState(false);
  const [voiceState, setVoiceState] = useState<'idle' | 'loading' | 'speaking' | 'quiet'>('idle');
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);

  const activeChamber = chamberById(activeId);
  const activeIndex = chamberIndex(activeId);
  const trial = useMemo(() => buildTrial(activeId, progress.tier), [activeId, progress.tier]);
  const currentKey = `${activeId}:${progress.tier}`;
  const locked = activeIndex > progress.step;
  const completed = progress.completed.includes(currentKey);
  const sealsThisTier = progress.completed.filter((key) => key.endsWith(`:${progress.tier}`)).length;
  const rank = rankFor(progress.tier, progress.xp);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setProgress({ ...defaultProgress, ...JSON.parse(saved) });
      }
    } catch {
      setProgress(defaultProgress);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  function chooseChamber(id: ChamberId) {
    const index = chamberIndex(id);
    if (index > progress.step) {
      setHint('That gate opens after the prince earns the current seal.');
      return;
    }

    setActiveId(id);
    setChosen([]);
    setAnswer('');
    setReward(null);
    setHint(chamberById(id).motto);
  }

  function toggleArtifact(item: string) {
    setChosen((items) => items.includes(item) ? items.filter((entry) => entry !== item) : [...items, item]);
  }

  function useStarter(starter: string) {
    setAnswer((value) => value ? `${value} ${starter}` : starter);
  }

  async function submitTrial() {
    if (judging) {
      return;
    }

    const localEvaluation = evaluateTrial(trial, answer, chosen);
    setReward(localEvaluation);
    setHint(localEvaluation.line);

    if (!localEvaluation.mastered) {
      return;
    }

    setJudging(true);
    const mentorEvaluation = await refineWithMentor(trial, answer, chosen, localEvaluation);
    setJudging(false);

    const evaluation = mentorEvaluation ?? localEvaluation;
    setReward(evaluation);
    setHint(evaluation.line);

    if (!evaluation.mastered) {
      return;
    }

    setProgress((current) => {
      const nextCompleted = current.completed.includes(currentKey)
        ? current.completed
        : [...current.completed, currentKey];
      const virtueScore = Math.min(100, (current.virtues[trial.virtue] ?? 0) + 16);
      return {
        ...current,
        xp: current.xp + evaluation.score,
        completed: nextCompleted,
        relics: current.relics.includes(evaluation.relic) ? current.relics : [...current.relics, evaluation.relic],
        virtues: { ...current.virtues, [trial.virtue]: virtueScore },
        log: [`${activeChamber.chamber}: ${evaluation.relic}`, ...current.log].slice(0, 6)
      };
    });

    void saveProgressEvent(evaluation);
  }

  function continuePath() {
    const finishedTier = progress.step >= chambers.length - 1;
    const nextId = finishedTier ? 'great-hall' : nextChamberId(activeId);
    setReward(null);
    setAnswer('');
    setChosen([]);
    setActiveId(nextId);
    setProgress((current) => {
      if (current.step >= chambers.length - 1) {
        return {
          ...current,
          tier: current.tier + 1,
          step: 0,
          log: [`Tier ${current.tier + 1}: ${tierTitle(current.tier + 1)}`, ...current.log].slice(0, 6)
        };
      }

      return { ...current, step: Math.max(current.step, current.step + 1) };
    });
  }

  function resetPath() {
    setProgress(defaultProgress);
    setActiveId('great-hall');
    setReward(null);
    setAnswer('');
    setChosen([]);
    setHint(doctrine.question);
  }

  async function refineWithMentor(baseTrial: Trial, rawAnswer: string, artifacts: string[], baseReward: Reward) {
    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          trial: baseTrial,
          answer: rawAnswer,
          artifacts,
          reward: baseReward,
          tier: progress.tier
        })
      });
      if (!response.ok) {
        return null;
      }
      const refined = await response.json() as Reward;
      return refined?.line ? refined : null;
    } catch {
      return null;
    }
  }

  async function saveProgressEvent(baseReward: Reward) {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chamberId: activeId,
          tier: progress.tier,
          score: baseReward.score,
          relic: baseReward.relic,
          answer: answer.slice(0, 500)
        })
      });
    } catch {
      // The prince can still play from local progress.
    }
  }

  async function hearTutor() {
    if (voiceState === 'loading' || voiceState === 'speaking') {
      voiceRef.current?.pause();
      voiceRef.current = null;
      setVoiceState('idle');
      return;
    }

    setVoiceState('loading');
    voiceRef.current?.pause();
    try {
      const params = new URLSearchParams({
        tutorId: activeChamber.tutorId,
        text: `${activeChamber.tutor}. ${trial.story} ${trial.prompt}`
      });
      const audio = new Audio(`/api/tutor-audio?${params.toString()}`);
      audio.preload = 'auto';
      voiceRef.current = audio;
      audio.onplaying = () => setVoiceState('speaking');
      audio.onended = () => {
        setVoiceState('idle');
      };
      audio.onerror = () => {
        console.warn('Tutor voice could not be played. Check the voice route and production ElevenLabs key.');
        setVoiceState('quiet');
      };
      await audio.play();
    } catch {
      setVoiceState('quiet');
    }
  }

  function toggleMusic() {
    musicRef.current ??= new Audio('/audio/princes-vow.wav');
    musicRef.current.loop = true;
    musicRef.current.volume = 0.38;

    if (musicRef.current.paused) {
      void musicRef.current.play();
      setMusicOn(true);
    } else {
      musicRef.current.pause();
      setMusicOn(false);
    }
  }

  const themeStyle = {
    '--accent': activeChamber.accent,
    '--tone': activeChamber.color
  } as CSSProperties & Record<'--accent' | '--tone', string>;

  return (
    <main className="academy" style={themeStyle}>
      <div className="world-backdrop" style={{ backgroundImage: `url(${activeChamber.roomImage})` }} />
      <header className="citadel">
        <div className="brand-mark"><Crown size={34} /></div>
        <div className="hero-copy">
          <p className="eyebrow">Prince Academy</p>
          <h1>The Prince&apos;s Citadel</h1>
          <p>{doctrine.thesis}</p>
        </div>
        <section className="rank-panel" aria-label="Prince rank">
          <span>Rank</span>
          <strong>{rank}</strong>
          <div className="meter"><i style={{ width: `${Math.min(100, sealsThisTier * 20)}%` }} /></div>
          <small>{sealsThisTier}/5 seals - Tier {progress.tier}: {tierTitle(progress.tier)}</small>
          <div className="control-row">
            <button type="button" onClick={toggleMusic}><Music size={18} /> {musicOn ? 'Pause Theme' : 'Play Theme'}</button>
            <button type="button" onClick={resetPath} className="icon-only" aria-label="Reset path"><RotateCcw size={18} /></button>
          </div>
        </section>
      </header>

      <section className="doctrine-strip">
        <ShieldCheck size={18} />
        <span>{doctrine.northStar}</span>
      </section>

      <div className="game-grid">
        <nav className="chamber-map" aria-label="Castle chambers">
          <div className="panel-heading">
            <span>Castle Map</span>
            <strong>Tier {progress.tier}</strong>
          </div>
          {chambers.map((chamber, index) => {
            const Icon = chamber.icon;
            const isLocked = index > progress.step;
            const isComplete = progress.completed.includes(`${chamber.id}:${progress.tier}`);
            return (
              <button
                type="button"
                key={chamber.id}
                className={`chamber-card ${activeId === chamber.id ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
                onClick={() => chooseChamber(chamber.id)}
                aria-disabled={isLocked}
              >
                <img src={chamber.image} alt={`${chamber.tutor} portrait`} />
                <span>
                  <strong>{chamber.chamber}</strong>
                  <small>{isLocked ? 'Locked gate' : isComplete ? 'Seal earned' : chamber.domain}</small>
                </span>
                {isLocked ? <Lock size={17} /> : isComplete ? <Check size={17} /> : <Icon size={17} />}
              </button>
            );
          })}
        </nav>

        <section className="trial-stage">
          <div className="mentor-band">
            <img src={activeChamber.image} alt={`${activeChamber.tutor} tutor`} />
            <div>
              <p className="eyebrow">{activeChamber.title}</p>
              <h2>{activeChamber.tutor} in the {activeChamber.chamber}</h2>
              <p>{activeChamber.motto}</p>
            </div>
            <button type="button" className="listen-button" onClick={hearTutor}>
              {voiceState === 'loading' || voiceState === 'speaking' ? <Pause size={18} /> : <Volume2 size={18} />}
              {voiceLabel(voiceState)}
            </button>
          </div>

          <article className="trial-card">
            <div className="trial-kicker">
              <span>{trial.mode}</span>
              <span>{activeChamber.duty}</span>
            </div>
            <h2>{trial.title}</h2>
            <p className="doctrine-line">{trial.doctrine}</p>
            <div className="story-box">
              <p>{trial.story}</p>
              <strong>{trial.prompt}</strong>
            </div>
            <div className="ritual"><Sparkles size={18} /> {trial.ritual}</div>

            <div className="artifact-grid" aria-label="Artifact choices">
              {trial.artifacts.map((artifact) => (
                <button
                  key={artifact}
                  type="button"
                  className={chosen.includes(artifact) ? 'selected' : ''}
                  onClick={() => toggleArtifact(artifact)}
                >
                  <Gem size={16} />
                  {artifact}
                </button>
              ))}
            </div>

            <div className="starter-row">
              {trial.starters.map((starter) => (
                <button key={starter} type="button" onClick={() => useStarter(starter)}>
                  {starter}
                </button>
              ))}
            </div>

            <label className="answer-box">
              <span>Prince&apos;s words or parent transcript</span>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Let him point, act, or say a small answer. Write his words here."
              />
            </label>

            <div className="success-grid">
              {trial.success.map((item) => <span key={item}>{item}</span>)}
            </div>

            <div className="action-row">
              <button type="button" className="primary" onClick={submitTrial} disabled={locked || judging}>
                <Trophy size={19} />
                {judging ? 'Tutor is Judging' : 'Submit to the Tutor'}
              </button>
              <p>{locked ? 'Earn the current seal to open this gate.' : trial.parentCue}</p>
            </div>
          </article>

          {reward ? (
            <aside className={`reward ${reward.mastered ? 'earned' : ''}`}>
              <div>
                <span>{reward.mastered ? `Reward earned - ${reward.title}` : 'Try together'}</span>
                <p>{reward.line}</p>
                <strong>{reward.event}</strong>
                <small>{reward.mastered ? `Relic: ${reward.relic}` : reward.next}</small>
              </div>
              {reward.mastered ? (
                <button type="button" onClick={continuePath}>
                  Continue Path <ArrowRight size={18} />
                </button>
              ) : null}
            </aside>
          ) : (
            <aside className="guide-note">
              <Sparkles size={18} />
              <span>{hint}</span>
            </aside>
          )}
        </section>

        <aside className="council">
          <section>
            <p className="eyebrow">Royal Path</p>
            <h2>Today&apos;s ascent</h2>
            <div className="seal-counter">
              <strong>{sealsThisTier}</strong>
              <span>of 5 seals</span>
            </div>
            <ol className="path-list">
              {chambers.map((chamber, index) => (
                <li key={chamber.id} className={index === progress.step ? 'current' : index < progress.step ? 'done' : ''}>
                  <span>{index + 1}</span>
                  <strong>{chamber.chamber}</strong>
                  <small>{chamber.duty}</small>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <p className="eyebrow">Readiness</p>
            <div className="rubric">
              {readinessStandards.slice(0, 6).map(([name, sign]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <span>{progress.virtues[name] ?? progress.virtues[trial.virtue] ?? 0}%</span>
                  <small>{sign}</small>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="platform-board">
        <div className="board-intro">
          <p className="eyebrow">North Star System</p>
          <h2>Build the ecosystem, not a quiz app.</h2>
          <p>The app now treats formation as tutors, ritual, care, hardship, memory, counsel, and public responsibility.</p>
        </div>
        <div className="rings">
          {formationRings.map((ring) => {
            const Icon = ring.icon;
            return (
              <article key={ring.name}>
                <Icon size={22} />
                <strong>{ring.name}</strong>
                <span>{ring.purpose}</span>
              </article>
            );
          })}
        </div>
        <div className="zone-grid">
          {platformZones.map((zone) => {
            const Icon = zone.icon;
            return (
              <article key={zone.title}>
                <Icon size={22} />
                <strong>{zone.title}</strong>
                <span>{zone.body}</span>
              </article>
            );
          })}
        </div>
        <div className="civilizations">
          {civilizationPods.map(([name, body]) => (
            <span key={name}><strong>{name}</strong>{body}</span>
          ))}
        </div>
        <div className="regimen">
          {dailyRegimen.map(([time, focus]) => (
            <span key={time}><strong>{time}</strong>{focus}</span>
          ))}
        </div>
      </section>
    </main>
  );
}

function evaluateTrial(trial: Trial, answer: string, artifacts: string[]): Reward {
  return judgeTrialAnswer(trial, answer, artifacts);
}

function rankFor(tier: number, xp: number) {
  if (tier >= 6) return 'Young King';
  if (tier >= 4) return 'Crown Prince';
  if (tier >= 3) return 'Scholar Prince';
  if (xp > 900) return 'Household Steward';
  return 'Novice Regent';
}

function voiceLabel(state: 'idle' | 'loading' | 'speaking' | 'quiet') {
  if (state === 'loading') return 'Calling Tutor';
  if (state === 'speaking') return 'Tutor Speaking';
  if (state === 'quiet') return 'Try Voice Again';
  return 'Hear Tutor';
}
