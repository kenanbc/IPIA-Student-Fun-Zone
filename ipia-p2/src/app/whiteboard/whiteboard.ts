import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
declare const html2pdf: any;

@Component({
  selector: 'app-whiteboard',
  imports: [RouterLink],
  templateUrl: './whiteboard.html',
  styleUrl: './whiteboard.css',
})
export class Whiteboard implements AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private colorPicker!: HTMLInputElement;
  private brushSize!: HTMLInputElement;
  private eraserBtn!: HTMLButtonElement;
  
  private drawing = false;
  private currentColor = '#345aaa';
  private isErasing = false;

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('board') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
    this.brushSize = document.getElementById('brushSize') as HTMLInputElement;
    this.eraserBtn = document.getElementById('eraserBtn') as HTMLButtonElement;
    
    this.currentColor = this.colorPicker.value;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mouseup', (e) => this.endDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    
    this.canvas.addEventListener('touchstart', (e) => this.startDraw(e));
    this.canvas.addEventListener('touchmove', (e) => {
      this.draw(e);
      e.preventDefault();
    });
    this.canvas.addEventListener('touchend', (e) => this.endDraw(e));
    
    this.colorPicker.addEventListener('input', () => {
      this.currentColor = this.colorPicker.value;
      this.isErasing = false;
    });
  }
  
  private startDraw(e: MouseEvent | TouchEvent): void {
    this.drawing = true;
    this.draw(e);
  }
  
  private endDraw(e: MouseEvent | TouchEvent): void {
    this.drawing = false;
    this.ctx.beginPath();
  }
  
  private draw(e: MouseEvent | TouchEvent): void {
    if (!this.drawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const clientX = (e as MouseEvent).clientX || (e as TouchEvent).touches?.[0]?.clientX;
    const clientY = (e as MouseEvent).clientY || (e as TouchEvent).touches?.[0]?.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    this.ctx.lineWidth = parseInt(this.brushSize.value);
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.isErasing ? '#FFFFFF' : this.currentColor;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  toggleEraser(): void {
    this.isErasing = !this.isErasing;
    this.eraserBtn.textContent = this.isErasing ? 'Piši' : 'Briši';
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  saveImage(): void {
    const image = this.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'moj_crtez.png';
    link.click();
  }

  savePDF(): void {
    const element = document.body;
    const options = {
      margin: 0.5,
      filename: 'whiteboard.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(options).from(element).save();
  }

  openEmailModal(): void {
    const emailModal = document.getElementById('emailModal') as HTMLElement;
    const emailInput = document.getElementById('emailInput') as HTMLInputElement;
    if (emailModal) emailModal.style.display = 'block';
    if (emailInput) emailInput.value = '';
  }

  closeEmailModal(): void {
    const emailModal = document.getElementById('emailModal') as HTMLElement;
    if (emailModal) emailModal.style.display = 'none';
  }

  sendEmail(): void {
    const emailInput = document.getElementById('emailInput') as HTMLInputElement;
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    if (email === '' || !email.includes('@')) {
      alert('Molimo unesite validnu email adresu!');
      return;
    }
    
    const subject = 'Whiteboard - Student Fun Zone';
    const body = 'Pogledajte moj interaktivni Whiteboard crtež!';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.closeEmailModal();
  }

  onModalClick(event: MouseEvent): void {
    const emailModal = document.getElementById('emailModal');
    if (event.target === emailModal) {
      this.closeEmailModal();
    }
  }
}
