const board = document.getElementById("board");
const addNoteBtn = document.getElementById("addNoteBtn");
const addImageBtn = document.getElementById("addImageBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

const colors = ["color1", "color2", "color3", "color4", "color5", "color6"];

const sampleImages = [
  "slike/slika1.png",
  "slike/slika2.png",
  "slike/slika3.png",
  "slike/slika4.png"
];

const sampleQuotes = [
  "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. – B.B. King",
  "An investment in knowledge pays the best interest. – Benjamin Franklin",
  "Education is not the learning of facts, but the training of the mind to think. – Albert Einstein",
  "The roots of education are bitter, but the fruit is sweet. – Aristotle",
  "Develop a passion for learning. If you do, you will never cease to grow. – Anthony J. D'Angelo",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go. – Dr. Seuss",
  "Learning never exhausts the mind. – Leonardo da Vinci"
];

function makeDraggable(el) {
  let offsetX, offsetY;

  const delBtn = document.createElement("button");
  delBtn.textContent = "x";
  delBtn.className = "delete-btn";
  el.appendChild(delBtn);


  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    el.remove();
  });

  el.addEventListener("mousedown", dragStart);

  function dragStart(e) {
    if (e.target === delBtn) return;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
  }

  function drag(e) {
    e.preventDefault();
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
  }

  function dragEnd() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", dragEnd);
  }
}

addNoteBtn.addEventListener("click", () => {
  const note = document.createElement("div");
  note.className = "note " + colors[Math.floor(Math.random() * colors.length)];
  note.contentEditable = "true";
  note.style.left = Math.random() * 500 + "px";
  note.style.top = Math.random() * 300 + "px";
  note.textContent = "TODO...";
  makeDraggable(note);
  board.appendChild(note);
});

addImageBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className = "pinned-img";
  div.style.left = Math.random() * 400 + "px";
  div.style.top = Math.random() * 250 + "px";
  const img = document.createElement("img");
  img.src = sampleImages[Math.floor(Math.random() * sampleImages.length)];
  div.appendChild(img);
  makeDraggable(div);
  board.appendChild(div);
});

addQuoteBtn.addEventListener("click", () => {
  const q = document.createElement("div");
  q.className = "quote";
  q.textContent = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
  q.style.left = Math.random() * 400 + "px";
  q.style.top = Math.random() * 250 + "px";
  q.contentEditable = "true";
  makeDraggable(q);
  board.appendChild(q);
});

saveBtn.addEventListener("click", saveBoard);

function saveBoard() {
  const items = [];
  document.querySelectorAll("#board > div").forEach((el) => {
    const data = {
      type: el.classList.contains("note")
        ? "note"
        : el.classList.contains("quote")
        ? "quote"
        : "image",
      className: el.className,
      html: el.innerHTML,
      left: el.style.left,
      top: el.style.top,
    };
    items.push(data);
  });
  localStorage.setItem("visionBoardItems", JSON.stringify(items));
  alert("Board saved!");
}

function loadBoard() {
  const data = localStorage.getItem("visionBoardItems");
  if (!data) return;
  const items = JSON.parse(data);
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = item.className;
    div.style.left = item.left;
    div.style.top = item.top;
    div.innerHTML = item.html;
    if (item.type !== "image") div.contentEditable = "true";
    makeDraggable(div);
    board.appendChild(div);
  });
}
loadBoard();

clearBtn.addEventListener("click", () => {
  if (confirm("Clear the board?")) {
    board.innerHTML = "";
    localStorage.removeItem("visionBoardItems");
  }
});

const savePDFBtn = document.getElementById('savePDFBtn');
savePDFBtn.addEventListener('click', () => {
    const element = document.body;
    const options = {
        margin: 0.5,
        filename: 'visionboard.pdf',
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
    
    const subject = 'Vision Board - Student Fun Zone';
    const body = 'Pogledajte moj Vision Board!';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailModal.style.display = 'none';
});

window.onclick = function(event) {
    if (event.target === emailModal) {
        emailModal.style.display = 'none';
    }
}