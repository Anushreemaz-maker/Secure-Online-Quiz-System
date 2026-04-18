import { Component } from '@angular/core';
import { SharedModule } from '../../shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { UserStorage } from '../services/user-storage';

@Component({
  selector: 'app-login',
  imports: [SharedModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private fb: FormBuilder,
    private authService:AuthService,
    private message :NzMessageService,
    private router:Router,
  ){}
  validateForm!:FormGroup;
  ngOnInit(){
    this.validateForm =this.fb.group({
      email:[null, Validators.required],
      password:[null,Validators.required]
    })
  }
  submitForm(){
    this.authService.login(this.validateForm.value).subscribe(res=>{
      this.message
      .success(
        'Login Success',
        {nzDuration:5000}
      );
      const user={
        id: res.id,
        role:res.role
      }
      UserStorage.saveUser(user);
      if(UserStorage.isAdminLoggedIn()){
        this.router.navigateByUrl('admin/dashboard')
      } else if(UserStorage.isUserLoggedIn()){
        this.router.navigateByUrl('user/dashboard')
      }
      console.log(res);
    },error=>{
      this.message
      .error(
        'Bad Credentials',
        {nzDuration:5000}
      );
    })
  }

}
