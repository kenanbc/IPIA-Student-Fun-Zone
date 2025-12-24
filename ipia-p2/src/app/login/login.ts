import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';


@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  login() {
  this.authService.login(this.email, this.password)
    .then(() => {
      console.log(this.authService.user());
      this.router.navigate(['/view-my-profile']);
    })
    .catch(err => {
      console.error(err);
    });
}

}
