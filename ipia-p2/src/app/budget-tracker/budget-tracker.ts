import { Component, computed } from '@angular/core';
import { StatsComponent } from '../stats-component/stats-component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget-tracker',
  imports: [StatsComponent, RouterLink, FormsModule],
  templateUrl: './budget-tracker.html',
  styleUrl: './budget-tracker.css',
})
export class BudgetTracker {

  transactions: Array<{ description: string; amount: number; type: 'income' | 'expense'; time: string }> = [];

  transactionDescription = '';
  transactionAmount: number | null = null
  transactionType: 'income' | 'expense' = 'expense';

  budgetStats = computed(() => [
  { label: 'Preostalo', value: 0, unit: 'KM' },
  { label: 'Potrošeno', value: 0, unit: 'KM' },
  { label: 'Budžet', value: 0, unit: 'KM' },
  { label: 'Potrošeno', value: 0, unit: '%' }
]);

addTransaction(): void {
  
}
}
