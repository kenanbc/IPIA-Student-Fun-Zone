// Dodaj zadatak
const modal = document.getElementById("taskModal");
const taskInput = document.getElementById("taskInput");

document.getElementById("addTaskBtn").addEventListener("click", () => {
    console.log("Open modal");
    modal.style.display = "block";
    taskInput.value = "";
    taskInput.focus();
});

// Handle modal buttons
document.getElementById("modalAdd").addEventListener("click", () => {
    console.log("Add button clicked");
    let text = taskInput.value.trim();
    console.log("Task text:", text);
    
    if (text === "") {
        console.log("Empty text, returning");
        return;
    }

    const task = createTask(text);
    const todoList = document.querySelector('[data-status="todo"] .taskList');
    console.log("Todo list element:", todoList);
    
    if (todoList) {
        todoList.appendChild(task);
        console.log("Task added successfully");
    } else {
        console.error("Todo list not found!");
    }

    modal.style.display = "none";
});

document.getElementById("modalCancel").addEventListener("click", () => {
    modal.style.display = "none";
});


// Kreiraj novi zadatak
function createTask(text) {
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

// Handle Drag & Drop
document.querySelectorAll(".taskList").forEach(list => {
    list.addEventListener("dragover", e => {
        e.preventDefault();
        const dragging = document.querySelector(".dragging");
        list.appendChild(dragging);
    });
});

const clearModal = document.getElementById("clearModal");

document.getElementById("clearBoardBtn").addEventListener("click", () => {
    clearModal.style.display = "block";
});

document.getElementById("clearYes").addEventListener("click", () => {
    document.querySelectorAll(".taskList").forEach(list => list.innerHTML = "");
    clearModal.style.display = "none";
});


document.getElementById("clearNo").addEventListener("click", () => {
    clearModal.style.display = "none";
});


window.addEventListener("click", e => {
    if (e.target === clearModal) {
        clearModal.style.display = "none";
    }
});


document.getElementById("saveBoardBtn").addEventListener("click", () => {
    html2canvas(document.body).then(canvas => {
        const link = document.createElement("a");
        link.download = "kanban_board.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});


const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
document.body.appendChild(script);

window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
    if (e.target === emailModal) {
        emailModal.style.display = "none";
    }
});

const savePDFBtn = document.getElementById('savePDFBtn');
savePDFBtn.addEventListener('click', () => {
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

const emailBtn = document.getElementById('emailBtn');
const emailModal = document.getElementById('emailModal');
const emailInput = document.getElementById('emailInput');
const sendEmailBtn = document.getElementById('sendEmailBtn');
const cancelEmailBtn = document.getElementById('cancelEmailBtn');

emailBtn.addEventListener('click', () => {
    emailModal.style.display = 'block';
    emailInput.value = '';
});

cancelEmailBtn.addEventListener('click', () => {
    emailModal.style.display = 'none';
});

sendEmailBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (email === '' || !email.includes('@')) {
        alert('Molimo unesite validnu email adresu!');
        return;
    }
    
    const subject = 'Kanban Board - Student Fun Zone';
    const body = 'Pogledajte moj Kanban Board!';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailModal.style.display = 'none';
});