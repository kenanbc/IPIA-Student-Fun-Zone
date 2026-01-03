import { Component, computed, inject, OnInit } from '@angular/core';
import { StatsComponent } from '../stats-component/stats-component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BudgetService } from './budget.service';

@Component({
  selector: 'app-budget-tracker',
  imports: [StatsComponent, RouterLink, FormsModule],
  templateUrl: './budget-tracker.html',
  styleUrl: './budget-tracker.css',
})
export class BudgetTracker implements OnInit {

  transactionDescription = '';
  transactionAmount: number | null = null;
  transactionType: 'income' | 'expense' = 'expense';

  budgetStats = computed(() => [
    { label: 'Preostalo', value: this.budgetService.remaining(), unit: 'KM' },
    { label: 'Potrošeno', value: this.budgetService.spent(), unit: 'KM' },
    { label: 'Budžet', value: this.budgetService.budget(), unit: 'KM' },
    { label: 'Potrošeno', value: this.budgetService.spentPercent(), unit: '%' }
  ]);

   budgetService = inject(BudgetService);

  ngOnInit(): void {
    this.budgetService.loadData();
  }

  async addTransaction(): Promise<void> {
    if (!this.transactionDescription || !this.transactionAmount) return;

    await this.budgetService.addTransaction(
      this.transactionDescription,
      this.transactionAmount,
      this.transactionType
    );

    this.transactionDescription = '';
    this.transactionAmount = null;
    this.transactionType = 'expense';
  }
}
