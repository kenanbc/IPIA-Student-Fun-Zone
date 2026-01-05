import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router, RouterLink } from '@angular/router';
import { ThemeService, Theme } from '../theme.service';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnDestroy {

  auth = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);
  
  userInfo = this.auth.userProfile();
  user = {
    avatarId: this.userInfo?.avatarId || '',
    firstName: this.userInfo?.firstName || '',
    lastName: this.userInfo?.lastName || '',
    email: this.userInfo?.email || '',
    studyProgram: this.userInfo?.studyProgram || '',
    yearOfStudy: this.userInfo?.yearOfStudy || '',
    themeId: this.userInfo?.themeId || 'default',
  };

  themes = this.themeService.themes;
  selectedTheme = this.themeService.getThemeById(this.user.themeId) || this.themes[0];
  
  private profileSaved = false;

  async onSubmit() {
    const currentUser = this.auth.user();
    if (!currentUser) return;

    const updatedProfile = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      studyProgram: this.user.studyProgram,
      yearOfStudy: this.user.yearOfStudy,
      avatarId: this.selectedAvatar.id,
      themeId: this.selectedTheme.id
    };

    try {
      await this.auth.updateProfile(currentUser.uid, updatedProfile);
      this.profileSaved = true;
      alert('Profil uspješno ažuriran!');
      this.router.navigate(['/view-my-profile']);
    } catch (error) {
      alert('Došlo je do greške pri ažuriranju profila.');
    }
  }

    avatars = [
    {id: '1', path: 'avatar1.png'},
    {id: '2', path: 'avatar2.png'},
    {id: '3', path: 'avatar3.png'},
    {id: '4', path: 'avatar4.png'},
  ];

  selectedAvatar =  this.avatars[this.user.avatarId ? parseInt(this.user.avatarId) - 1 : 0];

  selectAvatar(avatar: {id: string, path: string}) {
    this.selectedAvatar = avatar;
  }

  selectTheme(theme: Theme) {
    this.selectedTheme = theme;
    this.themeService.setTheme(theme);
  }

  ngOnDestroy() {
    if (!this.profileSaved) {
      const originalThemeId = this.userInfo?.themeId || 'default';
      this.themeService.setThemeById(originalThemeId);
    }
  }
}
