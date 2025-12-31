import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

declare const html2pdf: any;

@Component({
  selector: 'app-bingo',
  imports: [RouterLink],
  templateUrl: './bingo.html',
  styleUrl: './bingo.css',
})
export class Bingo {

  generatePDF(): void {
    const element = document.getElementById('contentToConvert');
    if (!element) return;
    
    const options = {
      margin: 0.5,
      filename: 'Bingo.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
  }

  openEmailModal(): void {
    const modal = document.getElementById('emailModal') as HTMLElement;
    const input = document.getElementById('emailInput') as HTMLInputElement;
    if (modal) modal.style.display = 'block';
    if (input) input.value = '';
  }

  closeEmailModal(): void {
    const modal = document.getElementById('emailModal') as HTMLElement;
    if (modal) modal.style.display = 'none';
  }

  sendEmail(): void {
    const emailInput = document.getElementById('emailInput') as HTMLInputElement;
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    if (email === '' || !email.includes('@')) {
      alert('Molimo unesite validnu email adresu!');
      return;
    }
    
    const subject = 'Bingo Challenge - Student Fun Zone';
    const body = 'Pogledajte moj Bingo Challenge!\n\nU ovoj igri potrebno je skupiti 5 potpisa zaredom.';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.closeEmailModal();
  }

  onModalClick(event: MouseEvent): void {
    const modal = document.getElementById('emailModal');
    if (event.target === modal) {
      this.closeEmailModal();
    }
  }

}
