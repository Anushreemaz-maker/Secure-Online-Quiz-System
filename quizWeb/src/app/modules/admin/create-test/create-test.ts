import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AdminService } from '../../auth/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './create-test.html',
  styleUrls: ['./create-test.scss'],
})
export class CreateTestComponent {
  testForm: FormGroup;
  createdTestId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.testForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      // ✅ min(1) = at least 1 minute
      timeLimit: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.testForm.valid) {
      const formValue = this.testForm.value;

      // ✅ Convert minutes → seconds before sending to backend
      const payload = {
        title: formValue.title,
        description: formValue.description,
        timeLimit: formValue.timeLimit * 60
      };

      this.adminService.createTest(payload).subscribe({
        next: (res) => {
          this.createdTestId = res.id ?? null;
          this.testForm.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Error creating test');
        }
      });
    }
  }

  goToAddQuestion() {
    this.router.navigate(['/admin/add-question'], {
      queryParams: { testId: this.createdTestId }
    });
  }
}