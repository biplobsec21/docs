// TukTakKaj prototype interactions (no backend — mock only)
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // modals
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o){ e.preventDefault(); const m = document.getElementById(o.dataset.open); if (m){ m.classList.add('open'); const f = m.querySelector('input,button:not([data-close])'); f && f.focus(); } }
    const c = e.target.closest('[data-close]');
    if (c){ c.closest('.modal-bg').classList.remove('open'); }
    if (e.target.classList.contains('modal-bg')) e.target.classList.remove('open');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $$('.modal-bg.open').forEach(m => m.classList.remove('open')); });

  // single-select chip / tab groups
  $$('[data-group]').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('.chip,button,a'); if (!b || !g.contains(b)) return;
    if (b.getAttribute('href') && b.getAttribute('href') !== '#') return;
    e.preventDefault(); $$('.on', g).forEach(x => x.classList.remove('on')); b.classList.add('on');
    const t = b.dataset.show; if (t){ $$('[data-pane]').forEach(p => p.hidden = p.dataset.pane !== t); }
  }));

  // countdowns: data-countdown="seconds"
  $$('[data-countdown]').forEach(el => {
    let s = parseInt(el.dataset.countdown, 10);
    const fmt = n => { const h = Math.floor(n/3600), m = Math.floor(n%3600/60), x = n%60;
      return h ? `${h}h ${String(m).padStart(2,'0')}m` : `${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`; };
    el.textContent = fmt(s);
    setInterval(() => { if (s > 0) s--; el.textContent = fmt(s); if (s < 120 && el.dataset.warn !== undefined) el.classList.add('warn'); }, 1000);
  });

  // OTP inputs auto-advance
  $$('.otp').forEach(g => { const ins = $$('input', g);
    ins.forEach((i, k) => { i.addEventListener('input', () => { i.value = i.value.replace(/\D/g,'').slice(0,1); if (i.value && ins[k+1]) ins[k+1].focus(); });
      i.addEventListener('keydown', e => { if (e.key === 'Backspace' && !i.value && ins[k-1]) ins[k-1].focus(); }); }); });

  // wizard: [data-wizard] with [data-step] panes, [data-next]/[data-prev]
  $$('[data-wizard]').forEach(w => {
    const panes = $$('[data-step]', w), dots = $$('[data-dot]');
    let i = 0;
    const go = n => { i = Math.max(0, Math.min(panes.length-1, n));
      panes.forEach((p, k) => p.hidden = k !== i);
      dots.forEach((d, k) => { d.classList.toggle('done', k < i); d.classList.toggle('now', k === i); });
      const bar = $('[data-progress]'); if (bar) bar.style.width = ((i+1)/panes.length*100) + '%';
      window.scrollTo({top: 0, behavior: 'smooth'}); };
    w.addEventListener('click', e => {
      if (e.target.closest('[data-next]')){ e.preventDefault(); go(i+1); }
      if (e.target.closest('[data-prev]')){ e.preventDefault(); go(i-1); }
      const j = e.target.closest('[data-goto]'); if (j){ e.preventDefault(); go(parseInt(j.dataset.goto,10)); }
    });
    go(0);
  });

  // star rating input
  $$('[data-rate]').forEach(g => { const ss = $$('button', g);
    ss.forEach((b, k) => b.addEventListener('click', () => { ss.forEach((x, j) => x.classList.toggle('on', j <= k)); const out = g.nextElementSibling; if (out) out.textContent = ['Poor','Fair','Good','Very good','Excellent'][k]; })); });

  // simple toggle: data-toggle="#id"
  $$('[data-toggle]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const t = $(b.dataset.toggle); if (t) t.hidden = !t.hidden; }));
})();
