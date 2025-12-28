import { Component, computed } from '@angular/core';
import { StatsComponent } from '../stats-component/stats-component';

@Component({
  selector: 'app-focus-tracker',
  imports: [StatsComponent],
  templateUrl: './focus-tracker.html',
  styleUrl: './focus-tracker.css',
})
export class FocusTracker {

  focusStats = computed(() => [
  { label: 'Broj sesija danas', value: 0 },
  { label: 'Ukupno', value: 0, unit: 'h' },
  { label: 'Ukupno sesija', value: 0},
  { label: 'Prosječno vrijeme', value: 0, unit: 'h' }
]);
}
