import { Routes } from '@angular/router';
import { Signup } from './modules/auth/signup/signup';
import { Login } from './modules/shared/auth/login/login';

import { authGuard }  from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { userGuard }  from './guards/user.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [

  // Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes — logged-in users get redirected away
  {
    path: 'register',
    component: Signup,
    canActivate: [loginGuard]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [loginGuard]
  },

  // User area — only USER role allowed
  {
    path: 'user',
    canActivate: [authGuard, userGuard],
    loadChildren: () =>
      import('./modules/user/user-module').then(m => m.UserModule)
  },

  // Admin area — only ADMIN role allowed
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./modules/admin/admin-module').then(m => m.AdminModule)
  },

  // Catch-all — redirect unknown URLs to login
  { path: '**', redirectTo: 'login' }

];