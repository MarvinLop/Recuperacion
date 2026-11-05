🚀 INNOVA·IA — Proyecto 5
«Aprende a hacer sistemas innovadores con tu tutor de IA»
Sitio web interactivo de una sola página con un tutor de IA que enseña, paso a paso, cómo crear sistemas innovadores. Incluye teoría, ejemplos salvadoreños, una mini-práctica con quiz y un ejercicio calificado por IA.
---
🎯 ¿Qué incluye?
Sección	Contenido
Hero	Presentación animada con red neuronal interactiva que sigue el cursor
1. ¿Qué es innovar?	Definición sencilla + diferencia entre innovar e inventar
2. Fuentes de ideas	IA, IoT, Apps y ERP (con el caso real de ÁNIMA)
3. Cómo validar una idea	Método para saber si tu idea funciona antes de construirla
4. Preséntalo en la feria	Estructura de un pitch de 60 segundos + errores a evitar
Mini-práctica	Quiz de 5 preguntas con retroalimentación + ejercicio de mejora de idea calificado por IA
Tutor de IA	Chat flotante que responde dudas al instante
---
🛠️ Tecnologías usadas
HTML5 — estructura semántica
CSS3 — diseño oscuro futurista, gradientes, cristal (glassmorphism) y animaciones
Bootstrap 5 — diseño adaptable (responsive) sin escribir todo el layout a mano
JavaScript — animaciones, quiz y conexión con la IA
Canvas API — red neuronal animada del inicio
Groq API — modelo de lenguaje `openai/gpt-oss-120b` para el tutor
---
📂 Estructura del proyecto
```
proyecto5/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Todo el diseño visual
├── js/
│   ├── main.js         # Animaciones e interacciones
│   ├── quiz.js         # Mini-práctica (5 preguntas)
│   └── tutor.js        # Chat con IA y ejercicio de ideas
└── README.md
```
---
▶️ Cómo usar el proyecto
Opción 1 — Abrir directo
Solo abre `index.html` en tu navegador.
Opción 2 — Servidor local (recomendado)
Para que el tutor de IA funcione sin problemas de CORS, usa un servidor local:
```bash
# Con Python
python3 -m http.server 8000

# Con VS Code: extensión "Live Server" → clic derecho en index.html → Open with Live Server
```
Luego abre `http://localhost:8000`
---
🔑 Configurar la IA
Crea una cuenta gratis en console.groq.com
Genera una API Key
Ábrela en `js/tutor.js` y pégala aquí:
```js
const GROQ_API_KEY = "tu-api-key-aquí";
const GROQ_MODEL = "openai/gpt-oss-120b";
```
> ⚠️ **Importante:** En un proyecto real, las claves NO deben ir en el código público. Deben guardarse en un servidor seguro. Para esta demostración educativa se incluye directamente.
---
🧪 ¿Cómo funciona el tutor de IA?
El archivo `js/tutor.js` envía lo que escribe el estudiante a la API de Groq con un prompt de sistema que le dice a la IA:
Que actúe como mentor de innovación para estudiantes de bachillerato
Que use ejemplos de El Salvador (pupuserías, cooperativas, café, etc.)
Que nunca destruya una idea, sino que haga buenas preguntas para mejorarla
Que siempre proponga un primer paso pequeño y realizable
---
📱 Diseño adaptable
El sitio se ve bien en:
💻 Computadora (1440px+)
📱 Celular (390px)
📲 Tablet (768px)
---
📚 Créditos
Institución: INDEL
Materia: 3DS «B»
Docente: Prof. Javier Mineros
Proyecto: Proyecto 5 — Innovación / ÁNIMA / ERP / IA
---
Hecho con 💙 para aprender a innovar.
