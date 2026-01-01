import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../auth';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

  async ngOnInit(){
    await this.authService.authLoaded();
    if (this.authService.userProfile()) {
      this.router.navigate(['/view-my-profile']);
    }
  }

  avatars = [
    {id: '1', path: 'avatar1.png'},
    {id: '2', path: 'avatar2.png'},
    {id: '3', path: 'avatar3.png'},
    {id: '4', path: 'avatar4.png'},
  ];

  selectedAvatar = this.avatars[0];

  selectAvatar(avatar: {id: string, path: string}) {
    this.selectedAvatar = avatar;
  }

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  studyProgram: string = '';
  yearOfStudy: number | null = null;
  errorMessage: string = '';

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  async register() {
    try {
      await this.authService.register(this.firstName, this.lastName, this.email, this.password, this.selectedAvatar.id, this.studyProgram, this.yearOfStudy);
      console.log(this.authService.user());
      this.router.navigate(['/view-my-profile']);
    } catch (err) {
      this.errorMessage = 'Neispravna registracija. Molimo pokusajte ponovo.';
    }
  }
}