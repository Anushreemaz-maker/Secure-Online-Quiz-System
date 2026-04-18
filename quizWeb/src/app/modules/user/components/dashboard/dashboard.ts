import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface TestDto {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  tests: TestDto[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<TestDto[]>('http://localhost:8080/api/auth/tests').subscribe({
      next: (tests) => this.tests = tests,
      error: (err) => console.error('Failed to load tests', err)
    });
  }

  startTest(testId: number) {
    this.router.navigate(['/user/start-test', testId]);
  }
}
