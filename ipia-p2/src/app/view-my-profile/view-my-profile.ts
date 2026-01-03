 import { Component, inject } from '@angular/core';
import { AuthService } from '../auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-my-profile',
  imports: [RouterLink],
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

   formatUserProfileStudyProgram() {
      const profile = this.auth.userProfile();
      if (!profile) return 'Nema dostupnog profila.';
      console.log(profile);
      switch (profile.studyProgram) {
         case "1":
            return 'Informatika i računarstvo';
         case '2':
            return 'Informacione tehnologije';
          case '3':
            return 'Tržišne komunikacije';
          case '4':
            return 'Savremeno poslovanje';
         default:
            return 'Nepoznat smjer';
      }
   }

   formatUserProfileYearOfStudy() {
      const profile = this.auth.userProfile();
      if (!profile) return 'Nema dostupnog profila.';
      switch (profile.yearOfStudy) {
         case '1':
            return 'I godina';
          case '2':
            return 'II godina';
          case '3':
            return 'III godina';
          case '4':
            return 'IV godina';
          default: 
            return 'Nepoznata godina studija';
      }
    }
}
