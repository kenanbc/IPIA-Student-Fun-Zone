import { Component, computed } from '@angular/core';
import { StatsComponent } from '../stats-component/stats-component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-tracker',
  imports: [RouterLink, StatsComponent, CommonModule, FormsModule],
  templateUrl: './calendar-tracker.html',
  styleUrl: './calendar-tracker.css',
})
export class CalendarTracker {

  calendarStats = computed(() => [
  { label: 'Nadolazeći', value: 0 },
  { label: 'Danas', value: 0 },
  { label: 'Ove sedmice', value: 0},
  { label: 'Ovaj mjesec', value: 0}
]);

  todayDate: string = new Date().toLocaleDateString('bs-BA', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  eventsList: Array<{ date: string; title: string; description: string, time: string}> = [
    { date: '2024-06-10', title: 'Sastanak sa timom', description: 'Diskusija o novom projektu', time: '10:00' }
  ];

  eventListAdd(event: { date: string; title: string; description: string, time: string}) {
    this.eventsList.push(event);
  }

  eventTitle: string = '';
  eventDescription: string = '';
  eventTime: string = '';
  eventDate: string = '';

  addEvent() {
    const newEvent = { date: this.todayDate, title: 'Novi događaj', description: 'Opis događaja', time: '12:00' };
    this.eventListAdd(newEvent);
  }

}