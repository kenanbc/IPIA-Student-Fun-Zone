import { Injectable, signal } from '@angular/core';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from '../auth';

export interface WaterIntake {
  userId: string;
  amount: number;
  date: Date;
  timestamp: Timestamp;
}

export interface DailyGoal {
  userId: string;
  goalLiters: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WaterService {
  
  todayLiters = signal<number>(0);
  glassCount = signal<number>(0);
  progress = signal<number>(0);
  dailyGoal = signal<number>(1.5); //po default 1.5 l

  constructor(private authService: AuthService) {
    this.loadTodayData();
    this.loadDailyGoal();
  }

  async addGlass(): Promise<void> {
    const user = this.authService.user();
    const amount = 250;
    
    if(!user) return;

    try {
      await addDoc(collection(db, 'waterIntakes'), {
        userId: user.uid,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        timestamp: Timestamp.now()
      });

      await this.loadTodayData();
    } catch (error) {
      console.error('Dogodila se greska', error);
      throw error;
    }
  }

  async loadTodayData(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const q = query(
        collection(db, 'waterIntakes'),
        where('userId', '==', user.uid),
        where('date', '==', today)
      );

      const querySnapshot = await getDocs(q);
      let totalMl = 0;
      let glasses = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data() as WaterIntake;
        totalMl += data.amount;
        glasses++;
      });

      const liters = totalMl / 1000;
      this.todayLiters.set(Number(liters.toFixed(2)));
      this.glassCount.set(glasses);
      
      const progressValue = (liters / this.dailyGoal()) * 100;
      this.progress.set(Math.min(Math.round(progressValue), 100));
    } catch (error) {
      console.error('Dogodila se greska', error);
    }
  }

  async loadDailyGoal(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    try {
      const q = query(
        collection(db, 'dailyGoals'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as DailyGoal;
        this.dailyGoal.set(data.goalLiters);
      }
    } catch (error) {
      console.error('Greška pri učitavanju dnevnog cilja:', error);
    }
  }

  async setDailyGoal(goalLiters: number): Promise<void> {
    const user = this.authService.user();
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'dailyGoals'), {
        userId: user.uid,
        goalLiters: goalLiters,
        date: Timestamp.now()
      });

      this.dailyGoal.set(goalLiters);
      
      const progressValue = (this.todayLiters() / goalLiters) * 100;
      this.progress.set(Math.min(Math.round(progressValue), 100));
    } catch (error) {
      console.error('Dogodila se greska', error);
      throw error;
    }
  }

  resetToday(): void {
    this.todayLiters.set(0);
    this.glassCount.set(0);
    this.progress.set(0);
  }
}
