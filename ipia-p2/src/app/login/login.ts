import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';


@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  async ngOnInit(){
    await this.authService.authLoaded();
    if (this.authService.userProfile()) {
      this.router.navigate(['/view-my-profile']);
    }
  }
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      console.log(this.authService.user());
      this.router.navigate(['/view-my-profile']);
    } catch (err) {
      this.errorMessage = 'Neispravna prijava. Molimo pokusajte ponovo.';
    }
  }

}
