const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');
const eraserBtn = document.getElementById('eraserBtn');
const saveBtn = document.getElementById('saveBtn');

let drawing = false;
let currentColor = colorPicker.value;
let isErasing = false;

function startDraw(e){
    drawing = true;
    draw(e);
}

function endDraw(e) { 
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if(!drawing) return;

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isErasing ? '#FFFFFF' : currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', (e) => {
    draw(e);
    e.preventDefault();
});

canvas.addEventListener('touchpad', endDraw);

colorPicker.addEventListener('input', () => {
    currentColor = colorPicker.value;
    isErasing = false;
});

eraserBtn.addEventListener('click', () => {
    isErasing = !isErasing;
    eraserBtn.textContent = isErasing ? 'Piši' : 'Briši';
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener('click', () => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'moj_crtez.png';
    link.click();
});

const savePDFBtn = document.getElementById('savePDFBtn');
savePDFBtn.addEventListener('click', () => {
    const element = document.body;
    const options = {
        margin: 0.5,
        filename: 'whiteboard.pdf',
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
    
    const subject = 'Whiteboard - Student Fun Zone';
    const body = 'Pogledajte moj interaktivni Whiteboard crtež!';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailModal.style.display = 'none';
});

window.onclick = function(event) {
    if (event.target === emailModal) {
        emailModal.style.display = 'none';
    }
}