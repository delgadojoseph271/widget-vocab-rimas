let dictionary = {};
const output = document.getElementById("output");
const container = document.getElementById("widgetContainer");
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

// --- Configuración de partículas ---
let particles = [];
const MAX_PARTICLES = 80;
let animationActive = true;
resizeCanvas();

// --- Cargar el diccionario (fallback si falla fetch) ---
fetch("dictionary.json")
  .then(res => res.json())
  .then(data => {
    dictionary = data;
    showDailyWord();
    lucide.createIcons();
    postHeight(); // avisar al padre
  })
  .catch(() => {
    // fallback mínimo si ocurre un error (evita romper la UI)
    dictionary = { "hola": { "synonyms": ["saludo"], "rhymes": ["ola"] } };
    showDailyWord();
    lucide.createIcons();
    postHeight();
  });

// --- EVENTOS ---
document.getElementById("btnGenerate").addEventListener("click", generate);
document.getElementById("wordInput").addEventListener("input", spawnParticles);
document.getElementById("btnNew").addEventListener("click", newWord);
document.getElementById("btnIdea").addEventListener("click", inspiration);
document.getElementById("btnReset").addEventListener("click", resetWord);
window.addEventListener("resize", () => { resizeCanvas(); postHeight(); });

// Pausar animación cuando no está visible (optimización en iframe)
document.addEventListener("visibilitychange", () => {
  animationActive = !document.hidden;
  if (animationActive) animateParticles();
});

// Intersección para pausar si iframe no visible en la página
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { animationActive = e.isIntersecting; if (animationActive) animateParticles(); });
  }, { threshold: 0.1 });
  obs.observe(container);
}

// --- Ajuste de altura para el host (Notion) ---
function postHeight() {
  try {
    const h = container.offsetHeight + 8;
    window.parent.postMessage({ type: 'widget-height', height: h }, '*');
  } catch (e) { /* silencioso */ }
}

// --- Palabra del día, generadores, etc (sin cambios importantes) ---
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
  postHeight();
}

function resetWord() {
  output.innerHTML = "";
  document.getElementById("wordInput").value = "";
  output.classList.remove("visible");
  postHeight();
}

function generate() {
  const word = document.getElementById("wordInput").value.trim().toLowerCase();
  displayWord(word);
}

function displayWord(word) {
  if (!word) return;
  const data = dictionary[word];
  output.classList.remove("visible");
  void output.offsetWidth;
  if (data) {
    const syn = (data.synonyms || []).join(", ") || "—";
    const rh = (data.rhymes || []).join(", ") || "—";
    const r0 = (data.rhymes && data.rhymes[0]) || "";
    const r1 = (data.rhymes && data.rhymes[1]) || "";
    output.innerHTML = `
      <h2>${word}</h2>
      <p><strong>Sinónimos:</strong> ${syn}</p>
      <p><strong>Rimas:</strong> ${rh}</p>
      <p><strong>Ejercicio:</strong> Usa "<em>${word}</em>" junto con "<em>${r0}</em>" y "<em>${r1}</em>".</p>
    `;
  } else {
    output.innerHTML = `<p>No se encontró <strong>${word}</strong> en el diccionario.</p>`;
  }
  setTimeout(() => { output.classList.add("visible"); postHeight(); }, 60);
}

// --- Partículas --- 
function resizeCanvas() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

function spawnParticles() {
  if (particles.length > MAX_PARTICLES) return;
  for (let i = 0; i < 4; i++) {
    if (particles.length >= MAX_PARTICLES) break;
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 80,
      y: canvas.height / 2 - 40 + Math.random() * 30,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * -0.8 - 0.2,
      speedX: (Math.random() - 0.5) * 0.6,
      opacity: 1
    });
  }
}

function animateParticles() {
  if (!animationActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.opacity -= 0.02;
    ctx.fillStyle = `rgba(88,166,255,${Math.max(p.opacity,0)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    if (p.opacity <= 0 || p.y < -10 || p.x < -10 || p.x > canvas.width + 10) particles.splice(i, 1);
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();
