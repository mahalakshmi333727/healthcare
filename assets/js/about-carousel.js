/* About page facility carousel: swipe/scroll, arrow buttons, gentle autoplay that pauses on interaction */
(function () {
  var track = document.querySelector('.ag-track');
  if (!track) return;
  var prev = document.querySelector('.ag-prev'), next = document.querySelector('.ag-next');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null, paused = false;

  function step() { var s = track.querySelector('.ag-slide'); return s ? s.getBoundingClientRect().width + 16 : track.clientWidth; }
  function go(dir) {
    var max = track.scrollWidth - track.clientWidth;
    if (dir > 0 && track.scrollLeft >= max - 4) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: max, behavior: 'smooth' });
    else track.scrollBy({ left: dir * step(), behavior: 'smooth' });
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() { if (reduce || paused || timer) return; timer = setInterval(function () { go(1); }, 4500); }
  function hold() { paused = true; stop(); }

  prev && prev.addEventListener('click', function () { hold(); go(-1); });
  next && next.addEventListener('click', function () { hold(); go(1); });
  ['pointerdown', 'touchstart', 'wheel', 'focusin'].forEach(function (e) { track.addEventListener(e, hold, { passive: true }); });
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', function () { if (!paused) start(); });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { hold(); go(1); } else if (e.key === 'ArrowLeft') { hold(); go(-1); }
  });
  start();
})();
