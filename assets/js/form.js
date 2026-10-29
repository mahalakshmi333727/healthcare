/* ==========================================================
   ENQUIRY FORM: custom validation + submission
   Delivery is configured in config.js (formEndpoint, or an
   email / WhatsApp fallback). No credentials live in this file.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var cfg = window.HARMONY_CONFIG || {};
  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var dateField = form.elements.date;

  /* Preferred date cannot be in the past */
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  dateField.setAttribute('min', todayISO());

  /* Preselect the enquiry type when a visitor arrives from another page (contact.html?service=counselling) */
  try {
    var wanted = new URLSearchParams(window.location.search).get('service');
    var presets = {
      counselling: 'Counselling & family therapy',
      imaging: 'Imaging (MRI, X-Ray, Ultrasound)',
      dental: 'Dental imaging (CBCT, OPG, dental X-ray)',
      laboratory: 'Laboratory tests',
      cardiac: 'Cardiac tests (ECG, Echo)',
      hearing: 'Hearing test / hearing aids',
      eye: 'Eye testing',
      master: 'Master health check-up',
      preventive: 'Preventive health check-up',
      corporate: 'Corporate health screening',
      home: 'Home collection / home visit'
    };
    if (wanted && presets[wanted]) { form.elements.service.value = presets[wanted]; }
  } catch (err) { /* ignore: the visitor can still choose manually */ }

  var rules = {
    name: function (v) {
      if (!v) return 'Please enter your full name.';
      if (v.length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    phone: function (v) {
      if (!v) return 'Please enter your phone number.';
      var cleaned = v.replace(/[\s\-().]/g, '');
      var indian = /^(?:\+?91|0)?[6-9]\d{9}$/.test(cleaned);
      var intl = /^\+\d{8,15}$/.test(cleaned);
      return (indian || intl) ? '' : 'Enter a valid phone number, for example 98765 43210.';
    },
    email: function (v) {
      if (!v) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address, for example name@example.com.';
    },
    service: function (v) { return v ? '' : 'Please choose a service or enquiry type.'; },
    date: function (v) { return (!v || v >= todayISO()) ? '' : 'Please choose today or a future date.'; },
    message: function (v) { return v ? '' : 'Please write a short message about your enquiry.'; }
  };

  function field(name) { return form.elements[name]; }
  function errorEl(name) { return document.getElementById('f-' + name + '-error'); }

  function setError(name, msg) {
    var input = field(name), box = input.closest('.field'), err = errorEl(name);
    box.classList.toggle('has-error', !!msg);
    box.classList.toggle('is-valid', !msg && !!input.value.trim());
    if (msg) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); }
    err.textContent = msg;
    err.hidden = !msg;
  }

  function validateField(name) {
    var input = field(name);
    var msg = rules[name](input.value.trim());
    setError(name, msg);
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var input = field(name);
    /* Validate once the person leaves a field; then re-check live while fixing it */
    input.addEventListener('blur', function () { if (input.value.trim() || input.closest('.field').classList.contains('has-error')) validateField(name); });
    var live = function () { if (input.closest('.field').classList.contains('has-error')) validateField(name); };
    input.addEventListener('input', live);
    input.addEventListener('change', live);
  });

  function showStatus(kind, title, text) {
    status.hidden = false;
    status.className = 'field--full form-status form-status--' + kind;
    var icon = kind === 'success' ? 'i-check' : 'i-alert';
    status.innerHTML = '';
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ic'); svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + icon); svg.appendChild(use);
    var wrap = document.createElement('div');
    var h = document.createElement('strong'); h.textContent = title;
    var p = document.createElement('p'); p.textContent = text;
    wrap.appendChild(h); wrap.appendChild(p);
    status.appendChild(svg); status.appendChild(wrap);
    status.focus();
  }

  function setBusy(busy) {
    submitBtn.disabled = busy;
    form.classList.toggle('is-busy', busy);
    submitBtn.querySelector('.btn-label').textContent = busy ? 'Sending…' : 'Submit Enquiry';
  }

  function collect() {
    return {
      name: field('name').value.trim(),
      phone: field('phone').value.trim(),
      email: field('email').value.trim(),
      service: field('service').value,
      preferredDate: field('date').value,
      message: field('message').value.trim()
    };
  }

  function summary(d) {
    return 'Enquiry for Harmony Diagnostic\n' +
      'Name: ' + d.name + '\nPhone: ' + d.phone + '\nEmail: ' + d.email +
      '\nService: ' + d.service + '\nPreferred date: ' + (d.preferredDate || 'Not specified') +
      '\n\nMessage:\n' + d.message;
  }

  function onSuccess() {
    showStatus('success', 'Thank you. Your enquiry has been sent.', 'Our team will contact you on the phone number or email you provided.');
    form.reset();
    form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('has-error', 'is-valid'); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.hidden = true;

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = field(name);
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var data = collect();

    /* 1) Configured form endpoint (JSON POST) */
    if (cfg.formEndpoint) {
      setBusy(true);
      fetch(cfg.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        onSuccess();
      }).catch(function () {
        showStatus('error', 'We could not send your enquiry.', 'Please check your connection and try again, or call or WhatsApp us.');
      }).then(function () { setBusy(false); });
      return;
    }

    /* 2) Pre-filled email or WhatsApp, opened in the visitor's own app */
    if (cfg.formFallback === 'whatsapp' && cfg.whatsapp) {
      window.open('https://wa.me/' + String(cfg.whatsapp).replace(/\D/g, '') + '?text=' + encodeURIComponent(summary(data)), '_blank', 'noopener');
      showStatus('success', 'WhatsApp is opening with your enquiry.', 'Press send in WhatsApp to deliver it to our team.');
      return;
    }
    if (cfg.email) {
      window.location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent('Enquiry: ' + data.service) + '&body=' + encodeURIComponent(summary(data));
      showStatus('success', 'Your email app is opening with your enquiry.', 'Send the email to deliver it to our team.');
      return;
    }

    /* 3) Nothing configured yet: be honest instead of pretending it was sent */
    showStatus('error', 'Online enquiries are not switched on yet.', 'Your details have not been sent. Please call or WhatsApp us, or visit the centre in Pallikaranai.');
  });
});
