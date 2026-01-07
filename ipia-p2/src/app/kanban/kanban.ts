import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from "@angular/router";

declare var html2canvas: any;
declare var html2pdf: any;

@Component({
  selector: 'app-kanban',
  imports: [RouterLink],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban implements AfterViewInit {

  modal: HTMLElement | null = null;
  taskInput: HTMLInputElement | null = null;
  clearModal: HTMLElement | null = null;
  emailModal: HTMLElement | null = null;
  emailInput: HTMLInputElement | null = null;

  ngAfterViewInit(): void {
    this.modal = document.getElementById("taskModal");
    this.taskInput = document.getElementById("taskInput") as HTMLInputElement;
    this.clearModal = document.getElementById("clearModal");
    this.emailModal = document.getElementById("emailModal");
    this.emailInput = document.getElementById("emailInput") as HTMLInputElement;

    this.setupAddTask();
    this.setupClearBoard();
    this.setupSaveBoard();
    this.setupSavePDF();
    this.setupEmail();
    this.setupDragDrop();
    this.setupWindowClick();
    this.loadScript();
  }

  setupAddTask(): void {
    document.getElementById("addTaskBtn")?.addEventListener("click", () => {
      if (this.modal) {
        this.modal.style.display = "block";
      }
      if (this.taskInput) {
        this.taskInput.value = "";
        this.taskInput.focus();
      }
    });

    document.getElementById("modalAdd")?.addEventListener("click", () => {
      let text = this.taskInput?.value.trim() || "";
      if (text === "") return;

      const task = this.createTask(text);
      const todoList = document.querySelector('[data-status="todo"] .taskList');
      if (todoList) {
        todoList.appendChild(task);
      }

      if (this.modal) {
        this.modal.style.display = "none";
      }
    });

    document.getElementById("modalCancel")?.addEventListener("click", () => {
      if (this.modal) {
        this.modal.style.display = "none";
      }
    });
  }

  createTask(text: string): HTMLElement {
    const task = document.createElement("div");
    task.classList.add("task");
    task.textContent = text;
    task.draggable = true;

    task.addEventListener("dragstart", () => {
      task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
      task.classList.remove("dragging");
    });

    return task;
  }

  setupDragDrop(): void {
    document.querySelectorAll(".taskList").forEach(list => {
      list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        if (dragging) {
          list.appendChild(dragging);
        }
      });
    });
  }

  setupClearBoard(): void {
    document.getElementById("clearBoardBtn")?.addEventListener("click", () => {
      if (this.clearModal) {
        this.clearModal.style.display = "block";
      }
    });

    document.getElementById("clearYes")?.addEventListener("click", () => {
      document.querySelectorAll(".taskList").forEach(list => list.innerHTML = "");
      if (this.clearModal) {
        this.clearModal.style.display = "none";
      }
    });

    document.getElementById("clearNo")?.addEventListener("click", () => {
      if (this.clearModal) {
        this.clearModal.style.display = "none";
      }
    });
  }

  setupSaveBoard(): void {
    document.getElementById("saveBoardBtn")?.addEventListener("click", () => {
      html2canvas(document.body).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement("a");
        link.download = "kanban_board.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  }

  loadScript(): void {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    document.body.appendChild(script);
  }

  setupWindowClick(): void {
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        if (this.modal) {
          this.modal.style.display = "none";
        }
      }
      if (e.target === this.clearModal) {
        if (this.clearModal) {
          this.clearModal.style.display = "none";
        }
      }
      if (e.target === this.emailModal) {
        if (this.emailModal) {
          this.emailModal.style.display = "none";
        }
      }
    });
  }

  setupSavePDF(): void {
    document.getElementById('savePDFBtn')?.addEventListener('click', () => {
      const element = document.body;
      const options = {
        margin: 0.5,
        filename: 'kanban.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
      html2pdf().set(options).from(element).save();
    });
  }

  setupEmail(): void {
    document.getElementById('emailBtn')?.addEventListener('click', () => {
      if (this.emailModal) {
        this.emailModal.style.display = 'block';
      }
      if (this.emailInput) {
        this.emailInput.value = '';
      }
    });

    document.getElementById('cancelEmailBtn')?.addEventListener('click', () => {
      if (this.emailModal) {
        this.emailModal.style.display = 'none';
      }
    });

    document.getElementById('sendEmailBtn')?.addEventListener('click', () => {
      const email = this.emailInput?.value.trim() || '';
      if (email === '' || !email.includes('@')) {
        alert('Molimo unesite validnu email adresu!');
        return;
      }

      const subject = 'Kanban Board - Student Fun Zone';
      const body = 'Pogledajte moj Kanban Board!';

      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (this.emailModal) {
        this.emailModal.style.display = 'none';
      }
    });
  }
}
