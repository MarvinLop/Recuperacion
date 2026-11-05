// =========================================================
// MAIN.JS — Interacciones, animaciones y canvas neuronal
// Proyecto 5 · INNOVA·IA
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. CANVAS NEURONAL (red de partículas del hero)
     ========================================================= */
  const canvas = document.getElementById('neural-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w = 0, h = 0;
    let mouse = { x: -9999, y: -9999 };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
      const density = Math.min(90, Math.floor((w * h) / 18000));
      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 1.8 + 0.8
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Líneas entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.35;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // Conexión con el cursor
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 170) {
          const alpha = (1 - mdist / 170) * 0.5;
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Puntos
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120, 200, 240, 0.7)';
        ctx.fill();
      });
    }

    function update() {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    if (!reduceMotion) loop();
    else { update(); draw(); }
  }

  /* =========================================================
     2. SCROLL SUAVE + CIERRE DE MENÚ MÓVIL
     ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('mainNav').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 12;
        window.scrollTo({ top, behavior: 'smooth' });

        const nav = document.getElementById('navContent');
        if (nav && nav.classList.contains('show')) {
          new bootstrap.Collapse(nav).hide();
        }
      }
    });
  });

  /* =========================================================
     3. NAVBAR + PROGRESO + VOLVER ARRIBA + LINK ACTIVO
     ========================================================= */
  const mainNav = document.getElementById('mainNav');
  const backTop = document.getElementById('back-to-top');
  const progress = document.getElementById('scroll-progress');
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
  const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));

  function onScroll() {
    const y = window.pageYOffset;

    if (mainNav) mainNav.classList.toggle('scrolled', y > 40);
    if (backTop) backTop.classList.toggle('show', y > 520);

    if (progress) {
      const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    }

    // Link activo
    let current = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 130) current = sec.getAttribute('id');
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* =========================================================
     4. APARICIÓN ESCALONADA (scroll reveal)
     ========================================================= */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || i * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -70px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* =========================================================
     5. BARRAS DE VALIDACIÓN ANIMADAS (cuando aparecen)
     ========================================================= */
  const vvFills = document.querySelectorAll('.vv-fill');

  if (vvFills.length && 'IntersectionObserver' in window) {
    const vvIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => { entry.target.style.width = entry.target.dataset.w + '%'; }, 200);
          vvIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    vvFills.forEach(f => vvIO.observe(f));
  }

  /* =========================================================
     6. CONTADORES ANIMADOS (métricas del hero)
     ========================================================= */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length && 'IntersectionObserver' in window) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let n = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const timer = setInterval(() => {
          n += step;
          if (n >= target) { n = target; clearInterval(timer); }
          el.textContent = n;
        }, 40);
        cIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cIO.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count);
  }

  /* =========================================================
     7. TEXTO QUE SE ESCRIBE SOLO (hero typing)
     ========================================================= */
  const typeEl = document.getElementById('typing-word');

  if (typeEl) {
    const words = ['sistemas innovadores', 'soluciones útiles', 'prototipos reales', 'tu propia idea'];
    let wi = 0, ci = 0, deleting = false;

    function type() {
      const word = words[wi];
      typeEl.textContent = word.substring(0, ci);

      if (!deleting && ci < word.length) {
        ci++;
        setTimeout(type, 85);
      } else if (!deleting && ci === word.length) {
        deleting = true;
        setTimeout(type, 1600);
      } else if (deleting && ci > 0) {
        ci--;
        setTimeout(type, 42);
      } else {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(type, 320);
      }
    }
    setTimeout(type, 700);
  }

  /* =========================================================
     8. TARJETAS DE FUENTES — giran al hacer clic
     ========================================================= */
  document.querySelectorAll('.source-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
    card.setAttribute('tabindex', '0');
  });

  /* =========================================================
     9. CHAT — abrir / cerrar + chips
     ========================================================= */
  const chatFab = document.getElementById('chat-toggle');
  const chatWin = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');

  if (chatFab && chatWin) {
    chatFab.addEventListener('click', () => {
      chatWin.classList.toggle('active');
      if (chatWin.classList.contains('active') && chatInput) chatInput.focus();
    });
  }
  if (chatClose && chatWin) chatClose.addEventListener('click', () => chatWin.classList.remove('active'));

  document.querySelectorAll('.chat-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      if (!q || !chatInput) return;
      chatInput.value = q;
      document.getElementById('chat-send').click();
    });
  });

  /* =========================================================
     10. CONTADOR DE CARACTERES DEL TEXTAREA
     ========================================================= */
  const ideaInput = document.getElementById('idea-input');
  const ideaCount = document.getElementById('idea-count');

  if (ideaInput && ideaCount) {
    ideaInput.addEventListener('input', () => {
      ideaCount.textContent = ideaInput.value.length;
    });
  }

  /* =========================================================
     11. AÑO DINÁMICO + ejecución inicial
     ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  onScroll();

});
