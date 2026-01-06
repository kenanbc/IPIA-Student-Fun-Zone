import { Component, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsComponent } from '../stats-component/stats-component';
import { SleepService } from './sleep.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sleep-tracker',
  imports: [RouterLink, StatsComponent, FormsModule],
  templateUrl: './sleep-tracker.html',
  styleUrl: './sleep-tracker.css',
})
export class SleepTracker implements OnInit {

  days = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
  
  bedTime: string = '22:00';
  wakeTime: string = '07:00';

  sleepStats = computed(() => [
    { label: 'Prošla noć', value: this.sleepService.lastNightHours(), unit: 'h' },
    { label: 'Sedmični prosjek', value: this.sleepService.weeklyAverage(), unit: 'h' },
    { label: 'Vrijeme spavanja', value: this.sleepService.bedTime() },
    { label: 'Vrijeme buđenja', value: this.sleepService.wakeTime() }
  ]);

  constructor(public sleepService: SleepService) {}

  ngOnInit(): void {
    this.sleepService.loadWeekData();
  }

  async saveSleep(): Promise<void> {
    await this.sleepService.saveSleep(this.bedTime, this.wakeTime);
  }

  getProgress(index: number): number {
    const hours = this.sleepService.weekData()[index];
    return Math.min((hours / 8) * 100, 100);
  }
}
