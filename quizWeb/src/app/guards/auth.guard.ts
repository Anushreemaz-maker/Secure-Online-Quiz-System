import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorage } from '../modules/auth/services/user-storage';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (UserStorage.isUserLoggedIn() || UserStorage.isAdminLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};