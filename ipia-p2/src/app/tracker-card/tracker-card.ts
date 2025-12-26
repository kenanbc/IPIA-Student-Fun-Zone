import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tracker-card',
  imports: [RouterLink],
  templateUrl: './tracker-card.html',
  styleUrl: './tracker-card.css',
})
export class TrackerCard {
  @Input() tracker!: { name: string; description: string; icon: string; route: string };
}
