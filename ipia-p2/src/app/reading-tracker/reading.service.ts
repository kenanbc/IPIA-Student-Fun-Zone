import { Injectable, signal, inject } from '@angular/core';
import { Timestamp, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from '../auth';
import { ActivityService } from '../activity.service';

export interface Book {
  title: string;
  pages: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  private activityService = inject(ActivityService);

  books = signal<Book[]>([]);
  totalPages = signal<number>(0);
  booksRead = signal<number>(0);
  yearlyGoal = signal<number>(20);
  avgReadingTime = signal<number>(0);

  constructor(private authService: AuthService) {
    this.loadData();
  }

  async addBook(title: string, pages: number): Promise<void> {
    const user = this.authService.user();
    if (!user || !title || pages <= 0) return;

    try {
      const docRef = doc(db, `users/${user.uid}/reading/data`);
      const docSnap = await getDoc(docRef);

      let currentBooks: Book[] = [];

      if (docSnap.exists()) {
        const data = docSnap.data();
        currentBooks = data['books'] || [];
      }

      const newBook: Book = {
        title: title,
        pages: pages,
        date: new Date()
      };

      currentBooks.push(newBook);

      await setDoc(docRef, {
        userId: user.uid,
        books: currentBooks,
        yearlyGoal: this.yearlyGoal(),
        timestamp: Timestamp.now()
      });

      await this.activityService.logActivity('reading', `Pročitana knjiga: "${title}" (${pages} stranica)`);
      await this.loadData();
    } catch (error) {
      console.error('Greška pri dodavanju knjige:', error);
    }
  }

  async setYearlyGoal(goal: number): Promise<void> {
    const user = this.authService.user();
    if (!user || goal <= 0) return;

    try {
      const docRef = doc(db, `users/${user.uid}/reading/data`);
      const docSnap = await getDoc(docRef);

      let currentBooks: Book[] = [];

      if (docSnap.exists()) {
        const data = docSnap.data();
        currentBooks = data['books'] || [];
      }

      await setDoc(docRef, {
        userId: user.uid,
        books: currentBooks,
        yearlyGoal: goal,
        timestamp: Timestamp.now()
      });

      this.yearlyGoal.set(goal);
    } catch (error) {
      console.error('Greška pri postavljanju cilja:', error);
    }
  }

  async loadData(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    try {
      const docRef = doc(db, `users/${user.uid}/reading/data`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const booksData = data['books'] || [];
        
        const books: Book[] = booksData.map((b: any) => ({
          title: b.title,
          pages: b.pages,
          date: b.date?.toDate ? b.date.toDate() : new Date(b.date)
        }));

        this.books.set(books);
        this.booksRead.set(books.length);
        const total = books.reduce((sum, book) => sum + book.pages, 0);
        this.totalPages.set(total);
        this.avgReadingTime.set(Math.round((total * 2) / 60));
        this.yearlyGoal.set(data['yearlyGoal'] || 20);
      } else {
        this.books.set([]);
        this.booksRead.set(0);
        this.totalPages.set(0);
        this.avgReadingTime.set(0);
      }
    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
    }
  }
}
