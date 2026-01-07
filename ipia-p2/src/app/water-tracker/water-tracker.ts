import { Component, computed, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { WaterService } from './water.service';
import { FormsModule } from '@angular/forms';
import { StatsComponent } from '../stats-component/stats-component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-water-tracker',
  imports: [RouterLink, FormsModule, StatsComponent],
  templateUrl: './water-tracker.html',
  styleUrl: './water-tracker.css',
})
export class WaterTracker implements OnInit, AfterViewInit {

  @ViewChild('waterChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  waterStats = computed(() => [
  { label: 'Čaša vode', value: this.waterService.glassCount() },
  { label: 'Ukupno', value: this.waterService.todayLiters(), unit: 'L' },
  { label: 'Dnevni cilj', value: this.waterService.progress(), unit: '%' },
  { label: 'Cilj', value: this.waterService.dailyGoal(), unit: 'L' }
]);


  constructor(public waterService: WaterService) {}

  selectedGoal: string = '';

  ngOnInit(): void {
    this.waterService.loadTodayData();
    this.waterService.loadDailyGoal();
    this.selectedGoal = this.waterService.dailyGoal().toString();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.loadChart();
  }

  async loadChart(): Promise<void> {
    const data = await this.waterService.getWeeklyData();
    
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.dates,
          datasets: [
            {
              label: 'Unos vode (L)',
              data: data.values,
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              borderWidth: 2
            },
            {
              label: 'Cilj',
              data: Array(data.dates.length).fill(this.waterService.dailyGoal()),
              borderDash: [10,5],
            }
          ]
        }
      });
  }

  async addGlass(): Promise<void> {
    await this.waterService.addGlass();
    await this.loadChart();
  }

  async reset(): Promise<void> {
    await this.waterService.resetToday();
    await this.loadChart();
  }

  async saveGoal(): Promise<void> {
    const goalValue = parseFloat(this.selectedGoal);
    await this.waterService.setDailyGoal(goalValue);
    await this.loadChart();
  }
}
