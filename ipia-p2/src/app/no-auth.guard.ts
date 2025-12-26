import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const noAuthGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.authLoaded();

  if (auth.userProfile()) {
    router.navigate(['/view-my-profile']);
    return false;
  }

  return true;
};
