# Dr Sachin G R — Website

Website for Dr Sachin G R, senior neurosurgeon (brain & spine surgery).
Static site with no build step: open `index.html` or serve the folder with any static host
(GitHub Pages, Netlify, Vercel, cPanel…).

```
index.html              Home: glowing head-and-brain hero, specialities, 3D body treatment map, why, journey, testimonials, FAQs
about.html              About: bio, qualifications, training world map, philosophy
treatments/*.html       One page per treatment (25), all built from the same template
contact.html            Contact: call / WhatsApp / email, hours, appointment form (opens WhatsApp)
manifest.webmanifest    Lets phones "Add to Home Screen" like an app
assets/css/style.css    Design tokens (colours, fonts), layout, responsive rules, motion
assets/js/main.js       Shared interactions + CONTACT DETAILS (SITE object at the top)
assets/js/treatments.js All treatment content (name, summary, overview, when needed, approach, recovery)
assets/js/explorer.js   Treatment explorer: area filters, treatment list, 2D body fallback
assets/js/body3d.js     3D body (three.js, loaded only when the explorer is near the screen)
assets/vendor/          three.js and delaunator (MIT licence, self-hosted)
assets/img/             Logo mark and icon sprite
assets/fonts/           Self-hosted Poppins & Roboto (SIL Open Font License / Apache 2.0)
```

## Updating content

- **Phone / WhatsApp / email** live in the `SITE` object at the top of `assets/js/main.js`.
  The same values are in the HTML as the no-JavaScript fallback. Search for `99142 08940` and
  `care@drsachingr.com` to update them everywhere.
- **Placeholders to replace before launch:** the email address (`care@drsachingr.com`) and the
  consultation hours on the Contact page and in the footer are dummy values.
- **Doctor photo:** add `assets/img/dr-sachin.webp` (portrait, about 1000×1250, subject centred).
  It is used on the About page automatically. Until it exists, a stylised placeholder bust is shown.
- **Treatments:** content lives in `assets/js/treatments.js`. Each treatment has its own page,
  e.g. `treatments/endoscopic-spine-surgery.html`. The pages are generated from that data, so
  keep the text in the page and in `treatments.js` in sync when editing.
- **Testimonials** on the home page are **samples** (marked "Sample"). Replace them with genuine
  reviews shared with the patient's consent. See the comment above the section in `index.html`.

## Notes

- Mobile layout behaves like an app: bottom tab bar with a centre call button, bottom-sheet
  treatment details (drag down to close), and app-style page transitions in supporting browsers.
- Motion respects `prefers-reduced-motion`. Canvases pause when off-screen or in background tabs.
- The appointment form has no backend. It opens WhatsApp with a pre-filled message.
- Medical content is general patient information, not a substitute for a consultation.
