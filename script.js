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
      ${r.documentUrl ? `<a class="rec-link" href="${r.documentUrl}" target="_blank" rel="noreferrer">View recommendation letter ↗</a>` : ''}
    </div>
  `).join('');

  document.querySelectorAll('#rec-list .reveal').forEach(el => observer.observe(el));
})();

/* ── Hero scroll parallax (Apple-style fade + drift) ── */
(function heroParallax() {
  const heroInner = document.querySelector('.hero-inner');
  const photo = document.querySelector('.hero-photo-wrap');
  if (!heroInner) return;

  let ticking = false;
  function update() {
    const y = window.scrollY;
    const h = window.innerHeight;
    const p = Math.min(y / (h * 0.7), 1);          // 0 → 1 over first 70vh
    heroInner.style.opacity = 1 - p * 0.9;
    heroInner.style.transform = `translateY(${y * 0.28}px)`; // content drifts slower than scroll
    if (photo) photo.style.transform = `scale(${1 - p * 0.12})`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

/* ── Staggered children ── */
document.querySelectorAll('[data-stagger]').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});
