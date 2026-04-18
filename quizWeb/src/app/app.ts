import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SharedModule } from './modules/shared/shared-module';
import { UserStorage } from './modules/shared/auth/services/user-storage';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    SharedModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('quizWeb');

  isUserLoggedIn:boolean=UserStorage.isUserLoggedIn();
  isAdminLoggedIn:boolean=UserStorage.isAdminLoggedIn();
  constructor(private router:Router){}
  ngOnInit(){
    this.router.events.subscribe(event=>{
      this.isUserLoggedIn =UserStorage.isUserLoggedIn();
      this.isAdminLoggedIn=UserStorage.isAdminLoggedIn();
    })
  }
  logout(){
    UserStorage.signOut();
    this.router.navigateByUrl('login')
  }
}