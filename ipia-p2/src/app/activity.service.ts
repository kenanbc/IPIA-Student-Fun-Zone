import { Injectable, signal } from '@angular/core';
import { collection,getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AuthService } from './auth';

export interface Activity {
  id?: string;
  type: 'sleep' | 'water' | 'budget' | 'reading' | 'focus' | 'calendar';
  description: string;
  date: Date;
  timestamp: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  activities = signal<Activity[]>([]);

  constructor(private authService: AuthService) {}

  async logActivity(type: Activity['type'], description: string): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    try {
      const activitiesRef = collection(db, `users/${user.uid}/activities`);
      await addDoc(activitiesRef, {
        type: type,
        description: description,
        date: new Date().toISOString(),
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Greška pri bilježenju aktivnosti:', error);
    }
  }

  async loadRecentActivities(count: number = 10): Promise<void> {
    const user = this.authService.user();
    if (!user) return;
    
    try {
      const activitiesRef = collection(db, `users/${user.uid}/activities`);
      const snapshot = await getDocs(activitiesRef);
      
      const activitiesList: Activity[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Activity data:', data);
        activitiesList.push({
          id: doc.id,
          type: data['type'],
          description: data['description'],
          date: new Date(data['date']),
          timestamp: data['timestamp']
        });
      });

      activitiesList.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
      const limitedActivities = activitiesList.slice(0, count);

      this.activities.set(limitedActivities);
    } catch (error) {
      console.error('Greška pri učitavanju aktivnosti:', error);
    }
  }

  getActivityIcon(type: Activity['type']): string {
    const icons: Record<Activity['type'], string> = {
      'sleep': '/sleep.png',
      'water': '/clean-water.png',
      'budget': '/budget.png',
      'reading': '/book.png',
      'focus': '/stopwatch.png',
      'calendar': '/schedule.png'
    };
    return icons[type] || '/logo.png';
  }
}
