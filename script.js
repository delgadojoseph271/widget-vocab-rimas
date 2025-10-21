let dictionary = {};
const output = document.getElementById("output");

// --- Cargar el diccionario ---
fetch("dictionary.json")
  .then(res => res.json())
  .then(data => {
    dictionary = data;
    showDailyWord();
    lucide.createIcons(); // activar iconos
  });

// --- EVENTOS ---
document.getElementById("btnGenerate").addEventListener("click", generate);
document.getElementById("wordInput").addEventListener("input", spawnParticles);
document.getElementById("btnNew").addEventListener("click", newWord);
document.getElementById("btnIdea").addEventListener("click", inspiration);
document.getElementById("btnReset").addEventListener("click", resetWord);

// --- Palabra del día ---
function showDailyWord() {
  const today = new Date().toISOString().slice(0, 10);
  const saved = JSON.parse(localStorage.getItem("dailyWord"));
  if (saved && saved.date === today) return displayWord(saved.word);

  const keys = Object.keys(dictionary);
  const randomWord = keys[Math.floor(Math.random() * keys.length)];
  localStorage.setItem("dailyWord", JSON.stringify({ word: randomWord, date: today }));
  displayWord(randomWord);
}

function newWord() {
  localStorage.removeItem("dailyWord");
  showDailyWord();
}

function inspiration() {
  const ideas = [
    "Improvisa una frase con ritmo.",
    "Transforma una emoción en metáfora.",
    "Usa la palabra del día para describir el amanecer.",
    "Crea una rima con tu estado actual.",
    "Explica tu día usando tres sinónimos de 'vivir'."
  ];
  const idea = ideas[Math.floor(Math.random() * ideas.length)];
  output.innerHTML = `<p><strong>Inspiración:</strong> ${idea}</p>`;
  output.classList.add("visible");
}

function resetWord() {
  output.innerHTML = "";
  document.getElementById("wordInput").value = "";
}

// --- Mostrar palabra ---
function generate() {
  const word = document.getElementById("wordInput").value.trim().toLowerCase();
  displayWord(word);
}

function displayWord(word) {
  if (!word) return;
  const data = dictionary[word];
  output.classList.remove("visible");
  void output.offsetWidth; // forzar reflow

  if (data) {
    output.innerHTML = `
      <h2>${word}</h2>
      <p><strong>Sinónimos:</strong> ${data.synonyms.join(", ")}</p>
      <p><strong>Rimas:</strong> ${data.rhymes.join(", ")}</p>
      <p><strong>Ejercicio:</strong> Usa "<em>${word}</em>" junto con "<em>${data.rhymes[0]}</em>" y "<em>${data.rhymes[1]}</em>".</p>
    `;
  } else {
    output.innerHTML = `<p>No se encontró <strong>${word}</strong> en el diccionario.</p>`;
  }

  setTimeout(() => output.classList.add("visible"), 50);
}

// --- Partículas visuales ---
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawnParticles() {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
      y: window.innerHeight / 2 - 100 + Math.random() * 50,
      size: Math.random() * 2 + 1,
      speedY: Math.random() * -1 - 0.5,
      speedX: (Math.random() - 0.5) * 1,
      opacity: 1
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.opacity -= 0.015;
    ctx.fillStyle = `rgba(88,166,255,${p.opacity})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    if (p.opacity <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
