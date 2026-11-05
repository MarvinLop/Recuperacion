// =========================================================
// QUIZ.JS — Mini práctica de 5 preguntas (Proyecto 5)
// =========================================================

const quizData = [
  {
    question: '¿Qué es realmente innovar?',
    options: [
      'Inventar algo que nadie ha visto antes',
      'Resolver un problema real de forma nueva y útil',
      'Copiar una idea que ya funciona',
      'Comprar la tecnología más cara'
    ],
    correct: 1,
    feedback: 'Innovar es resolver un problema real de forma nueva y útil, no solo inventar algo llamativo.'
  },
  {
    question: '¿Cuáles son las tres piezas de toda innovación?',
    options: [
      'Dinero, suerte y contactos',
      'Problema, usuario y solución',
      'Hardware, software y red',
      'Idea, logo y nombre'
    ],
    correct: 1,
    feedback: 'Toda innovación nace de un problema real, un usuario concreto y una solución útil.'
  },
  {
    question: '¿Cuál de estas es una fuente de ideas tecnológicas?',
    options: [
      'Internet de las Cosas (IoT)',
      'Cambiar el color de una pared',
      'Aumentar el precio de un producto',
      'Repetir lo que hace la competencia'
    ],
    correct: 0,
    feedback: 'El IoT (junto con la IA, las apps móviles y los ERP) es una de las fuentes tecnológicas de ideas.'
  },
  {
    question: '¿Qué significa validar una idea?',
    options: [
      'Dibujarla muy bonita en un papel',
      'Preguntar a usuarios reales si la necesitan antes de construir',
      'Subirla rápido a internet',
      'Pedir permiso a un adulto'
    ],
    correct: 1,
    feedback: 'Validar es preguntar a usuarios reales si usarían tu solución, antes de construir de más.'
  },
  {
    question: 'En una feria, ¿cuál es el mejor orden para presentar?',
    options: [
      'Demo → problema → impacto → solución',
      'Gancho (problema) → solución → demo → impacto',
      'Leer toda la documentación primero',
      'Hablar solo de la tecnología usada'
    ],
    correct: 1,
    feedback: 'Empieza con el gancho (problema real), presenta tu solución, muestra la demo y cierra con el impacto.'
  }
];

let qi = 0;
let score = 0;
let selected = null;
let answered = false;

const box = document.getElementById('quiz-box');
const LETTERS = ['A', 'B', 'C', 'D'];

function loadQuestion() {
  if (!box) return;

  if (qi >= quizData.length) { showResults(); return; }

  answered = false;
  selected = null;

  const q = quizData[qi];
  const progress = (qi / quizData.length) * 100;

  let html = `
    <div class="qz-progress"><div class="qz-progress-fill" style="width:${progress}%"></div></div>
    <div class="qz-top">
      <span class="qz-step">Pregunta ${qi + 1} / ${quizData.length}</span>
      <span class="qz-score-live">Puntaje: ${score}</span>
    </div>
    <p class="qz-question">${q.question}</p>
  `;

  q.options.forEach((opt, i) => {
    html += `
      <button class="qz-option" data-i="${i}">
        <span class="qz-letter">${LETTERS[i]}</span>
        <span>${opt}</span>
      </button>
    `;
  });

  html += `<div id="qz-fb-slot"></div>
    <button id="qz-next" class="btn btn-glow w-100 mt-3" disabled>
      ${qi === quizData.length - 1 ? 'Ver resultado' : 'Siguiente'}
      <i class="bi bi-arrow-right ms-2"></i>
    </button>`;

  box.innerHTML = html;

  box.querySelectorAll('.qz-option').forEach(btn => {
    btn.addEventListener('click', function () {
      if (answered) return;
      box.querySelectorAll('.qz-option').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      selected = parseInt(this.dataset.i, 10);
      document.getElementById('qz-next').disabled = false;
    });
  });

  document.getElementById('qz-next').addEventListener('click', () => {
    if (selected === null) return;
    const ok = selected === quizData[qi].correct;

    if (!answered) {
      answered = true;
      box.querySelectorAll('.qz-option').forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === quizData[qi].correct) opt.classList.add('correct');
        if (i === selected && !ok) opt.classList.add('incorrect');
      });
      if (ok) score++;

      box.querySelector('.qz-score-live').textContent = 'Puntaje: ' + score;

      document.getElementById('qz-fb-slot').innerHTML = `
        <div class="qz-feedback ${ok ? 'ok' : 'no'}">
          <i class="bi ${ok ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
          <div><strong>${ok ? '¡Correcto!' : 'Respuesta incorrecta'}</strong><br>${quizData[qi].feedback}</div>
        </div>`;

      const nb = document.getElementById('qz-next');
      nb.innerHTML = (qi === quizData.length - 1)
        ? 'Ver resultado <i class="bi bi-trophy ms-2"></i>'
        : 'Siguiente <i class="bi bi-arrow-right ms-2"></i>';
    } else {
      qi++;
      loadQuestion();
    }
  });
}

function showResults() {
  const total = quizData.length;
  const pct = Math.round((score / total) * 100);
  const circ = 414;
  const offset = circ - (pct / 100) * circ;

  let msg, icon;
  if (pct === 100) { msg = '¡Perfecto! Dominas los conceptos de innovación. 🚀'; icon = 'bi-trophy-fill'; }
  else if (pct >= 60) { msg = 'Bien hecho. Tienes una buena base para innovar.'; icon = 'bi-hand-thumbs-up-fill'; }
  else { msg = 'Repasa las secciones y vuelve a intentarlo. ¡Tú puedes!'; icon = 'bi-arrow-repeat'; }

  box.innerHTML = `
    <div class="qz-result">
      <div class="qz-ring">
        <svg width="150" height="150" viewBox="0 0 150 150">
          <defs>
            <linearGradient id="qzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
          </defs>
          <circle class="rbg" cx="75" cy="75" r="66"></circle>
          <circle class="rfg" cx="75" cy="75" r="66" data-offset="${offset}"></circle>
        </svg>
        <div class="qz-value">${pct}%</div>
      </div>
      <h4 class="qz-rtitle"><i class="bi ${icon} me-2" style="color:var(--amber)"></i>${score} de ${total} correctas</h4>
      <p class="qz-rmsg">${msg}</p>
      <button id="qz-restart" class="btn btn-outline-glow">
        <i class="bi bi-arrow-clockwise me-2"></i>Reintentar quiz
      </button>
    </div>
  `;

  const ring = box.querySelector('.rfg');
  if (ring) requestAnimationFrame(() => setTimeout(() => { ring.style.strokeDashoffset = ring.dataset.offset; }, 120));

  document.getElementById('qz-restart').addEventListener('click', () => {
    qi = 0; score = 0;
    loadQuestion();
  });
}

document.addEventListener('DOMContentLoaded', loadQuestion);

