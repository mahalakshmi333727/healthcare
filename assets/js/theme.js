/* ==========================================================
   THEME (light / dark) - loaded in <head> to avoid a flash
   ========================================================== */
(function () {
  var KEY = 'harmony-theme';
  var root = document.documentElement;
  root.classList.add('js'); /* lets CSS hide reveal items only when JS can show them */
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked */ }
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
      });
    });
  });
})();
