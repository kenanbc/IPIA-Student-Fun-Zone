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

  async getLastUsedByType(): Promise<Map<Activity['type'], string>> {
    const user = this.authService.user();
    const lastUsedMap = new Map<Activity['type'], string>();
    
    if (!user) return lastUsedMap;

    try {
      const activitiesRef = collection(db, `users/${user.uid}/activities`);
      const snapshot = await getDocs(activitiesRef);
      
      const activitiesByType = new Map<Activity['type'], Activity>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const activity: Activity = {
          id: doc.id,
          type: data['type'],
          description: data['description'],
          date: new Date(data['date']),
          timestamp: data['timestamp']

        };

        const existing = activitiesByType.get(activity.type);
        if (!existing || activity.timestamp.toMillis() > existing.timestamp.toMillis()) {
          activitiesByType.set(activity.type, activity);
        }
      });

      activitiesByType.forEach((activity, type) => {
        const date = activity.timestamp.toDate();
        const formatted = date.toLocaleString('bs-BA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        lastUsedMap.set(type, formatted);
      });

    } catch (error) {
      console.error('Greška pri dohvatanju zadnjih aktivnosti:', error);
    }

    return lastUsedMap;
  }

  getActivityIcon(type: Activity['type']): string {
    const icons: Record<Activity['type'], string> = {
      'sleep': 'sleep.png',
      'water': 'clean-water.png',
      'budget': 'budget.png',
      'reading': 'book.png',
      'focus': 'stopwatch.png',
      'calendar': 'schedule.png'
    };
    return icons[type] || 'logo.png';
  }
}
