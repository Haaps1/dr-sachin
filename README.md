# Dr Sachin G R — Website

Website for Dr Sachin G R, senior neurosurgeon (brain & spine surgery).
Static site with no build step: open `index.html` or serve the folder with any static host
(GitHub Pages, Netlify, Vercel, cPanel…).

```
index.html              Home: animated brain hero, stats, interactive body map, why, journey, testimonials, FAQs
about.html              About: bio, qualifications, training world map, philosophy
services.html           Treatments: interactive body map + searchable A–Z directory (25 treatments)
contact.html            Contact: call / WhatsApp / email, hours, appointment form (opens WhatsApp)
manifest.webmanifest    Lets phones "Add to Home Screen" like an app
assets/css/style.css    Design tokens (colours, fonts), layout, responsive rules, motion
assets/js/main.js       Shared interactions + CONTACT DETAILS (SITE object at the top)
assets/js/treatments.js All treatment content (name, summary, overview, when needed, approach, recovery)
assets/js/explorer.js   Transparent-body explorer, treatment detail sheet, directory search/filter
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
- **Treatments:** edit `assets/js/treatments.js`. Each treatment gets its own shareable link,
  e.g. `services.html#t-endoscopic-spine-surgery`.
- **Testimonials** on the home page are **samples** (marked "Sample"). Replace them with genuine
  reviews shared with the patient's consent. See the comment above the section in `index.html`.

## Notes

- Mobile layout behaves like an app: bottom tab bar with a centre call button, bottom-sheet
  treatment details (drag down to close), and app-style page transitions in supporting browsers.
- Motion respects `prefers-reduced-motion`. Canvases pause when off-screen or in background tabs.
- The appointment form has no backend. It opens WhatsApp with a pre-filled message.
- Medical content is general patient information, not a substitute for a consultation.
