import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserStorage } from '../../../auth/services/user-storage';

interface OptionDto {
  id: number;
  optionText: string;
}

interface QuestionDto {
  id: number;
  questionText: string;
  options: OptionDto[];
}

interface TestDto {
  id: number;
  title: string;
  description: string;
  timeLimit: number; // seconds
}

@Component({
  selector: 'app-start-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './start-test.html',
  styleUrl: './start-test.scss'
})
export class StartTestComponent implements OnInit, OnDestroy {

  testId!: number;
  questions: QuestionDto[] = [];
  currentIndex: number = 0;
  selectedAnswers: { [questionId: number]: number } = {};

  timeLimit: number = 0;
  timeLeft: number = 0;

  timer: any;
  fullscreenInterval: any;

  isLoading: boolean = true;
  testStarted: boolean = false;
  private isSubmitted = false;

  tabSwitchCount: number = 0;
  blurCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  get currentQuestion(): QuestionDto | undefined {
    return this.questions[this.currentIndex];
  }

  get formattedTime(): string {
    const m = Math.floor(this.timeLeft / 60);
    const s = this.timeLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  get timePercent(): number {
    if (this.timeLimit === 0) return 100;
    return (this.timeLeft / this.timeLimit) * 100;
  }

  selectOption(questionId: number, optionId: number) {
    this.selectedAnswers[questionId] = optionId;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.testId = +this.route.snapshot.paramMap.get('id')!;

    // ✅ /api/auth/ — correct base path for user-facing endpoints
    this.http.get<TestDto>(
      `http://localhost:8080/api/auth/tests/${this.testId}`
    ).subscribe({
      next: (test) => {
        this.timeLimit = test.timeLimit > 0 ? test.timeLimit : 1800;
        this.timeLeft = this.timeLimit;
        this.fetchQuestions();
      },
      error: () => {
        this.timeLimit = 1800;
        this.timeLeft = 1800;
        this.fetchQuestions();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.testStarted) {
        this.tabSwitchCount++;
        if (this.tabSwitchCount >= 2) {
          alert('Multiple tab switches detected. Submitting test.');
          this.safeSubmit('tab switch detected');
        } else {
          alert('Warning: Do not switch tabs!');
        }
      }
    });

    window.addEventListener('blur', () => {
      if (!this.testStarted) return;
      this.blurCount++;
      if (this.blurCount >= 2) {
        alert('Focus lost multiple times. Submitting test.');
        this.safeSubmit('window blur detected');
      } else {
        alert('Stay on the test window!');
      }
    });
  }

  private fetchQuestions() {
    this.http.get<QuestionDto[]>(
      `http://localhost:8080/api/auth/tests/${this.testId}/questions`
    ).subscribe({
      next: (questions) => {
        this.questions = questions.filter(
          q => q.questionText && q.questionText.trim() !== ''
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  beginTest() {
    const userId = UserStorage.getUserId();

    this.http.get<boolean>(
      `http://localhost:8080/api/auth/tests/${this.testId}/attempted?userId=${userId}`
    ).subscribe({
      next: (alreadyDone) => {
        if (alreadyDone) {
          alert('You have already attempted this test.');
          this.router.navigate(['/user/dashboard']);
          return;
        }
        this.launchTest();
      },
      error: () => this.launchTest()
    });
  }

  private launchTest() {
    this.testStarted = true;
    this.startWholeTestTimer();

    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    }

    this.fullscreenInterval = setInterval(() => {
      if (!document.fullscreenElement && this.testStarted && !this.isSubmitted) {
        alert('Fullscreen exited. Submitting test.');
        this.safeSubmit('fullscreen exited');
      }
    }, 500);
  }

  startWholeTestTimer() {
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.cdr.detectChanges();

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.safeSubmit('time expired');
      }
    }, 1000);
  }

  nextQuestion() {
    if (this.isSubmitted) return;

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.cdr.detectChanges();
    } else {
      this.safeSubmit('user clicked submit');
    }
  }

  private safeSubmit(reason: string) {
    if (this.isSubmitted) return;
    this.isSubmitted = true;

    console.log('Submitting test — reason:', reason);

    clearInterval(this.timer);
    clearInterval(this.fullscreenInterval);

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    this.doSubmit();
  }

  private doSubmit() {
    const userId = UserStorage.getUserId();

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const answers: { [key: number]: number } = {};
    for (const key in this.selectedAnswers) {
      answers[+key] = this.selectedAnswers[+key];
    }

    this.http.post<any>(
      `http://localhost:8080/api/auth/tests/${this.testId}/submit?userId=${userId}`,
      answers
    ).subscribe({
      next: (result) => this.goToResult(result.score),
      error: () => this.goToResult(0)
    });
  }

  goToResult(score: number) {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    this.router.navigate(['/user/result'], {
      state: {
        score: score,
        total: this.questions.length,
        testId: this.testId
      }
    });
  }

  submitTest() {
    this.safeSubmit('submitTest() called directly');
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    clearInterval(this.fullscreenInterval);
  }
}