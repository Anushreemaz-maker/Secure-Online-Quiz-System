import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(private router: Router) {}

  goToCreateTest() {
    this.router.navigate(['/admin/create-test']);
  }

  goToAddQuestion() {
    this.router.navigate(['/admin/add-question']);
  }
}