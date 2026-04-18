import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorage } from '../modules/auth/services/user-storage';

export const userGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (UserStorage.isUserLoggedIn()) {
    return true;
  }

  // If an admin tries to access user area — send them to admin dashboard
  if (UserStorage.isAdminLoggedIn()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  // Not logged in at all
  router.navigate(['/login']);
  return false;
};