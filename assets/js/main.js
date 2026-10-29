/* ==========================================================
   GENERAL PAGE BEHAVIOUR
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  /* Decorative icons are hidden from screen readers */
  document.querySelectorAll('.ic').forEach(function (s) { s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); });

  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ----- Contact details from config.js (nothing is invented: empty values leave the placeholders) ----- */
  var cfg = window.HARMONY_CONFIG || {};
  var digits = function (v) { return String(v || '').replace(/[^\d+]/g, ''); };
  var waDigits = String(cfg.whatsapp || '').replace(/\D/g, '');
  var links = {
    call: cfg.phone ? 'tel:' + digits(cfg.phone) : '',
    whatsapp: waDigits ? 'https://wa.me/' + waDigits : '',
    email: cfg.email ? 'mailto:' + cfg.email : ''
  };
  document.querySelectorAll('[data-contact]').forEach(function (a) {
    var href = links[a.getAttribute('data-contact')];
    if (!href) return;
    a.setAttribute('href', href);
    if (href.indexOf('http') === 0) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener noreferrer'); }
  });
  var texts = { phone: cfg.phone, whatsapp: cfg.whatsapp, email: cfg.email, timing: cfg.timing };
  document.querySelectorAll('[data-contact-text]').forEach(function (el) {
    var v = texts[el.getAttribute('data-contact-text')];
    if (v) el.textContent = v;
  });
});

/* ==========================================================
   UI CLICK SOUND
   One soft, very short tick, played only after a real user
   click / tap / key press on an interactive control. Nothing
   plays on page load. A single delegated listener is used, so
   listeners can never be duplicated. Blocked or missing audio
   fails silently.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  if (window.__harmonyClickSound) return;
  window.__harmonyClickSound = true;

  var SRC = 'assets/media/ui-click.mp3';
  var VOLUME = 0.25;
  var CONTROLS = 'button, a.btn, .btn, .card-action, .nav-desktop a, .offcanvas a, .bottom-nav a, .fab, .icon-btn, .journey-step, .map-link, .contact-val, .footer-grid a, .acc-trigger, .machine-toggle, .nav-dropdown-toggle, .nav-group-toggle, .nav-dropdown a, .nav-sublist a, .gallery-item';
  var audio = null;
  var unavailable = false;

  /* Created (not played) up front so the file is ready for the first click */
  try {
    audio = new Audio(SRC);
    audio.preload = 'auto';
    audio.volume = VOLUME;
    audio.addEventListener('error', function () { unavailable = true; });
  } catch (err) { unavailable = true; }

  function playClickSound() {
    if (unavailable || !audio) return;
    try {
      audio.currentTime = 0;
      var result = audio.play();
      if (result && typeof result.catch === 'function') { result.catch(function () { /* blocked by the browser: ignore */ }); }
    } catch (err) { /* ignore */ }
  }

  document.addEventListener('click', function (e) {
    if (!e.isTrusted) return; /* ignore script-generated clicks */
    var control = e.target.closest ? e.target.closest(CONTROLS) : null;
    if (!control) return;
    if (control.disabled || control.getAttribute('aria-disabled') === 'true') return;
    playClickSound();
  });
});
