import { Injectable, signal, inject } from '@angular/core';
import { Timestamp, setDoc, doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from '../auth';
import { ActivityService } from '../activity.service';

export interface FocusSession {
  userId: string;
  duration: number;
  date: string;
  timestamp: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class FocusService {
  
  private activityService = inject(ActivityService);
  
  todaySession = signal<number>(0);
  todayTotalMinutes = signal<number>(0);
  totalSessions = signal<number>(0);
  totalMinutes = signal<number>(0);
  averageMinutes = signal<number>(0);

  constructor(private authService: AuthService) {
    this.loadTodayData();
    this.loadAllTimeStats();
  }

  async saveSession(durationMinutes: number): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const sessionId = `${today}_${Date.now()}`;

    try {
      const sessionRef = doc(db, `users/${user.uid}/focusSessions/${sessionId}`);
      await setDoc(sessionRef, {
        userId: user.uid,
        duration: durationMinutes,
        date: today,
        timestamp: Timestamp.now()
      });

      const dailyRef = doc(db, `users/${user.uid}/focusDaily/${today}`);
      const dailySnap = await getDoc(dailyRef);

      let currentSessions = 0;
      let currentMinutes = 0;

      if (dailySnap.exists()) {
        const data = dailySnap.data();
        currentSessions = data['sessions'] || 0;
        currentMinutes = data['totalMinutes'] || 0;
      }

      await setDoc(dailyRef, {
        userId: user.uid,
        sessions: currentSessions + 1,
        totalMinutes: currentMinutes + durationMinutes,
        date: today,
        timestamp: Timestamp.now()
      });

      await this.activityService.logActivity('focus', `Završena fokus sesija (${durationMinutes} min)`);
      await this.loadTodayData();
      await this.loadAllTimeStats();
    } catch (error) {
      console.error('Greška pri spremanju sesije:', error);
      throw error;
    }
  }

  async loadTodayData(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const dailyRef = doc(db, `users/${user.uid}/focusDaily/${today}`);
      const dailySnap = await getDoc(dailyRef);

      if (dailySnap.exists()) {
        const data = dailySnap.data();
        this.todaySession.set(data['sessions'] || 0);
        this.todayTotalMinutes.set(data['totalMinutes'] || 0);
      } else {
        this.todaySession.set(0);
        this.todayTotalMinutes.set(0);
      }
    } catch (error) {
      console.error('Greška pri učitavanju današnjih podataka:', error);
    }
  }

  async loadAllTimeStats(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    try {
      const sessionsRef = collection(db, `users/${user.uid}/focusSessions`);
      const q = query(sessionsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      let total = 0;
      let totalMins = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total++;
        totalMins += data['duration'] || 0;
      });

      this.totalSessions.set(total);
      this.totalMinutes.set(totalMins);
      
      if (total > 0) {
        this.averageMinutes.set(Math.round(totalMins / total));
      } else {
        this.averageMinutes.set(0);
      }
    } catch (error) {
      console.error('Greška pri učitavanju ukupne statistike:', error);
    }
  }

  
}
