/* ===================================================================
   FROM MY HEART — script.js (5-page cinematic version)
   Vanilla JS only. Sections:
   1. Starfield particles (canvas)
   2. Floating hearts ambience
   3. Typing animation
   4. Page navigation (SPA-style, no reloads) + progress dots
   5. Final page: surprise reveal + burst hearts
   6. Background audio (safe, optional, no autoplay)
   =================================================================== */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------
     1. STARFIELD
  ------------------------------------------------------------------ */
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let starfieldRAF = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    const count = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.15,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
      phase: Math.random() * Math.PI * 2,
      driftY: Math.random() * 0.06 + 0.02
    }));
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.phase) * 0.35 + 0.65;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 235, 245, ${star.baseAlpha * twinkle})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      star.y -= star.driftY;
      if (star.y < -5) star.y = canvas.height + 5;
    }
    starfieldRAF = requestAnimationFrame(drawStars);
  }

  function initStarfield() {
    resizeCanvas();
    createStars();
    if (starfieldRAF) cancelAnimationFrame(starfieldRAF);
    if (!reduceMotion) {
      starfieldRAF = requestAnimationFrame(drawStars);
    } else {
      drawStars(0);
    }
  }

  window.addEventListener('resize', () => { resizeCanvas(); createStars(); });
  initStarfield();

  /* -----------------------------------------------------------------
     2. FLOATING HEARTS
  ------------------------------------------------------------------ */
  const HEART_PATH = 'M16 28.5C16 28.5 1 19.5 1 9.5C1 4.25 5.03 1 9.25 1C12.02 1 14.5 2.5 16 5C17.5 2.5 19.98 1 22.75 1C26.97 1 31 4.25 31 9.5C31 19.5 16 28.5 16 28.5Z';
  const floatingContainer = document.getElementById('floatingHearts');

  function makeHeartSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 32 29');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', HEART_PATH);
    path.setAttribute('fill', 'currentColor');
    svg.appendChild(path);
    return svg;
  }

  function spawnFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';

    const size = Math.random() * 18 + 12;
    const left = Math.random() * 100;
    const duration = Math.random() * 6 + 9;
    const drift = (Math.random() * 60 - 30) + 'px';
    const hue = Math.random() > 0.5 ? 'var(--color-red)' : 'var(--color-pink)';

    heart.style.width = size + 'px';
    heart.style.height = (size * 0.9) + 'px';
    heart.style.left = left + 'vw';
    heart.style.color = hue;
    heart.style.setProperty('--drift', drift);
    heart.style.animationDuration = duration + 's';

    heart.appendChild(makeHeartSVG());
    floatingContainer.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  if (!reduceMotion) {
    setInterval(spawnFloatingHeart, 1800);
    spawnFloatingHeart();
    setTimeout(spawnFloatingHeart, 700);
  }

  /* -----------------------------------------------------------------
     3. TYPING ANIMATION (page 1 only)
  ------------------------------------------------------------------ */
  const typingTarget = document.getElementById('typingText');
  const typingMessage = 'Some words are difficult to say... so I wrote them here.';
  let typingStarted = false;

  function typeText(el, text, speed = 42) {
    let i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      }
    })();
  }

  function startTypingOnce() {
    if (typingStarted) return;
    typingStarted = true;
    setTimeout(() => typeText(typingTarget, typingMessage), 500);
  }

  /* -----------------------------------------------------------------
     4. PAGE NAVIGATION (SPA-style, no reloads)
  ------------------------------------------------------------------ */
  const pages = Array.from(document.querySelectorAll('.page'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const TOTAL_PAGES = pages.length;
  let currentPage = 1;
  let isAnimating = false;

  function updateDots() {
    dots.forEach((dot) => {
      const isCurrent = Number(dot.dataset.goto) === currentPage;
      dot.setAttribute('aria-current', isCurrent ? 'true' : 'false');
    });
  }

  function goToPage(targetNum) {
    targetNum = Math.min(Math.max(targetNum, 1), TOTAL_PAGES);
    if (targetNum === currentPage || isAnimating) return;
    isAnimating = true;

    const outgoing = document.getElementById('page' + currentPage);
    const incoming = document.getElementById('page' + targetNum);

    outgoing.classList.add('is-leaving');
    outgoing.classList.remove('is-active');
    incoming.classList.add('is-active');

    currentPage = targetNum;
    updateDots();

    // Trigger music (safe no-op if already started / file missing)
    tryPlayMusic();

    // Page-specific entrance behaviour
    if (targetNum === 1) startTypingOnce();

    setTimeout(() => {
      outgoing.classList.remove('is-leaving');
      isAnimating = false;
    }, 780);
  }

  // Wire up every "next" button
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => goToPage(currentPage + 1));
  });

  // Wire up any button that jumps straight to a specific page (e.g. the surprise button)
  document.querySelectorAll('[data-goto-page]').forEach((btn) => {
    btn.addEventListener('click', () => goToPage(Number(btn.dataset.gotoPage)));
  });

  // Wire up progress dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => goToPage(Number(dot.dataset.goto)));
  });

  updateDots();
  startTypingOnce(); // page 1 is active on load

  // Final button: a warm little celebratory burst, nothing more
  document.getElementById('heartBtn')?.addEventListener('click', function () {
    burstHearts();
    this.style.transform = 'scale(0.96)';
    setTimeout(() => { this.style.transform = ''; }, 220);
  });

  /* -----------------------------------------------------------------
     5. BURST HEARTS — small celebratory effect, reused where needed
  ------------------------------------------------------------------ */
  function burstHearts(count = 14) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';

        const size = Math.random() * 16 + 10;
        heart.style.width = size + 'px';
        heart.style.height = (size * 0.9) + 'px';
        heart.style.left = (40 + Math.random() * 20) + '%';
        heart.style.bottom = (10 + Math.random() * 10) + '%';

        heart.appendChild(makeHeartSVG());
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1700);
      }, i * 60);
    }
  }

  /* -----------------------------------------------------------------
     6. BACKGROUND AUDIO
     Browsers block audio-with-sound from autoplaying before any user
     interaction, so a literal "plays the instant the page opens" isn't
     possible everywhere. To get as close as possible: try to play
     immediately on load, and if the browser blocks that, fall back to
     starting on the very first interaction of ANY kind (not just the
     "Open My Heart" button) — a stray click, tap, key press or scroll.
  ------------------------------------------------------------------ */
  const bgMusic = document.getElementById('bgMusic');
  const muteToggle = document.getElementById('muteToggle');
  const muteIcon = document.getElementById('muteIcon');
  let musicStarted = false;

  function tryPlayMusic() {
    if (musicStarted || !bgMusic) return;

    bgMusic.volume = 0.35;
    const playPromise = bgMusic.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise
        .then(() => {
          musicStarted = true;
          muteToggle.hidden = false;
        })
        .catch(() => {
          // Autoplay blocked (or file missing) — try again on first interaction.
          muteToggle.hidden = true;
        });
    } else {
      musicStarted = true;
    }
  }

  // Attempt immediately on load
  tryPlayMusic();

  // Fallback: first interaction of any kind starts it, then stops listening
  const INTERACTION_EVENTS = ['click', 'touchstart', 'keydown', 'scroll'];
  function onFirstInteraction() {
    tryPlayMusic();
    if (musicStarted) {
      INTERACTION_EVENTS.forEach((evt) => document.removeEventListener(evt, onFirstInteraction));
    }
  }
  INTERACTION_EVENTS.forEach((evt) => document.addEventListener(evt, onFirstInteraction, { passive: true }));

  muteToggle.addEventListener('click', () => {
    if (!bgMusic) return;
    bgMusic.muted = !bgMusic.muted;
    muteIcon.textContent = bgMusic.muted ? '\u266A\u0338' : '\u266A';
    muteIcon.style.opacity = bgMusic.muted ? '0.5' : '1';
  });

  bgMusic?.addEventListener('error', () => { muteToggle.hidden = true; }, { once: true });

})();