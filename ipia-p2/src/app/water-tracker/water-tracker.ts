import { Component, computed, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { WaterService } from './water.service';
import { FormsModule } from '@angular/forms';
import { StatsComponent } from '../stats-component/stats-component';

@Component({
  selector: 'app-water-tracker',
  imports: [RouterLink, FormsModule, StatsComponent],
  templateUrl: './water-tracker.html',
  styleUrl: './water-tracker.css',
})
export class WaterTracker implements OnInit {
  

  waterStats = computed(() => [
  { label: 'Čaša vode', value: this.waterService.glassCount() },
  { label: 'Ukupno', value: this.waterService.todayLiters(), unit: 'L' },
  { label: 'Dnevni cilj', value: this.waterService.progress(), unit: '%' },
  { label: 'Cilj', value: this.waterService.dailyGoal(), unit: 'L' }
]);

  selectedGoal: string = '1.5';

  constructor(public waterService: WaterService) {}

  ngOnInit(): void {
    this.waterService.loadTodayData();
    this.waterService.loadDailyGoal();
    this.selectedGoal = this.waterService.dailyGoal().toString();
  }

  async addGlass(): Promise<void> {
    await this.waterService.addGlass();
  }

  async reset(): Promise<void> {
    await this.waterService.resetToday();
  }

  async saveGoal(): Promise<void> {
    const goalValue = parseFloat(this.selectedGoal);
    await this.waterService.setDailyGoal(goalValue);
  }
}
