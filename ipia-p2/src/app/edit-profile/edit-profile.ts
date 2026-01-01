import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {

  auth = inject(AuthService);
  router = inject(Router);
  
  userInfo = this.auth.userProfile();
  user = {
    avatarId: this.userInfo?.avatarId || '',
    firstName: this.userInfo?.firstName || '',
    lastName: this.userInfo?.lastName || '',
    email: this.userInfo?.email || '',
    studyProgram: this.userInfo?.studyProgram || '',
    yearOfStudy: this.userInfo?.yearOfStudy || '',
  };

  async onSubmit() {
    const currentUser = this.auth.user();
    if (!currentUser) return;

    const updatedProfile = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      studyProgram: this.user.studyProgram,
      yearOfStudy: this.user.yearOfStudy,
      avatarId: this.selectedAvatar.id
    };

    try {
      await this.auth.updateProfile(currentUser.uid, updatedProfile);
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
}
