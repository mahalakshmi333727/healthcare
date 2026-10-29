/* ==========================================================
   DISCLOSURE: machine "View Details" and service dropdowns
   Buttons marked data-disclosure toggle the panel named in aria-controls.
   - Enter / Space work natively (real <button> elements)
   - Arrow Up / Down, Home and End move between the buttons of one group
   - A link such as services.html#mri opens the matching item
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-disclosure]'));
  if (!buttons.length) return;

  function setState(btn, open) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    var host = btn.closest('[data-disclosure-host]');
    if (host) host.classList.toggle('is-open', open);
    var label = btn.querySelector('.toggle-label');
    if (label) label.textContent = open ? label.getAttribute('data-open') : label.getAttribute('data-closed');
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setState(btn, btn.getAttribute('aria-expanded') !== 'true');
    });
    btn.addEventListener('keydown', function (e) {
      var keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (keys.indexOf(e.key) === -1) return;
      var group = btn.closest('[data-disclosure-group]');
      if (!group) return;
      var list = Array.prototype.slice.call(group.querySelectorAll('[data-disclosure]'));
      var idx = list.indexOf(btn), n = list.length, next;
      if (e.key === 'ArrowDown') next = list[(idx + 1) % n];
      else if (e.key === 'ArrowUp') next = list[(idx - 1 + n) % n];
      else if (e.key === 'Home') next = list[0];
      else next = list[n - 1];
      e.preventDefault();
      next.focus();
    });
  });

  function openFromHash(scroll) {
    var id = '';
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (err) { return; }
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var btn = el.hasAttribute('data-disclosure') ? el : el.querySelector('[data-disclosure]');
    if (btn) setState(btn, true);
    if (scroll) el.scrollIntoView();
  }
  window.addEventListener('hashchange', function () { openFromHash(true); });
  openFromHash(false);
});
