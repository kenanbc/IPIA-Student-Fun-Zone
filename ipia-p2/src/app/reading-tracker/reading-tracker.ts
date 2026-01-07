import { Component, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsComponent } from '../stats-component/stats-component';
import { FormsModule } from '@angular/forms';
import { ReadingService } from './reading.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reading-tracker',
  imports: [RouterLink, StatsComponent, FormsModule, DatePipe],
  templateUrl: './reading-tracker.html',
  styleUrl: './reading-tracker.css',
})
export class ReadingTracker implements OnInit {

  readingStats = computed(() => [
    { label: 'Godišnji cilj', value: this.readingService.yearlyGoal() },
    { label: 'Pročitano', value: this.readingService.booksRead() },
    { label: 'Br. stranica', value: this.readingService.totalPages() },
    { label: 'Pros. vrijeme', value: this.readingService.avgReadingTime(), unit: 'h' }
  ]);

  bookTitle = '';
  bookPages: number | null = null;
  goal = 20;

  constructor(public readingService: ReadingService) {}

  ngOnInit(): void {
    this.readingService.loadData();
    this.goal = this.readingService.yearlyGoal();
  }

  async addBook(): Promise<void> {
    if(this.bookPages === null) return;
    if (this.bookTitle && this.bookPages > 0) {
      await this.readingService.addBook(this.bookTitle, this.bookPages);
      this.bookTitle = '';
      this.bookPages = 0;
    }
  }

  async addGoal(): Promise<void> {
    if (this.goal > 0) {
      await this.readingService.setYearlyGoal(this.goal);
    }
  }
}
