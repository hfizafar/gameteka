const grid = document.getElementById('grid');
const winSound = document.getElementById('win-sound');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

// Layout & Answers
const layout = [
  ['W', 'W', 'W', 'B', 'W'],
  ['W', 'B', 'W', 'B', 'W'],
  ['W', 'W', 'W', 'W', 'W'],
  ['B', 'B', 'W', 'B', 'B'],
  ['W', 'W', 'W', 'W', 'W']
];

const answers = {
  '0-0': 'P', '0-1': 'E', '0-2': 'N',      // Across 1: PEN
  '0-4': 'B', '1-4': 'U', '2-4': 'M', '4-4': 'I', // Across 2: BUMI
  '0-0': 'P', '1-0': 'A', '2-0': 'G', '4-0': 'I'  // Down 1: PAGI
};

const wordMap = {
  'across-1': ['0-0', '0-1', '0-2'],
  'across-2': ['0-4', '1-4', '2-4', '4-4'],
  'down-1': ['0-0', '1-0', '2-0', '4-0']
};

// Render grid
layout.forEach((row, r) => {
  row.forEach((cell, c) => {
    const input = document.createElement('input');
    input.setAttribute('maxlength', '1');
    input.classList.add('cell');
    input.id = `${r}-${c}`;
    if (cell === 'B') input.classList.add('black');
    else {
      input.addEventListener('input', () => autoCheck(input, r, c));
    }
    grid.appendChild(input);
  });
});

// Highlight
function highlight(word) {
  document.querySelectorAll('.cell').forEach(cell => {
    if (!cell.classList.contains('black')) {
      cell.classList.remove('highlight');
    }
  });
  wordMap[word].forEach(id => {
    document.getElementById(id).classList.add('highlight');
  });
}

// Auto-check
function autoCheck(input, r, c) {
  const id = `${r}-${c}`;
  if (answers[id]) {
    if (input.value.toUpperCase() === answers[id]) {
      input.classList.add('correct');
      input.classList.remove('wrong');
    } else {
      input.classList.add('wrong');
      input.classList.remove('correct');
    }
  }
}

// Cek semua jawaban
function checkAnswers() {
  let correct = true;
  Object.keys(answers).forEach(id => {
    const input = document.getElementById(id);
    if (input.value.toUpperCase() === answers[id]) {
      input.classList.add('correct');
      input.classList.remove('wrong');
    } else {
      input.classList.add('wrong');
      input.classList.remove('correct');
      correct = false;
    }
  });

  const result = document.getElementById('result');
  if (correct) {
    result.innerText = "🎉 Selamat, semua benar!";
    result.style.color = "green";
    clearInterval(timer);
    winSound.play();
    startConfetti();
  } else {
    result.innerText = "Masih ada yang salah, coba lagi!";
    result.style.color = "red";
  }
}

// ===== TIMER =====
let timeLeft = 120;
const resultDiv = document.getElementById('result');
const timer = setInterval(() => {
  timeLeft--;
  resultDiv.innerText = `⏳ Waktu tersisa: ${timeLeft} detik`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    resultDiv.innerText = "⏰ Waktu habis!";
    document.querySelectorAll('.cell').forEach(cell => cell.disabled = true);
  }
}, 1000);

// ===== Confetti Effect =====
function startConfetti() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = [];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      speed: Math.random() * 3 + 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  function update() {
    pieces.forEach(p => {
      p.y += p.speed;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
  }

  function animate() {
    draw();
    update();
    confettiAnim = requestAnimationFrame(animate);
  }

  let confettiAnim = requestAnimationFrame(animate);
  setTimeout(() => {
    cancelAnimationFrame(confettiAnim);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}
