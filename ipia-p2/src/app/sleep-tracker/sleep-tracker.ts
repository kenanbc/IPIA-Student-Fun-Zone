import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsComponent } from '../stats-component/stats-component';

@Component({
  selector: 'app-sleep-tracker',
  imports: [RouterLink, StatsComponent],
  templateUrl: './sleep-tracker.html',
  styleUrl: './sleep-tracker.css',
})
export class SleepTracker {

  days = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
  sleepStats = computed(() => [
  { label: 'Prošla noć', value: 0, unit: 'h' },
  { label: 'Sedmični prosjek', value: 0, unit: 'h' },
  { label: 'Vrijeme spavanja', value: 0 },
  { label: 'Vrijeme buđenja', value: 0}
]);

}
