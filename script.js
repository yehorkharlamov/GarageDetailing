// ── RENDER: Services ─────────────────────────────────────────
function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = CONTENT.services.map(s => `
    <div class="service-card">
      <div class="service-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </div>
  `).join('');
}

// ── RENDER: Gallery ───────────────────────────────────────────
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = CONTENT.gallery.map(pair => `
    <div class="ba-slider">
      <div class="ba-before-img">
        <img src="${pair.before}" alt="Before" onerror="this.style.display='none'" />
        <div class="ba-placeholder"><span>📷</span><p>${pair.before}</p></div>
      </div>
      <div class="ba-after-img">
        <img src="${pair.after}" alt="After" onerror="this.style.display='none'" />
        <div class="ba-placeholder"><span>✨</span><p>${pair.after}</p></div>
      </div>
      <span class="ba-label ba-label-left">Before</span>
      <span class="ba-label ba-label-right">After</span>
      <div class="ba-handle">
        <div class="ba-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  `).join('');
}

// ── RENDER: Videos ────────────────────────────────────────────
function renderVideos() {
  const wrap = document.getElementById('videoWrap');
  if (!wrap) return;
  wrap.innerHTML = CONTENT.videos.map(v => `
    <div class="video-item">
      <div class="video-container">
        <video controls preload="metadata">
          <source src="${v.src}" type="video/mp4">
        </video>
      </div>
      <p class="video-caption">${v.caption}</p>
    </div>
  `).join('');
}

// ── INIT: Before / After sliders ─────────────────────────────
function initSliders() {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const afterEl = slider.querySelector('.ba-after-img');
    const handle  = slider.querySelector('.ba-handle');
    let dragging  = false;

    function setPos(clientX) {
      const rect = slider.getBoundingClientRect();
      const pct  = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left      = `${pct}%`;
    }

    slider.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
    window.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup',    () => { dragging = false; });
    slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend',   () => { dragging = false; });
  });
}

// ── INIT: Corner squares on service cards ─────────────────────
function initCorners() {
  document.querySelectorAll('.service-card').forEach(card => {
    const corners = document.createElement('div');
    corners.className = 'card-corners';
    corners.innerHTML =
      '<span class="corner-sq tl"></span>' +
      '<span class="corner-sq tr"></span>' +
      '<span class="corner-sq bl"></span>' +
      '<span class="corner-sq br"></span>';
    card.appendChild(corners);
  });
}

// ── INIT: Scroll reveal ───────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.service-card, .why-feature, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  });
}

// ── INIT: Animated stat counters ─────────────────────────────
function runCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000;
  const start    = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

// ── INIT: Mobile nav ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ── INIT: Formspree ───────────────────────────────────────────
window.formspree = window.formspree || function () { (formspree.q = formspree.q || []).push(arguments); };
formspree('initForm', { formElement: '#contactForm', formId: 'mrerjdwz' });

// ── INIT: Pricing tabs ────────────────────────────────────────
document.querySelectorAll('.pricing-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pricing-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ── BOOT ──────────────────────────────────────────────────────
renderServices();
renderGallery();
renderVideos();
initSliders();
initCorners();
initScrollReveal();

window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.stat-num[data-target]').forEach(runCounter);
  }, 700);
});
