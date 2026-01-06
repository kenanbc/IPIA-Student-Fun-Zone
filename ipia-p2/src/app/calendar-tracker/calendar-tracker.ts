import { Component, computed, OnInit } from '@angular/core';
import { StatsComponent } from '../stats-component/stats-component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarService } from './calendar.service';

@Component({
  selector: 'app-calendar-tracker',
  imports: [RouterLink, StatsComponent, CommonModule, FormsModule],
  templateUrl: './calendar-tracker.html',
  styleUrl: './calendar-tracker.css',
})
export class CalendarTracker implements OnInit {

  calendarStats = computed(() => [
    { label: 'Nadolazeći', value: this.calendarService.upcomingCount() },
    { label: 'Danas', value: this.calendarService.todayCount() },
    { label: 'Ove sedmice', value: this.calendarService.weekCount() },
    { label: 'Ovaj mjesec', value: this.calendarService.monthCount() }
  ]);

  todayDate: string = new Date().toLocaleDateString('bs-BA', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  eventTitle: string = '';
  eventDescription: string = '';
  eventTime: string = '';
  eventDate: string = '';

  constructor(public calendarService: CalendarService) {}

  ngOnInit(): void {
    this.calendarService.loadEvents();
  }

  get eventsList() {
    return this.calendarService.getTodayEvents();
  }

  async addEvent(): Promise<void> {
    if (!this.eventTitle || !this.eventDescription || !this.eventDate || !this.eventTime) {
      return;
    }

    await this.calendarService.addEvent(
      this.eventTitle,
      this.eventDescription,
      this.eventDate,
      this.eventTime
    );

    this.eventTitle = '';
    this.eventDescription = '';
    this.eventDate = '';
    this.eventTime = '';
  }
}