import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-quiz',
  imports: [RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {

  checkAnswers() {
    let score = 0;
    const totalQuestions = 5;

    const answers = {
      prvoPitanje: 'hypertext',
      drugoPitanje: ['ul', 'ol', 'li'],
      trecePitanje: 'img',
      cetvrtoPitanje: ['href', 'source', 'alt'],
      petoPitanje: 'ahref'
    };

    const questionNames = ['prvoPitanje', 'drugoPitanje', 'trecePitanje', 'cetvrtoPitanje', 'petoPitanje'];
    
    for (const questionName of questionNames) {
      const correctAnswer = answers[questionName as keyof typeof answers];
      
      if (Array.isArray(correctAnswer)) {
        const checkedInputs = document.querySelectorAll(`input[name="${questionName}"]:checked`);
        const selectedIds = Array.from(checkedInputs).map(input => (input as HTMLInputElement).id);
        
        if (selectedIds.length === correctAnswer.length && 
            correctAnswer.every(answer => selectedIds.includes(answer))) {
          score++;
        }
      } else {
        const selectedOption = (document.querySelector(`input[name="${questionName}"]:checked`) as HTMLInputElement)?.id;
        if (selectedOption === correctAnswer) {
          score++;
        }
      }
    }
    
    alert(`Osvojili ste ${score} od ${totalQuestions} poena.`);
  }

}
