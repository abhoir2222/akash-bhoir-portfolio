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

/* ── Staggered children ── */
document.querySelectorAll('[data-stagger]').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});
