import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AcademyService } from './academy.service';
import { AnswerResult, Quest, Tutor } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly academy = inject(AcademyService);
  private readonly sealStorageKey = 'prince-academy.completed-seals.v1';
  private audio?: HTMLAudioElement;
  private themeAudio?: HTMLAudioElement;
  private activeAudioUrl = '';

  readonly tutors = signal<Tutor[]>([]);
  readonly selectedTutorId = signal<string>('');
  readonly quest = signal<Quest | null>(null);
  readonly answer = signal<string>('');
  readonly result = signal<AnswerResult | null>(null);
  readonly loading = signal<boolean>(true);
  readonly speaking = signal<boolean>(false);
  readonly roomChanging = signal<boolean>(false);
  readonly musicPlaying = signal<boolean>(false);
  readonly activeLevel = signal<number>(1);
  readonly completedSealKeys = signal<string[]>(this.loadCompletedSealKeys());
  readonly focusVirtue = signal<string>('Kindness');

  readonly activeTutor = computed(() => {
    const tutors = this.tutors();
    return tutors.find((tutor) => tutor.id === this.selectedTutorId()) ?? tutors[0] ?? null;
  });

  readonly unlockedLevel = computed(() => {
    const tutors = this.tutors();
    return tutors.length && tutors.every((tutor) => this.completedSealKeys().includes(this.sealKey(tutor.id, 1))) ? 2 : 1;
  });

  readonly completedLessons = computed(() => {
    const level = this.activeLevel();
    const keys = this.completedSealKeys();
    return this.tutors().filter((tutor) => keys.includes(this.sealKey(tutor.id, level))).length;
  });

  readonly progressPercent = computed(() => Math.min(100, this.completedLessons() * 20));

  ngOnInit(): void {
    this.academy.getTutors().subscribe({
      next: ({ tutors }) => {
        this.tutors.set(tutors);
        const firstTutor = tutors[0];
        if (firstTutor) {
          this.selectedTutorId.set(firstTutor.id);
          this.loadQuest(firstTutor.id);
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  selectTutor(tutor: Tutor): void {
    this.roomChanging.set(true);
    this.selectedTutorId.set(tutor.id);
    this.answer.set('');
    this.result.set(null);
    this.loadQuest(tutor.id);
    window.setTimeout(() => this.roomChanging.set(false), 520);
  }

  selectLevel(level: number): void {
    const tutor = this.activeTutor();

    if (this.isLevelLocked(level)) {
      this.result.set({
        correct: false,
        mentorLine: 'Level II opens only after every Level I chamber seal has been claimed.',
        expected: '',
        stretch: 'Finish all five first chambers, then the higher path opens.'
      });
      return;
    }

    this.activeLevel.set(level);
    this.answer.set('');
    this.result.set(null);
    if (tutor) {
      this.loadQuest(tutor.id);
    }
  }

  chooseAnswer(choice: string): void {
    this.answer.set(choice);
  }

  submitAnswer(): void {
    const quest = this.quest();
    const tutor = this.activeTutor();
    const answer = this.answer().trim();

    if (!quest || !tutor || !answer) {
      return;
    }

    this.academy.submitAnswer(quest.id, answer).subscribe({
      next: (result) => {
        this.result.set(result);
        if (result.correct) {
          this.markSeal(tutor.id, quest.level);
        }
        this.academy.saveProgress({
          lessonId: quest.id,
          tutorId: tutor.id,
          status: result.correct ? 'mastered' : 'answered',
          answer,
          score: result.correct ? 1 : 0
        }).subscribe();
      },
      error: () => {
        this.result.set({
          correct: false,
          mentorLine: 'The lesson hall is quiet for a moment. Try again with a calm mind.',
          expected: quest.answer,
          stretch: quest.stretch
        });
      }
    });
  }

  speakCurrentLesson(): void {
    const tutor = this.activeTutor();
    const quest = this.quest();
    if (!tutor || !quest) {
      return;
    }

    const text = `${quest.opening} ${quest.prompt}`;
    this.speak(text, tutor);
  }

  speakResult(): void {
    const tutor = this.activeTutor();
    const result = this.result();
    if (!tutor || !result) {
      return;
    }

    this.speak(`${result.mentorLine} ${result.stretch}`, tutor);
  }

  toggleThemeMusic(): void {
    this.themeAudio ??= new Audio('/audio/princes-vow.wav');
    this.themeAudio.loop = true;
    this.themeAudio.volume = 0.42;

    if (this.themeAudio.paused) {
      void this.themeAudio.play();
      this.musicPlaying.set(true);
    } else {
      this.themeAudio.pause();
      this.musicPlaying.set(false);
    }
  }

  isSealClaimed(tutor: Tutor): boolean {
    return this.completedSealKeys().includes(this.sealKey(tutor.id, this.activeLevel()));
  }

  isLevelLocked(level: number): boolean {
    return level > this.unlockedLevel();
  }

  private loadQuest(tutorId: string): void {
    if (this.activeLevel() > this.unlockedLevel()) {
      this.activeLevel.set(this.unlockedLevel());
    }

    this.loading.set(true);
    this.academy.getQuest(tutorId, this.activeLevel()).subscribe({
      next: ({ quest }) => {
        this.quest.set(quest);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private speak(text: string, tutor: Tutor): void {
    this.speaking.set(true);
    this.stopVoicePlayback();

    this.academy.requestVoice(text, tutor).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.activeAudioUrl = url;
        this.audio = new Audio(url);
        this.audio.onended = () => {
          this.speaking.set(false);
          this.revokeActiveAudio(url);
        };
        this.audio.onerror = () => {
          this.speaking.set(false);
          this.revokeActiveAudio(url);
        };
        void this.audio.play();
      },
      error: () => {
        this.speaking.set(false);
        this.result.set({
          correct: false,
          mentorLine: 'The ElevenLabs voice did not answer. Check the voice key and voice ID configuration.',
          expected: '',
          stretch: 'No browser robot voice will stand in for the tutor.'
        });
      },
    });
  }

  private stopVoicePlayback(): void {
    this.audio?.pause();
    this.audio = undefined;
    this.revokeActiveAudio();
  }

  private revokeActiveAudio(url = this.activeAudioUrl): void {
    if (url) {
      URL.revokeObjectURL(url);
      if (this.activeAudioUrl === url) {
        this.activeAudioUrl = '';
      }
    }
  }

  private markSeal(tutorId: string, level: number): void {
    const key = this.sealKey(tutorId, level);

    if (this.completedSealKeys().includes(key)) {
      return;
    }

    const next = [...this.completedSealKeys(), key];
    this.completedSealKeys.set(next);
    window.localStorage.setItem(this.sealStorageKey, JSON.stringify(next));
  }

  private loadCompletedSealKeys(): string[] {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(this.sealStorageKey) || '[]');
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }

  private sealKey(tutorId: string, level: number): string {
    return `${tutorId}:${level}`;
  }
}
