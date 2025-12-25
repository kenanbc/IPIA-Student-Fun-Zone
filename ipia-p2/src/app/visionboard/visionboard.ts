import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-vision-board',
  imports: [CommonModule, RouterLink],
  templateUrl: './visionboard.html',
  styleUrls: ['./visionboard.css']
})
export class VisionBoardComponent {

  items: BoardItem[] = [];

  colors = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6'];

  images = [
    'slika1.png',
    'slika2.png',
    'slika3.png',
    'slika4.png'
  ];

  quotes = [
    'Education is the most powerful weapon...',
    'Learning never exhausts the mind...',
    'The more you read...'
  ];

  addNote() {
    this.items.push({
      id: Date.now(),
      type: 'note',
      content: 'TODO...',
      left: Math.random() * 400,
      top: Math.random() * 300,
      color: this.randomColor()
    });
  }

  addImage() {
    this.items.push({
      id: Date.now(),
      type: 'image',
      content: this.randomItem(this.images),
      left: Math.random() * 400,
      top: Math.random() * 300,
    });
  }

  addQuote() {
    this.items.push({
      id: Date.now(),
      type: 'quote',
      content: this.randomItem(this.quotes),
      left: Math.random() * 400,
      top: Math.random() * 300,
    });
  }

  remove(id: number) {
    this.items = this.items.filter(i => i.id !== id);
  }

  randomItem(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  randomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
}
