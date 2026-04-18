import { Component } from '@angular/core';
import { SharedModule } from '../../shared-module';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class Signup {

  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authservice:AuthService
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      name: [null, [Validators.required]]
    });
  }

  submitForm() {
  if (!this.validateForm.valid) {
    this.message.error("Please fill all fields correctly");
    return;
  }

  console.log("Form Data:", this.validateForm.value);

  this.authservice.register(this.validateForm.value).subscribe(
    res => {
      console.log("API Response:", res);

      this.message.success("Signup Successful", {
        nzDuration: 5000
      });

      this.router.navigateByUrl("/login");
    },
    error => {
      console.log("API Error:", error);

      const msg = error?.error || "Signup Failed";
      this.message.error(msg, { nzDuration: 5000 });
    }
  );
}
}