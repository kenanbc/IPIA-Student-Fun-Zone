import { Component, inject, OnInit, signal } from '@angular/core';
// import { onAuthStateChanged } from '@angular/fire/auth';
import { RouterOutlet } from '@angular/router';
import { auth } from './firebase';
import { Navbar } from './navbar/navbar';
import { AuthService } from './auth';
// import { Login } from "./login/login";
// import { Register } from "./register/register";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  auth = inject(AuthService);

}