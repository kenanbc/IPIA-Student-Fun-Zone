import { Injectable, signal } from '@angular/core';
import { Timestamp, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
  
  lastNightHours = signal<number>(0);
  weeklyAverage = signal<number>(0);
  bedTime = signal<string>('--:--');
  wakeTime = signal<string>('--:--');
  weekData = signal<number[]>([0, 0, 0, 0, 0, 0, 0]);

  constructor(private authService: AuthService) {
    this.loadWeekData();
  }

  async saveSleep(bedTime: string, wakeTime: string): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const hours = this.calculateHours(bedTime, wakeTime);

    try {
      const docRef = doc(db, `users/${user.uid}/sleepData/${today}`);
      await setDoc(docRef, {
        bedTime: bedTime,
        wakeTime: wakeTime,
        hours: hours,
        date: today,
        timestamp: Timestamp.now()
      });

      await this.loadWeekData();
    } catch (error) {
      console.error('Greska pri spremanju sna:', error);
    }
  }

  calculateHours(bedTime: string, wakeTime: string): number {
    const [bedH, bedM] = bedTime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);

    let bedMins = bedH * 60 + bedM;
    let wakeMins = wakeH * 60 + wakeM;

    if (wakeMins < bedMins) {
      wakeMins += 24 * 60;
    }

    const diff = wakeMins - bedMins;
    return Math.round((diff / 60) * 10) / 10;
  }

  async loadWeekData(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    try {
      const weekHours: number[] = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const docRef = doc(db, `users/${user.uid}/sleepData/${dateStr}`);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          weekHours.push(data['hours'] || 0);
        } else {
          weekHours.push(0);
        }
      }

      this.weekData.set(weekHours);

      const todayStr = today.toISOString().split('T')[0];
      const todayDoc = doc(db, `users/${user.uid}/sleepData/${todayStr}`);
      const todaySnap = await getDoc(todayDoc);

      if (todaySnap.exists()) {
        const data = todaySnap.data();
        this.lastNightHours.set(data['hours'] || 0);
        this.bedTime.set(data['bedTime'] || '--:--');
        this.wakeTime.set(data['wakeTime'] || '--:--');
      } else {
        this.lastNightHours.set(0);
        this.bedTime.set('--:--');
        this.wakeTime.set('--:--');
      }

      const validHours = weekHours.filter(h => h > 0);
      if (validHours.length > 0) {
        const avg = validHours.reduce((a, b) => a + b, 0) / validHours.length;
        this.weeklyAverage.set(Math.round(avg * 10) / 10);
      } else {
        this.weeklyAverage.set(0);
      }

    } catch (error) {
      console.error('Greska pri ucitavanju podataka:', error);
    }
  }
}
