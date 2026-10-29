/* ==========================================================
   GALLERY LIGHTBOX (native <dialog>)
   Click or press Enter on an image to enlarge it. Arrow keys move
   between images, Escape or the close button closes it, and focus
   returns to the image that was opened.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var dialog = document.getElementById('lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  if (!dialog || !items.length || typeof dialog.showModal !== 'function') return;

  var img = document.getElementById('lightbox-img');
  var caption = document.getElementById('lightbox-caption');
  var closeBtn = dialog.querySelector('.lightbox-close');
  var prevBtn = dialog.querySelector('.lightbox-prev');
  var nextBtn = dialog.querySelector('.lightbox-next');
  var index = 0;

  function show(i) {
    index = (i + items.length) % items.length;
    var item = items[index];
    img.src = item.getAttribute('data-full');
    img.alt = item.querySelector('img').getAttribute('alt') || '';
    caption.textContent = item.getAttribute('data-caption') || '';
  }
  items.forEach(function (item, i) {
    item.addEventListener('click', function () { show(i); dialog.showModal(); closeBtn.focus(); });
  });
  closeBtn.addEventListener('click', function () { dialog.close(); });
  prevBtn.addEventListener('click', function () { show(index - 1); });
  nextBtn.addEventListener('click', function () { show(index + 1); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  });
  dialog.addEventListener('close', function () { items[index].focus(); });
});
