 import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth';
import { Router, RouterLink } from '@angular/router';
import { ActivityService, Activity } from '../activity.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-my-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './view-my-profile.html',
  styleUrl: './view-my-profile.css',
})
export class ViewMyProfile implements OnInit {

   auth = inject(AuthService);
   router = inject(Router);
   activityService = inject(ActivityService);

   async ngOnInit() {
     await this.auth.authLoaded();
     await this.activityService.loadRecentActivities(6);
   }

   logout() {
     this.auth.logout().then(() => {
       this.router.navigate(['/login']);
     });
   }

   getActivityIcon(type: Activity['type']): string {
     return this.activityService.getActivityIcon(type);
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
