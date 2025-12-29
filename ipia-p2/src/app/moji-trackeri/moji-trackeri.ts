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
      icon: '💧',
      route: 'water-tracker'
    },
    {
      name: 'Fokus',
      description: 'Praćenje fokusa tokom dana',
      icon: '🎯',
      route: 'focus-tracker'
    },
    {
      name: 'San',
      description: 'Praćenje kvaliteta sna',
      icon: '😴',
      route: 'sleep-tracker'
    },
    {
      name: 'Vježbanje',
      description: 'Praćenje fizičke aktivnosti',
      icon: '🏋️‍♂️',
      route: 'exercise-tracker'
    },
    {
      name: 'Budžet',
      description: 'Praćenje budžeta i troškova',
      icon: '💰',
      route: 'budget-tracker'
    },
    {
      name: 'Čitanje',
      description: 'Praćenje čitanja knjiga',
      icon: '📚',
      route: 'reading-tracker'
    }
  ];
}