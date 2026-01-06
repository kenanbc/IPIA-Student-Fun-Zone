import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-component',
  imports: [],
  templateUrl: './stats-component.html',
  styleUrl: './stats-component.css',
})
export class StatsComponent {
  @Input() stats: { label: string; value: number | string; unit?: string }[] = [];
}
