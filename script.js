/* ── Scroll-reveal (Intersection Observer) ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Recommendations ── */
(function renderRecommendations() {
  const list = document.getElementById('rec-list');
  if (!list || !window.recommendations) return;

  list.innerHTML = window.recommendations.map(r => `
    <div class="rec-card reveal">
      <div class="rec-qdot">&ldquo;</div>
      <p class="rec-quote">${r.quote}</p>
      <div class="rec-divider"></div>
      <div class="rec-name">${r.name}</div>
      <div class="rec-who">${r.role} · ${r.company}</div>
      ${r.relationship ? `<div class="rec-who" style="margin-top:2px;font-style:italic;">${r.relationship}</div>` : ''}
      ${r.documentUrl ? `<a class="rec-link" href="${r.documentUrl}" target="_blank" rel="noreferrer">${r.linkLabel || 'View recommendation letter ↗'}</a>` : ''}
    </div>
  `).join('');

  document.querySelectorAll('#rec-list .reveal').forEach(el => observer.observe(el));
})();

/* ── Hero scroll parallax (Apple-style fade + drift) ── */
(function heroParallax() {
  const heroInner = document.querySelector('.hero-inner');
  const photo = document.querySelector('.hero-photo-wrap');
  const heroName = document.querySelector('.hero-name');
  const navLogo = document.querySelector('.nav-logo');
  if (!heroInner) return;

  let ticking = false;
  function update() {
    const y = window.scrollY;
    const h = window.innerHeight;
    const p = Math.min(y / (h * 0.7), 1);          // 0 → 1 over first 70vh
    heroInner.style.opacity = 1 - p * 0.9;
    heroInner.style.transform = `translateY(${y * 0.28}px)`; // content drifts slower than scroll
    if (photo) photo.style.transform = `scale(${1 - p * 0.12})`;

    // Name → nav bar handoff: big name shrinks upward and fades,
    // nav title takes over right as it disappears (reverses on scroll up)
    const pn = Math.min(y / (h * 0.5), 1);         // 0 → 1 over first 50vh
    if (heroName) {
      heroName.style.transform = `scale(${1 - pn * 0.4})`;
      heroName.style.opacity = 1 - pn;
    }
    if (navLogo) navLogo.classList.toggle('show', pn >= 0.9);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update(); // set correct state on load (e.g. when landing on an #anchor)
})();

/* ── Staggered children ── */
document.querySelectorAll('[data-stagger]').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});

/* ── Systems-in-motion: scroll-driven scenes (Apple-style scrollytelling) ── */
(function vizScenes() {
  const scenes = document.querySelectorAll('.viz-scene');
  if (!scenes.length) return;
  const ease = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;

  const beltPath = document.getElementById('viz-al-belt');
  const beltLen  = beltPath ? beltPath.getTotalLength() : 0;
  const boxes    = beltPath ? Array.from(document.querySelectorAll('#viz-al-boxes rect')) : [];
  const racks    = beltPath ? Array.from(document.querySelectorAll('#viz-al-racks rect')) : [];
  racks.forEach(r => { r.style.opacity = 0; });

  function update() {
    const vh = window.innerHeight;
    scenes.forEach(scene => {
      const r = scene.getBoundingClientRect();
      const total = r.height - vh;
      const p = ease(Math.min(Math.max(-r.top / total, 0), 1));
      const kind = scene.dataset.viz;

      if (kind === 'almaden' && beltPath) {
        // belt rollers move continuously with scroll
        beltPath.style.strokeDashoffset = -p * 300;
        // boxes ride the belt, spaced out, looping across the scene
        boxes.forEach((b, i) => {
          const t = Math.min((p * 1.15 + i * 0.28) % 1.0, 1);
          const pt = beltPath.getPointAtLength(beltLen * t);
          b.setAttribute('x', pt.x - 11);
          b.setAttribute('y', pt.y - 22);
          b.style.opacity = p > 0.02 ? 1 : 0;
        });
        // racks assemble into place one by one
        racks.forEach((r, i) => {
          const rp = Math.min(Math.max(p * racks.length * 1.3 - i, 0), 1);
          r.style.opacity = rp;
          r.setAttribute('transform', `translate(0 ${(1 - rp) * 14})`);
        });
        document.getElementById('viz-al-sku').textContent = Math.round(lerp(0, 400, p));
        document.getElementById('viz-al-tp').textContent = Math.round(lerp(0, 48, p)) + '%';
      }

      if (kind === 'kanban') {
        scene.querySelectorAll('.vk-bar').forEach(b => {
          const h = lerp(+b.dataset.from, +b.dataset.to, p);
          b.querySelector('i').style.height = h * 0.85 + '%';
        });
        document.getElementById('viz-kb-inv').textContent = Math.round(lerp(0, 48, p)) + '%';
        document.getElementById('viz-kb-sav').textContent =
          '$' + Math.round(lerp(0, 400, p)) + 'K';
      }

      if (kind === 'takt') {
        scene.querySelectorAll('.vt-bar').forEach(b => {
          const h = lerp(+b.dataset.from, +b.dataset.to, p);
          b.querySelector('i').style.height = h * 0.85 + '%';
        });
        document.getElementById('viz-tk-n').textContent = Math.round(lerp(0, 18, p)) + '%';
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();
