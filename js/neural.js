/* ================================================================
   NeuralFlow — neural.js
   1. Neural particle network  (mouse + touch interactive)
   2. Scroll-reveal animations
   3. Bento card mouse-tracking glow
   ================================================================ */

/* ──────────────────────────────────────────────────────────────
   1. NEURAL PARTICLE NETWORK
   ────────────────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* Adaptive node count — fewer on mobile to save battery */
  const isMobile = () => window.innerWidth < 600;

  const CONFIG = {
    get nodeCount() { return isMobile() ? 32 : 70; },
    get maxDist()   { return isMobile() ? 110 : 170; },
    speed     : 0.32,
    nodeColor : 'rgba(99,102,241,0.55)',
    lineColor : 'rgba(99,102,241,',
    glowColor : 'rgba(34,211,238,',
    get glowRadius() { return isMobile() ? 120 : 220; },
  };

  let W, H, nodes = [];
  /* pointer tracks both mouse and touch */
  const pointer = { x: -9999, y: -9999 };

  /* ── resize ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /* ── node factory ── */
  function createNodes() {
    nodes = Array.from({ length: CONFIG.nodeCount }, () => ({
      x  : Math.random() * W,
      y  : Math.random() * H,
      vx : (Math.random() - 0.5) * CONFIG.speed,
      vy : (Math.random() - 0.5) * CONFIG.speed,
      r  : Math.random() * 1.6 + 0.8,
    }));
  }

  /* ── physics ── */
  function moveNodes() {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
  }

  /* ── draw edges ── */
  function drawEdges() {
    const maxD = CONFIG.maxDist;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < maxD) {
          const alpha = (1 - d / maxD) * 0.55;
          ctx.beginPath();
          ctx.strokeStyle = CONFIG.lineColor + alpha + ')';
          ctx.lineWidth   = 0.7;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }

  /* ── draw nodes with pointer glow ── */
  function drawNodes() {
    const glowR = CONFIG.glowRadius;
    for (const n of nodes) {
      const d    = Math.hypot(n.x - pointer.x, n.y - pointer.y);
      const glow = d < glowR ? (1 - d / glowR) : 0;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = glow > 0
        ? CONFIG.glowColor + (0.35 + glow * 0.65) + ')'
        : CONFIG.nodeColor;
      ctx.fill();

      /* extra halo ring near pointer */
      if (glow > 0.4) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow * 7, 0, Math.PI * 2);
        ctx.strokeStyle = CONFIG.glowColor + (glow * 0.25) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  /* ── animation loop ── */
  function frame() {
    ctx.clearRect(0, 0, W, H);
    moveNodes();
    drawEdges();
    drawNodes();
    requestAnimationFrame(frame);
  }

  /* ── events ── */
  window.addEventListener('resize', () => { resize(); createNodes(); });

  /* mouse */
  window.addEventListener('mousemove', e => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  /* touch — tracks first touch point */
  window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    pointer.x = t.clientX;
    pointer.y = t.clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    /* fade pointer away after lift */
    pointer.x = -9999;
    pointer.y = -9999;
  });

  /* ── boot ── */
  resize();
  createNodes();
  frame();
}());


/* ──────────────────────────────────────────────────────────────
   2. SCROLL REVEAL
   Elements with [data-reveal] fade + slide up as they enter
   the viewport. Add  data-reveal  (and optionally
   data-reveal-delay="200")  to any HTML element.
   ────────────────────────────────────────────────────────────── */
(function () {
  /* Inject keyframe + base styles once */
  const style = document.createElement('style');
  style.textContent = `
    [data-reveal] {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s cubic-bezier(.22,.68,0,1.2),
                  transform 0.65s cubic-bezier(.22,.68,0,1.2);
      will-change: opacity, transform;
    }
    [data-reveal].revealed {
      opacity: 1;
      transform: translateY(0);
    }
    /* stagger siblings when parent has data-reveal-group */
    [data-reveal-group] > * {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.55s cubic-bezier(.22,.68,0,1.2),
                  transform 0.55s cubic-bezier(.22,.68,0,1.2);
    }
    [data-reveal-group].revealed > *:nth-child(1) { transition-delay: 0ms; }
    [data-reveal-group].revealed > *:nth-child(2) { transition-delay: 90ms; }
    [data-reveal-group].revealed > *:nth-child(3) { transition-delay: 180ms; }
    [data-reveal-group].revealed > *:nth-child(4) { transition-delay: 270ms; }
    [data-reveal-group].revealed > *:nth-child(5) { transition-delay: 360ms; }
    [data-reveal-group].revealed > *:nth-child(6) { transition-delay: 450ms; }
    [data-reveal-group].revealed > * {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  /* Respect prefers-reduced-motion */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    /* Immediately reveal everything */
    document.querySelectorAll('[data-reveal], [data-reveal-group]').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.revealDelay || '0', 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  /* Observe on DOMContentLoaded (elements may not exist yet) */
  function initObservers() {
    document.querySelectorAll('[data-reveal], [data-reveal-group]').forEach(el => {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObservers);
  } else {
    initObservers();
  }
}());


/* ──────────────────────────────────────────────────────────────
   3. BENTO CARD MOUSE-TRACKING GLOW
   ────────────────────────────────────────────────────────────── */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  });
});

/* ──────────────────────────────────────────────────────────────
   4. DARK / LIGHT MODE TOGGLE
   Add  id="theme-toggle"  to any button to wire it up.
   Persists choice in localStorage.
   ────────────────────────────────────────────────────────────── */
(function () {
  const root = document.documentElement;

  const LIGHT = {
    '--bg':        '#F5F6FF',
    '--surface':   '#FFFFFF',
    '--white':     '#0F1035',
    '--muted':     '#4B5280',
    '--dim':       '#8B93B8',
    '--glass':     'rgba(0, 0, 0, 0.04)',
    '--border':    'rgba(0, 0, 0, 0.08)',
    '--border-hi': 'rgba(91, 91, 214, 0.5)',
  };
  const DARK = {
    '--bg':        '#08091A',
    '--surface':   '#0E1128',
    '--white':     '#EEF2FF',
    '--muted':     '#8B93B8',
    '--dim':       '#4B5280',
    '--glass':     'rgba(255, 255, 255, 0.04)',
    '--border':    'rgba(255, 255, 255, 0.08)',
    '--border-hi': 'rgba(91, 91, 214, 0.45)',
  };

  function applyTheme(dark) {
    const tokens = dark ? DARK : LIGHT;
    for (const [k, v] of Object.entries(tokens)) root.style.setProperty(k, v);
    localStorage.setItem('nf-theme', dark ? 'dark' : 'light');
    document.querySelectorAll('[id="theme-toggle"]').forEach(btn => {
      btn.textContent = dark ? '☀️' : '🌙';
      btn.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  const saved = localStorage.getItem('nf-theme');
  let isDark = saved ? saved === 'dark' : true; // default dark
  applyTheme(isDark);

  document.addEventListener('click', e => {
    if (e.target.id === 'theme-toggle') {
      isDark = !isDark;
      applyTheme(isDark);
    }
  });
}());
