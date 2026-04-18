import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorage } from '../modules/auth/services/user-storage';

// Prevents logged-in users from visiting /login or /register
export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (UserStorage.isAdminLoggedIn()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  if (UserStorage.isUserLoggedIn()) {
    router.navigate(['/user/dashboard']);
    return false;
  }

  return true;
};