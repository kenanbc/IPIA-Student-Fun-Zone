import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsComponent } from '../stats-component/stats-component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reading-tracker',
  imports: [RouterLink, StatsComponent, FormsModule],
  templateUrl: './reading-tracker.html',
  styleUrl: './reading-tracker.css',
})
export class ReadingTracker {

  readingStats = computed(() => [
  { label: 'Godišnji cilj', value: 20 },
  { label: 'Pročitano', value: 10},
  { label: 'Br. stranica', value: 3500},
  { label: 'Pros. vrijeme', value:45, unit: 'min' }
]);

  bookTitle = '';
  bookPages = 0;
  goal = 20;

  books = [
    { title: 'Knjiga 1', pages: 300, date: new Date('2023-01-15') },
    { title: 'Knjiga 2', pages: 150, date: new Date('2023-02-20') },
  ];

  addBook() {
  }

  addGoal() {
  }

}
