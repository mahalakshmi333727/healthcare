/* ==========================================================
   NAVIGATION
   - Mobile off-canvas menu (open, close, focus trap, Escape)
   - Expandable groups inside the mobile menu (Machines, Services)
   - Desktop dropdown menus (click, hover, keyboard, Escape, outside click)
   The active page is marked in the HTML (class is-active + aria-current="page").
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('mobile-menu');
  var backdrop = document.querySelector('.backdrop');
  var closeBtn = document.querySelector('.menu-close');
  var FOCUSABLE = 'a[href], button:not([disabled])';

  /* ----- Mobile menu ----- */
  if (toggle && panel && backdrop && closeBtn) {
    var setMenu = function (open, restoreFocus) {
      panel.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
      if (open) { closeBtn.focus(); } else if (restoreFocus) { toggle.focus(); }
    };
    var visibleItems = function () {
      return Array.prototype.filter.call(panel.querySelectorAll(FOCUSABLE), function (el) { return el.offsetParent !== null; });
    };
    toggle.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false, true); });
    backdrop.addEventListener('click', function () { setMenu(false, true); });

    document.addEventListener('keydown', function (e) {
      if (!panel.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setMenu(false, true); return; }
      if (e.key === 'Tab') { /* keep keyboard focus inside the open menu */
        var items = visibleItems();
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Any link in the menu closes it (same-page links such as services.html#mri keep the visitor on the page) */
    panel.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false, false); });
    });

    /* Expandable groups */
    panel.querySelectorAll('.nav-group-toggle').forEach(function (btn) {
      var list = document.getElementById(btn.getAttribute('aria-controls'));
      if (!list) return;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        list.hidden = !open;
      });
    });

    /* The menu never stays open after the layout switches back to desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && panel.classList.contains('is-open')) { setMenu(false, false); }
    });
  }

  /* ----- Desktop dropdowns ----- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav-item--dropdown'));
  if (!items.length) return;
  var canHover = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : { matches: false };

  function setOpen(item, open, how) {
    var btn = item.querySelector('.nav-dropdown-toggle');
    var menu = item.querySelector('.nav-dropdown');
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) { item.setAttribute('data-opened', how || 'click'); } else { item.removeAttribute('data-opened'); }
  }
  function closeAll(except) { items.forEach(function (i) { if (i !== except) setOpen(i, false); }); }

  items.forEach(function (item) {
    var btn = item.querySelector('.nav-dropdown-toggle');
    var menu = item.querySelector('.nav-dropdown');
    var timer = null;
    function links() { return Array.prototype.slice.call(menu.querySelectorAll('a')); }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = !menu.hidden;
      if (isOpen && item.getAttribute('data-opened') === 'hover') { item.setAttribute('data-opened', 'click'); return; } /* pin a hover-opened menu */
      closeAll(item);
      setOpen(item, !isOpen, 'click');
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); closeAll(item); setOpen(item, true, 'click'); links()[0].focus(); }
      else if (e.key === 'Escape') { setOpen(item, false); }
    });
    menu.addEventListener('keydown', function (e) {
      var list = links(), idx = list.indexOf(document.activeElement), n = list.length;
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(idx + 1) % n].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); list[(idx - 1 + n) % n].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); list[n - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); setOpen(item, false); btn.focus(); }
    });
    /* Close when focus moves to something outside this menu */
    item.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !item.contains(e.relatedTarget)) { setOpen(item, false); }
    });
    /* Menu links close the menu (same-page anchors keep the page loaded) */
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(item, false); }); });

    item.addEventListener('mouseenter', function () {
      if (!canHover.matches) return;
      clearTimeout(timer);
      if (menu.hidden) { closeAll(item); setOpen(item, true, 'hover'); }
    });
    item.addEventListener('mouseleave', function () {
      if (!canHover.matches) return;
      if (item.getAttribute('data-opened') === 'hover') {
        timer = setTimeout(function () { if (item.getAttribute('data-opened') === 'hover') { setOpen(item, false); } }, 150);
      }
    });
  });

  document.addEventListener('click', function (e) {
    items.forEach(function (i) { if (!i.contains(e.target)) setOpen(i, false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
});
