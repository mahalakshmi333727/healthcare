/* ==========================================================
   SCROLL REVEAL & STAT COUNTERS
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  var heroImg = document.querySelectorAll('.reveal--img:not(.reveal)');
  var counters = document.querySelectorAll('[data-count]');

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (i) { i.classList.add('is-visible'); });
    heroImg.forEach(function (i) { i.classList.add('is-visible'); });
    return;
  }
  var revealIO = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        el.classList.add('is-visible');
        /* Once the stagger finishes, drop the delay so hover effects respond instantly */
        el.addEventListener('transitionend', function settle(ev) {
          if (ev.propertyName === 'opacity' || ev.propertyName === 'clip-path') { el.classList.add('is-settled'); el.removeEventListener('transitionend', settle); }
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (i) { revealIO.observe(i); });
  /* Non-.reveal image frames (hero) reveal on load */
  heroImg.forEach(function (i) {
    requestAnimationFrame(function () { i.classList.add('is-visible'); });
    /* After the wipe-in, hover zoom switches to a short, subtle transition */
    i.addEventListener('transitionend', function settle(ev) {
      if (ev.propertyName === 'clip-path') { i.classList.add('is-settled'); i.removeEventListener('transitionend', settle); }
    });
  });

  function run(el) {
    var end = parseInt(el.getAttribute('data-count'), 10), t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(end * p);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var countIO = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { countIO.observe(c); });
});
