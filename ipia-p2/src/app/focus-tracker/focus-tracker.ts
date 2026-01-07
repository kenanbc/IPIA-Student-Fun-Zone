import { Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { StatsComponent } from '../stats-component/stats-component';
import { RouterLink } from '@angular/router';
import { FocusService } from './focus.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-focus-tracker',
  imports: [StatsComponent, RouterLink, CommonModule],
  templateUrl: './focus-tracker.html',
  styleUrl: './focus-tracker.css',
})
export class FocusTracker implements OnInit, OnDestroy {
  
  timeOptions = [15, 25, 45, 60];
  selectedTime = signal<number>(25);
  remainingSeconds = signal<number>(25 * 60);
  isRunning = signal<boolean>(false);

  private timerInterval: any = null;

  constructor(public focusService: FocusService) {}

  ngOnInit(): void {
    this.focusService.loadTodayData();
    this.focusService.loadAllTimeStats();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  focusStats = computed(() => [
    { label: 'Sesija danas', value: this.focusService.todaySession() },
    { label: 'Danas ukupno', value: this.focusService.todayTotalMinutes(), unit: 'min' },
    { label: 'Ukupno sesija', value: this.focusService.totalSessions() },
    { label: 'Prosječno', value: this.focusService.averageMinutes(), unit: 'min' }
  ]);

  get displayTime(): string {
    const minutes = Math.floor(this.remainingSeconds() / 60);
    const seconds = this.remainingSeconds() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  selectTime(minutes: number): void {
    if (this.isRunning()) return;
    
    this.selectedTime.set(minutes);
    this.remainingSeconds.set(minutes * 60);
  }

  startTimer(): void {
    if (this.isRunning()) return;
    
    this.isRunning.set(true);
    
    this.timerInterval = setInterval(() => {
      const current = this.remainingSeconds();
      
      if (current <= 0) {
        this.completeSession();
      } else {
        this.remainingSeconds.set(current - 1);
      }
    }, 1000);
  }


  pauseTimer(): void {
    this.isRunning.set(false);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  stopTimer(): void {
    this.pauseTimer();
  }


  resetTimer(): void {
    this.stopTimer();
    this.remainingSeconds.set(this.selectedTime() * 60);
  }

  async completeSession(): Promise<void> {
    this.stopTimer();
    
    const completedMinutes = this.selectedTime();
    
    try {
      await this.focusService.saveSession(completedMinutes);
      alert(`Bravo! Završili ste ${completedMinutes} minuta fokusa! 🎉`);
    } catch (error) {
      console.error('Greška pri spremanju sesije:', error);
    }
    
    this.remainingSeconds.set(this.selectedTime() * 60);
  }

  toggleTimer(): void {
    if (this.isRunning()) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }
}
