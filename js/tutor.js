
// =========================================================
// TUTOR.JS — Chat con IA (Groq) · Proyecto 5 · Mentor de Innovación
// =========================================================

// API Key de Groq.
//  ⚠️ En un proyecto de producción esta clave NUNCA debe estar en el código
//     público: debe guardarse como variable de entorno en el servidor.
//     Para esta demo educativa se declara aquí.
const GROQ_API_KEY = "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";

// ✅ Modelo disponible en Groq para esta cuenta.
//    Alternativas válidas: "openai/gpt-oss-20b", "qwen/qwen3.8-27b"
const GROQ_MODEL = "openai/gpt-oss-120b";

const chatMessages   = document.getElementById('chat-messages');
const chatInput      = document.getElementById('chat-input');
const chatSend       = document.getElementById('chat-send');
const ideaInput      = document.getElementById('idea-input');
const btnMejorar     = document.getElementById('btn-mejorar');
const ideaResult     = document.getElementById('idea-result');

// ── Prompt del sistema: el mentor de innovación ─────────────
const SYSTEM_PROMPT = `
Eres «Mentor de Innovación», un tutor de IA para estudiantes de bachillerato de El Salvador del Proyecto 5: «Aprende a hacer sistemas innovadores». Perteneces a la startup educativa EduIA.

TU TEMA (solo hablas de esto):
1. Qué es innovar: problema, usuario y solución (y en qué se diferencia de inventar).
2. Fuentes de ideas: inteligencia artificial, internet de las cosas (IoT), apps móviles y sistemas ERP. Menciona ÁNIMA como ejemplo de sistema innovador.
3. Cómo validar una idea con usuarios reales.
4. Cómo presentar un proyecto en una feria (gancho, solución, demo e impacto).

TU PERSONALIDAD Y MÉTODO:
- Hablas en español claro y sencillo, con ejemplos concretos de El Salvador (pupuserías, tiendas de barrio, cooperativas, distribuidoras, cultivos de café).
- Eres un mentor motivador: NUNCA destruyes una idea de golpe. Primero reconoces lo bueno, luego haces preguntas que ayudan a mejorarla.
- Siempre propones UN primer paso pequeño y realizable esta misma semana.
- Usas ejemplos, no solo definiciones.
- Eres breve: respuestas de 4 a 8 líneas, salvo que pidan más detalle.
- No das el proyecto completo hecho: guías para que el estudiante piense.
- Si la pregunta NO es sobre innovación o estos temas, respondes amablemente: «Esa pregunta está fuera del tema de este mentor de innovación. ¿Quieres que te ayude a mejorar tu idea de proyecto o a entender qué es innovar?»
- No expliques tu razonamiento interno: entrega solo la respuesta final, directa y amable.
`;

// ── Utilidades del chat ─────────────────────────────────────
function addMessage(text, isUser = false) {
  const div = document.createElement('div');
  div.className = 'msg ' + (isUser ? 'user' : 'bot');
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function addTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

// ── Llamada a la IA ─────────────────────────────────────────
async function askTutor(userMessage) {
  if (!GROQ_API_KEY || GROQ_API_KEY.includes('PEGA_AQUI')) {
    return '⚠️ Falta configurar la API Key.';
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        // Los modelos gpt-oss usan tokens de razonamiento interno;
        // con un límite alto evitamos respuestas vacías.
        max_tokens: 2048
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Error API:', res.status, err);
      if (res.status === 401) return 'La API Key no es válida o fue revocada.';
      if (res.status === 404) return 'El modelo configurado no está disponible.';
      if (res.status === 429) return 'Se alcanzó el límite de uso. Espera un momento e intenta de nuevo.';
      return 'Ocurrió un error al conectar con el tutor. Revisa tu conexión e intenta otra vez.';
    }

    const data = await res.json();
    const m = data.choices && data.choices[0] && data.choices[0].message;
    return (m && m.content && m.content.trim()) ||
           (m && m.reasoning && m.reasoning.trim()) ||
           'No pude generar una respuesta. Intenta reformular tu pregunta.';
  } catch (error) {
    console.error(error);
    return 'Ocurrió un error al conectar con el tutor. Revisa tu conexión e intenta otra vez.';
  }
}

// ── Enviar mensaje del chat ─────────────────────────────────
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, true);
  chatInput.value = '';
  chatSend.disabled = true;

  const typing = addTyping();
  const reply = await askTutor(text);
  typing.remove();
  addMessage(reply);

  chatSend.disabled = false;
  chatInput.focus();
}

if (chatSend && chatInput) {
  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

// ── Ejercicio: mejorar la idea con 5 preguntas ──────────────
if (btnMejorar && ideaInput && ideaResult) {
  btnMejorar.addEventListener('click', async () => {
    const idea = ideaInput.value.trim();

    if (!idea) {
      ideaResult.innerHTML = '<div class="qz-feedback no"><i class="bi bi-exclamation-circle-fill"></i><div>Escribe primero tu idea para poder ayudarte.</div></div>';
      return;
    }

    btnMejorar.disabled = true;
    ideaResult.innerHTML = '<div class="text-muted d-flex align-items-center gap-2"><span class="typing"><span></span><span></span><span></span></span> El mentor está analizando tu idea...</div>';

    const prompt = `Un estudiante de bachillerato describe esta idea de proyecto innovador:\n\n"${idea}"\n\nHazle EXACTAMENTE 5 preguntas cortas y numeradas que le ayuden a mejorar su idea (piensa en: ¿quién la necesita?, ¿qué problema resuelve?, ¿qué la hace diferente?, ¿cómo se hace?, ¿cómo sabría si funciona?). Antes de las preguntas, escribe una frase breve y motivadora reconociendo algo bueno de su idea. No des la solución hecha.`;

    const reply = await askTutor(prompt);

    ideaResult.innerHTML = `
      <div class="idea-card">
        <div class="ic-head"><i class="bi bi-stars"></i> Tu idea bajo la lupa</div>
        <div>${reply}</div>
      </div>`;

    btnMejorar.disabled = false;
  });
}
