import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-studentfz',
  imports: [],
  templateUrl: './studentfz.html',
  styleUrl: './studentfz.css',
})
export class Studentfz {

  games = [
    { name: 'Bingo', route: '/bingo', img: '/bingo_5025899.png' },
    { name: 'Kviz', route: '/quiz', img: '/laptop_3130747.png' },
    { name: 'WhiteBoard', route: '/whiteboard', img: '/whiteboards_18782820.png' },
    { name: 'VisionBoard', route: '/visionboard', img: '/target_5362709.png' },
    { name: 'Kanban', route: null, img: '/planning_5792530.png' },
  ];

  constructor(private router: Router) {}

  otvoriStranicu(route: string | null) {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
