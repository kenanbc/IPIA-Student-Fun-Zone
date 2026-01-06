import { Injectable, signal, inject } from '@angular/core';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from '../auth';
import { ActivityService } from '../activity.service';

export interface Transaction {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private activityService = inject(ActivityService);

  transactions = signal<Transaction[]>([]);
  budget = signal<number>(0);
  spent = signal<number>(0);
  remaining = signal<number>(0);
  spentPercent = signal<number>(0);

  constructor(private authService: AuthService) {
    this.loadData();
  }

  private getMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  async loadData(): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    const monthKey = this.getMonthKey();

    try {
      const docRef = doc(db, `users/${user.uid}/budget/${monthKey}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        this.transactions.set(data['transactions'] || []);
        this.calculateStats();
      } else {
        this.transactions.set([]);
        this.budget.set(0);
        this.spent.set(0);
        this.remaining.set(0);
        this.spentPercent.set(0);
      }
    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
    }
  }

  private calculateStats(): void {
    const trans = this.transactions();
    
    const totalIncome = trans
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = trans
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.budget.set(totalIncome);
    this.spent.set(totalExpense);
    this.remaining.set(totalIncome - totalExpense);
    
    const percent = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
    this.spentPercent.set(percent);
  }

  async addTransaction(description: string, amount: number, type: 'income' | 'expense'): Promise<void> {
    const user = this.authService.user();
    if (!user) return;

    const monthKey = this.getMonthKey();
    const now = new Date();
    const timeString = now.toLocaleString('bs-BA', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const newTransaction: Transaction = {
      description,
      amount,
      type,
      time: timeString
    };

    const updatedTransactions = [...this.transactions(), newTransaction];

    try {
      const docRef = doc(db, `users/${user.uid}/budget/${monthKey}`);
      await setDoc(docRef, {
        userId: user.uid,
        transactions: updatedTransactions,
        month: monthKey,
        timestamp: Timestamp.now()
      });

      const typeText = type === 'income' ? 'Prihod' : 'Trošak';
      await this.activityService.logActivity('budget', `${typeText}: ${description} (${amount} KM)`);
      this.transactions.set(updatedTransactions);
      this.calculateStats();
    } catch (error) {
      console.error('Greška pri dodavanju transakcije:', error);
    }
  }
}
