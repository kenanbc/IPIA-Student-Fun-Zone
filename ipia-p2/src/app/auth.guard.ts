import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.authLoaded();

  if (auth.userProfile()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
