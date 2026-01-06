import { Component } from '@angular/core';
import { TrackerCard } from '../tracker-card/tracker-card';

@Component({
  selector: 'app-moji-trackeri',
  imports: [TrackerCard],
  templateUrl: './moji-trackeri.html',
  styleUrl: './moji-trackeri.css',
})
export class MojiTrackeri {
  myTrackers: Tracker[] = [
    {
      name: 'Voda',
      description: 'Praćenje unosa vode',
      icon: '/clean-water.png',
      route: 'water-tracker',
      lastUsed: '25.06.2024 14:30'
    },
    {
      name: 'Fokus',
      description: 'Praćenje fokusa tokom dana',
      icon: '/stopwatch.png',
      route: 'focus-tracker',
      lastUsed: '24.06.2024 09:15'
    },
    {
      name: 'San',
      description: 'Praćenje kvaliteta sna',
      icon: '/sleep.png',
      route: 'sleep-tracker',
      lastUsed: '23.06.2024 22:00'
    },
    {
      name: 'Kalendar',
      description: 'Praćenje nadolazećih događaja',
      icon: '/schedule.png',
      route: 'calendar-tracker',
      lastUsed: '22.06.2024 18:45'
    },
    {
      name: 'Budžet',
      description: 'Praćenje budžeta i troškova',
      icon: '/budget.png',
      route: 'budget-tracker',
      lastUsed: '21.06.2024 12:20'
    },
    {
      name: 'Čitanje',
      description: 'Praćenje čitanja knjiga',
      icon: '/book.png',
      route: 'reading-tracker',
      lastUsed: '20.06.2024 16:10'
    }
  ];
}