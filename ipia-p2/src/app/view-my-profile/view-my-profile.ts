import { Component, inject } from '@angular/core';
import { AuthService } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-my-profile',
  imports: [],
  templateUrl: './view-my-profile.html',
  styleUrl: './view-my-profile.css',
})
export class ViewMyProfile {

   auth = inject(AuthService);
   router = inject(Router);

   logout() {
     this.auth.logout().then(() => {
       this.router.navigate(['/login']);
     });
   }
}
