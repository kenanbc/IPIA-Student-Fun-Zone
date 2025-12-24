import { Component, OnInit, signal } from '@angular/core';
// import { onAuthStateChanged } from '@angular/fire/auth';
import { RouterOutlet } from '@angular/router';
import { auth } from './firebase';
// import { Login } from "./login/login";
// import { Register } from "./register/register";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


}