import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AnswerResult, ProgressUpdate, Quest, Tutor } from './models';

@Injectable({ providedIn: 'root' })
export class AcademyService {
  private readonly http = inject(HttpClient);

  getTutors(): Observable<{ tutors: Tutor[] }> {
    return this.http.get<{ tutors: Tutor[] }>('/api/tutors');
  }

  getQuest(tutorId: string, level = 1): Observable<{ quest: Quest }> {
    return this.http.get<{ quest: Quest }>(`/api/quest?tutorId=${encodeURIComponent(tutorId)}&level=${level}`);
  }

  submitAnswer(lessonId: string, answer: string): Observable<AnswerResult> {
    return this.http.post<AnswerResult>('/api/quest', { lessonId, answer });
  }

  saveProgress(update: ProgressUpdate): Observable<{ ok: true }> {
    return this.http.post<{ ok: true }>('/api/progress', update);
  }

  requestVoice(text: string, tutor: Tutor): Observable<Blob> {
    return this.http.post('/api/voice', {
      text,
      tutorId: tutor.id
    }, {
      responseType: 'blob'
    });
  }
}
