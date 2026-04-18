import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorage } from '../modules/auth/services/user-storage';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (UserStorage.isAdminLoggedIn()) {
    return true;
  }

  // If a regular user tries to access admin — send them to their dashboard
  if (UserStorage.isUserLoggedIn()) {
    router.navigate(['/user/dashboard']);
    return false;
  }

  // Not logged in at all
  router.navigate(['/login']);
  return false;
};