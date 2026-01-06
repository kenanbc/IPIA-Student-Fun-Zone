import { Injectable, signal, inject } from '@angular/core';
import { Timestamp, setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from '../auth';
import { ActivityService } from '../activity.service';

export interface CalendarEvent {
  id?: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  timestamp: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private activityService = inject(ActivityService);

  eventsList = signal<CalendarEvent[]>([]);
  todayCount = signal<number>(0);
  upcomingCount = signal<number>(0);
  weekCount = signal<number>(0);
  monthCount = signal<number>(0);

  constructor(private authService: AuthService) {
    this.loadEvents();
  }

  async loadEvents(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    try {
      const eventsRef = collection(db, `users/${user.uid}/calendarEvents`);
      const snapshot = await getDocs(eventsRef);

      const events: CalendarEvent[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        events.push({
          id: doc.id,
          userId: data['userId'],
          title: data['title'],
          description: data['description'],
          date: data['date'],
          time: data['time'],
          timestamp: data['timestamp']
        });
      });

      this.eventsList.set(events);
      this.calculateStats();
    } catch (error) {
      console.error('Greška pri učitavanju događaja:', error);
    }
  }

  calculateStats(): void {
    const events = this.eventsList();
    const todayS = new Date().toISOString().split('T')[0];
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let todayC = 0;
    let upcomingC = 0;
    let weekC = 0;
    let monthC = 0;

    events.forEach(event => {
      const eventDate = new Date(event.date);

      if (event.date === todayS) {
        todayC++;
      }

      if (eventDate > now) {
        upcomingC++;
      }

      if (eventDate >= startOfWeek && eventDate <= endOfWeek) {
        weekC++;
      }

      if (eventDate >= startOfMonth && eventDate <= endOfMonth) {
        monthC++;
      }
    });

    this.todayCount.set(todayC);
    this.upcomingCount.set(upcomingC);
    this.weekCount.set(weekC);
    this.monthCount.set(monthC);
  }

  async addEvent(title: string, description: string, date: string, time: string): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    try {
      const eventId = Date.now().toString();
      const docRef = doc(db, `users/${user.uid}/calendarEvents/${eventId}`);

      await setDoc(docRef, {
        userId: user.uid,
        title: title,
        description: description,
        date: date,
        time: time,
        timestamp: Timestamp.now()
      });

      await this.activityService.logActivity('calendar', `Dodat događaj: "${title}" (${date} u ${time})`);
      await this.loadEvents();
    } catch (error) {
      console.error('Greška pri dodavanju događaja:', error);
      throw error;
    }
  }


  getTodayEvents(): CalendarEvent[] {
    const today = new Date().toISOString().split('T')[0];
    return this.eventsList().filter(event => event.date === today);
  }
}
