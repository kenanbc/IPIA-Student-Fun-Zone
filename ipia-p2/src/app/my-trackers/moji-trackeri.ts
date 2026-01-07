import { Component, inject, OnInit, signal } from '@angular/core';
import { TrackerCard } from '../tracker-card/tracker-card';
import { ActivityService, Activity } from '../activity.service';

@Component({
  selector: 'app-moji-trackeri',
  imports: [TrackerCard],
  templateUrl: './moji-trackeri.html',
  styleUrl: './moji-trackeri.css',
})
export class MojiTrackeri implements OnInit {
  private activityService = inject(ActivityService);

  private baseTrackers: Tracker[] = [
    {
      name: 'Voda',
      description: 'Praćenje unosa vode',
      icon: '/clean-water.png',
      route: 'water-tracker',
      type: 'water',
      lastUsed: 'Učitavanje...'
    },
    {
      name: 'Fokus',
      description: 'Praćenje fokusa tokom dana',
      icon: '/stopwatch.png',
      route: 'focus-tracker',
      type: 'focus',
      lastUsed: 'Učitavanje...'
    },
    {
      name: 'San',
      description: 'Praćenje kvaliteta sna',
      icon: '/sleep.png',
      route: 'sleep-tracker',
      type: 'sleep',
      lastUsed: 'Učitavanje...'
    },
    {
      name: 'Kalendar',
      description: 'Praćenje nadolazećih događaja',
      icon: '/schedule.png',
      route: 'calendar-tracker',
      type: 'calendar',
      lastUsed: 'Učitavanje...'
    },
    {
      name: 'Budžet',
      description: 'Praćenje budžeta i troškova',
      icon: '/budget.png',
      route: 'budget-tracker',
      type: 'budget',
      lastUsed: 'Učitavanje...'
    },
    {
      name: 'Čitanje',
      description: 'Praćenje čitanja knjiga',
      icon: '/book.png',
      route: 'reading-tracker',
      type: 'reading',
      lastUsed: 'Učitavanje...'
    }
  ];

  myTrackers = signal<Tracker[]>(this.baseTrackers);

  async ngOnInit() {
    const lastUsedMap = await this.activityService.getLastUsedByType();
    
    const updated = this.baseTrackers.map(tracker => ({
      ...tracker,
      lastUsed: lastUsedMap.get(tracker.type) || 'Nikad korišteno'
    }));
    
    this.myTrackers.set(updated);
  }
}