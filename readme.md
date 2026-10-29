# Harmony Diagnostic website (7 separate pages)

Open `index.html` in a browser (or serve the folder). No build step, no CDN, no vendor libraries.
HTML = structure, CSS = `assets/css`, JavaScript = `assets/js`. There is no inline CSS or JS.

## Pages
| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about.html` |
| Our Machines / Equipment (View Details dropdown on every machine) | `machines.html` |
| Services (dropdown per service: MRI, Dental CBCT, Dental OPG, General X-ray, Dental X-ray, Ultrasound; plus laboratory, cardiac, hearing, eye, counselling, packages, home services) | `services.html` |
| Family Counselling (Meera Babu) | `family-counselling.html` |
| Gallery (equipment photographs, click to enlarge) | `gallery.html` |
| Contact Us (details, enquiry form, map) | `contact.html` |

Header, footer, mobile menu and bottom bar are repeated in each file. The active page is marked in the HTML
(`class="is-active"` and `aria-current="page"`). If you change the menu, change it in all 7 files.

## New / changed files
- `assets/css/pages.css`: styles for the new components (page banner, dropdown menus, accordions, machine details, gallery).
- `assets/js/navigation.js`: rewritten for multi-page use (mobile menu, desktop dropdowns, mobile submenus).
- `assets/js/accordion.js`: View Details and service dropdowns (keyboard support, opens from links such as `services.html#mri`).
- `assets/js/gallery.js`: gallery lightbox.
- `assets/js/main.js` (click-sound selector extended) and `assets/js/form.js` (`contact.html?service=counselling` preselects the enquiry type).
- Removed: `assets/js/journey.js` (home-services photo switcher) and `assets/images/people/` (illustrative people images no longer used).

## Content that still needs the owner
- No photo exists in the project for a Dental OPG machine, a dental X-ray machine or a machine called "5XL", so no machine cards were made for them.
- MRI, Dental OPG and Dental X-ray services are described in general terms on `services.html`; please confirm they are offered.
- Meera Babu's page lists no qualifications or experience (none were supplied).
- Phone, WhatsApp and timings: set in `assets/js/config.js` (buttons switch from the contact page to real links automatically).
- The `<!-- CONTENT NOTE -->` comments (philosophy, cardiac, eye testing, home services) mark copy still to be pasted.

## 1. Replace the placeholder images (important)
Image files are neutral placeholders, **not photographs**. See `assets/images/IMAGE-GUIDE.md`: it lists, per
file, which section it supports, what the photo must show, what to avoid, and the minimum size.
Keep the same filenames and the layout, crop and alt text will already fit.

## 2. Add your real contact details: `assets/js/config.js`
Set `phone`, `whatsapp`, `email`, `timing`. The Call and WhatsApp floating buttons, the hero buttons and the
Contact cards switch to real `tel:` / `wa.me` / `mailto:` links automatically. Empty values keep the placeholders.

## 3. Switch on the enquiry form: `assets/js/config.js`
The form validates in the browser (required fields, phone, email, message, past dates). Delivery:
- `formEndpoint`: URL of your form service or backend (JSON POST). Shows success / error states.
- or leave it empty and set `email` (opens a pre-filled email) or `whatsapp` with `formFallback: 'whatsapp'`.
- With nothing configured the form tells visitors the enquiry was NOT sent (it never pretends).
No API keys or credentials are included. Do not put secrets in `config.js` (it is public).

## 4. Still to fill
- Paste the remaining supplied copy where `<!-- CONTENT NOTE ... -->` appears in `index.html`.
- Map: uses a Google Maps search embed for "Pallikaranai, Chennai, Tamil Nadu, India" (no invented pin).
  When the exact business listing is verified, replace the iframe `src` with the Share > Embed URL from Google Maps.
- Canonical URL, Open Graph image, local-business structured data.

## Design system (redesign)
- Colours and type live in `assets/css/theme.css`: reference navy `--accent` (#293F80), reference red `--accent-secondary` (#D92738), white and light blue-grey base, light and dark themes.
  Headings use a serif system stack and body text a clean system sans (no web fonts, no CDN).
- Layout, components and the bento / directory / ledger compositions are in `assets/css/style.css`; breakpoints in `responsive.css`
  (header CTA 700/1360px, hamburger + bottom bar at 1024px and below, stacking at 900 / 700 / 560 / 380px).
- Placeholder photos are toned into the palette with `--img-filter`, `--img-blend` and `--img-tone` in `theme.css`.
  **When real photographs are added, set `--img-filter: none; --img-blend: normal; --img-tone: transparent;` (light and dark blocks).**
- The active link in the header, menu and bottom bar follows the section being read (`assets/js/navigation.js`).

## UI click sound
`assets/media/ui-click.mp3` (under 1 KB) plays a very soft tick after a real click / tap on buttons, nav, menu controls, the theme toggle,
card actions and the floating buttons. It never plays on page load. The code is in `assets/js/main.js` ("UI CLICK SOUND"); swap the file
(same name) to change the sound, or lower `VOLUME` there.

## Structure
`assets/css`: theme.css (tokens, light/dark), style.css, responsive.css.
`assets/js`: theme, config, main, navigation, animations (scroll reveal), journey (home services), form.
`assets/images/{hero,about,services,roof,packages,home-services}`, `assets/media/` (UI sound).


## Image update
All 19 image slots were mapped to unique Pexels photographs relevant to their section. The image CSS filter/blend is disabled so photographs render in their natural colours.

## Diagnostic equipment images (new)
The `#equipment` section ("Diagnostic Equipment", between Health Packages and Home Services) shows 13 supplied equipment photos,
grouped as Laboratory (9) and Imaging & Radiology (4). Optimised files are in `assets/images/equipment/` (800x600 JPG on white,
shown with `object-fit: contain` so the whole machine is visible). The untouched originals are kept in `source-images/healthcareimgs/`
(not used by the site; safe to delete before publishing). Styles: end of `assets/css/style.css` and `responsive.css`.
Please confirm the equipment shown matches what Harmony actually operates or uses before going live.
Note: the hero, about, service, package and home-service photographs still load from the Pexels / GITAM URLs already in `index.html`
(internet needed); the local files under `assets/images/{hero,about,services,roof,packages,home-services}` are unused neutral placeholders.

## Content update (professional rewrite)
- `services.html`: all question-style headings were replaced with declarative content. Each imaging service now follows one structure:
  introduction, Clinical Applications, Patient Information and an enquiry button. Laboratory, cardiac, hearing, eye testing,
  counselling, health check-up packages and home healthcare were rewritten in the same tone.
- Question-style headings were also removed from `about.html`, `family-counselling.html` and `machines.html`; repeated or awkward
  copy on `index.html` and `contact.html` was tidied. No CSS, JavaScript, image or file names were changed.

### Still needs owner confirmation (marked with `<!-- OWNER TO CONFIRM -->` / `<!-- CONTENT NOTE -->` in the HTML)
- MRI, Dental OPG and Dental X-ray: no machine for these is listed on `machines.html`. Confirm they are offered.
- Cardiac (ECG / Echo): only generic descriptions are used; paste the supplied cardiac copy where marked.
- Eye testing: the specific tests offered were never supplied; add them where marked.
- Home healthcare services and "Our Healthcare Philosophy" (`about.html`): supplied copy still to be pasted.
- Package inclusions and pricing are not stated anywhere on the site; none were invented.
