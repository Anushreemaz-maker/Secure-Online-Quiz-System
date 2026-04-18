import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.scss'
})
export class Result implements OnInit {

  score: number = 0;
  total: number = 0;
  percentage: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    const state = history.state;
    this.score = state.score || 0;
    this.total = state.total || 0;
    this.percentage = this.total > 0 ? Math.round((this.score / this.total) * 100) : 0;
  }

  goToDashboard() {
    this.router.navigate(['/user/dashboard']);
  }
}