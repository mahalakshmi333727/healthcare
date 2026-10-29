/* ==========================================================
   SITE CONFIGURATION
   Fill these in when the real details are confirmed. Leave a value
   empty ('') and the site keeps its placeholder / safe fallback.
   Do not put secrets or API keys in this file: it is public.
   ========================================================== */
window.HARMONY_CONFIG = {
  phone: '',          /* e.g. '+91 98765 43210'  -> enables Call buttons (tel:) */
  whatsapp: '',       /* e.g. '919876543210' (country code + number) -> enables WhatsApp */
  email: 'Harmonyhealthcare2021@gmail.com',
  timing: '',         /* e.g. 'Mon-Sat, 7:00 AM - 8:00 PM' */
  /* How the enquiry form is delivered. Use ONE of:
     1) formEndpoint: URL of your form service / backend that accepts a JSON POST
        (for example a Formspree, Getform or your own endpoint URL).
     2) leave it empty and set `email` (opens the visitor's email app, pre-filled)
        or `whatsapp` (opens WhatsApp, pre-filled) and set formFallback below. */
  formEndpoint: '',
  formFallback: 'email' /* 'email' | 'whatsapp' */
};
