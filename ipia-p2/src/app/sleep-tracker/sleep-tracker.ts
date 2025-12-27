import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sleep-tracker',
  imports: [RouterLink],
  templateUrl: './sleep-tracker.html',
  styleUrl: './sleep-tracker.css',
})
export class SleepTracker {

  days = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
}
