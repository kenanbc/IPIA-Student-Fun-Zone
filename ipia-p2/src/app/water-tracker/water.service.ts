import { Injectable, signal } from '@angular/core';
import { Timestamp, setDoc, doc, getDoc } from 'firebase/firestore';
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
    const today = new Date().toISOString().split('T')[0];
    try {
      const docRef = doc(db, `users/${user.uid}/waterIntakes/${today}`);
      const docSnap = await getDoc(docRef);
      
      let currentTotalMl = 0;
      let currentGlasses = 0;
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        currentTotalMl = data['totalMl'] || 0;
        currentGlasses = data['glasses'] || 0;
      }
      
      await setDoc(docRef, {
        userId: user.uid,
        totalMl: currentTotalMl + amount,
        glasses: currentGlasses + 1,
        date: today,
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
      const q = doc(
        db,
        `users/${user.uid}/waterIntakes/${today}`
      );

      const snap = await getDoc(q);

      let totalMl = 0;
      let glasses = 0;

      if (snap.exists()) {
        const data = snap.data();

        totalMl = data['totalMl'] || 0;
        glasses = data['glasses'] || 0;
      }

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
      const q = doc(db, `users/${user.uid}/trackers/water`);
      const querySnapshot = await getDoc(q);
      if (querySnapshot.exists()) {
        const data = querySnapshot.data() as DailyGoal;
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
      await setDoc(doc(db, `users/${user.uid}/trackers/water`), {
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

  async resetToday(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    try {
      const docRef = doc(db, `users/${user.uid}/waterIntakes/${today}`);
      await setDoc(docRef, {
        userId: user.uid,
        totalMl: 0,
        glasses: 0,
        date: today,
        timestamp: Timestamp.now()
      });
      
      this.todayLiters.set(0);
      this.glassCount.set(0);
      this.progress.set(0);
    } catch (error) {
      console.error('Greška pri resetovanju:', error);
    }
  }
}
