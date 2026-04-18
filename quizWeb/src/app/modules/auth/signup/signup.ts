import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared-module';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { NzSelectModule } from 'ng-zorro-antd/select';

const ADMIN_SECRET_CODE = 'QUIZ@ADMIN123';  // ← change this to your secret

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule, NzSelectModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class Signup implements OnInit {

  validateForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authservice: AuthService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      role: [null, [Validators.required]],
      secretCode: [null]  // ← optional
    });
  }

  submitForm() {
    if (!this.validateForm.valid) {
      this.message.error("Please fill all fields correctly");
      return;
    }

    const formData = this.validateForm.value;

    // ← Check secret code if Admin selected
    if (formData.role === 'ADMIN') {
      if (!formData.secretCode || formData.secretCode !== ADMIN_SECRET_CODE) {
        this.message.error('❌ Invalid Admin Secret Code!', { nzDuration: 5000 });
        return;
      }
    }

    // ← Remove secretCode before sending to backend
    const { secretCode, ...userData } = formData;

    this.isLoading = true;
    this.authservice.register(userData).subscribe(
      res => {
        this.isLoading = false;
        this.message.success("Signup Successful! Please login.", { nzDuration: 5000 });
        this.router.navigateByUrl("/login");
      },
      error => {
        this.isLoading = false;
        const msg = error?.error || "Signup Failed";
        this.message.error(msg, { nzDuration: 5000 });
      }
    );
  }
}