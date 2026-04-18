import { Component, OnInit } from '@angular/core';
import { QuestionService, QuestionDto } from '../../services/question';
import { AdminService, TestDto } from '../../modules/auth/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-question.html',
  styleUrls: ['./add-question.scss']
})
export class AddQuestionComponent implements OnInit {

  tests: TestDto[] = [];       // ← all tests for dropdown
  selectedTestId: number = 0;  // ← selected test

  question: QuestionDto = {
    questionText: '',
    testId: 0,
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ]
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private questionService: QuestionService,
    private adminService: AdminService,  // ← ADD
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 1️⃣ Load all tests for dropdown
    this.adminService.getAllTests().subscribe({
      next: (tests) => {
        this.tests = tests;
      },
      error: (err) => console.error('Failed to load tests', err)
    });

    // 2️⃣ Pre-select testId from URL if coming from Create Test
    this.route.queryParams.subscribe(params => {
      if (params['testId']) {
        this.selectedTestId = +params['testId'];
        this.question.testId = this.selectedTestId;
      }
    });
  }

  onTestSelect() {
    this.question.testId = this.selectedTestId;  // ← sync dropdown to question
  }

  addOption() {
    this.question.options.push({ optionText: '', isCorrect: false });
  }

  removeOption(index: number) {
    this.question.options.splice(index, 1);
  }

  submitQuestion() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.question.testId) {
      this.errorMessage = '❌ Please select a test first!';
      return;
    }

    this.questionService.addQuestion(this.question).subscribe({
      next: (res) => {
        this.successMessage = `✅ Question added! ID: ${res.id} — Add another below`;
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = `❌ Error: ${err.error?.message || err.message}`;
      }
    });
  }

  resetForm() {
    this.question = {
      questionText: '',
      testId: this.selectedTestId,  // ← keep same test selected
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    };
  }
}