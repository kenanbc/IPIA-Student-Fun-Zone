import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { WaterService } from './water.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-water-tracker',
  imports: [RouterLink, FormsModule],
  templateUrl: './water-tracker.html',
  styleUrl: './water-tracker.css',
})
export class WaterTracker implements OnInit {

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

  reset(): void {
    this.waterService.resetToday();
  }

  async saveGoal(): Promise<void> {
    const goalValue = parseFloat(this.selectedGoal);
    await this.waterService.setDailyGoal(goalValue);
  }
}
