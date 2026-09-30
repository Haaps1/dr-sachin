# Dr Sachin G R — Website

Website for Dr Sachin G R, senior neurosurgeon (brain & spine surgery).
Static site with no build step: open `index.html` or serve the folder with any static host
(GitHub Pages, Netlify, Vercel, cPanel…).

```
index.html              Home: brain image hero, specialities, technology, why, journey, warning signs,
                        second opinion, testimonials, FAQs
about.html              About: bio, qualifications, training world map, philosophy
treatments/brain-tumor-surgery.html   Brain Tumor Surgery (the only treatment page for now)
contact.html            Contact: call / WhatsApp / email, hours, appointment form (opens WhatsApp)
manifest.webmanifest    Lets phones "Add to Home Screen" like an app
assets/css/style.css    Design tokens (colours, fonts), layout, responsive rules, motion
assets/js/main.js       Shared interactions + CONTACT DETAILS (SITE object at the top)
assets/js/treatments.js All treatment content (name, summary, overview, when needed, approach, recovery)
assets/img/             Logo mark, icon sprite and hero-brain.webp (hero image supplied by the client)
assets/fonts/           Self-hosted Poppins & Roboto (SIL Open Font License / Apache 2.0)
```

## Updating content

- **Phone / WhatsApp / email** live in the `SITE` object at the top of `assets/js/main.js`.
  The same values are in the HTML as the no-JavaScript fallback. Search for `99142 08940` and
  `care@drsachingr.com` to update them everywhere.
- **Placeholders to replace before launch:** the email address (`care@drsachingr.com`) and the
  consultation hours on the Contact page and in the footer are dummy values.
- **Doctor photo:** `assets/img/dr-sachin.webp` (supplied by the client).
  Used on Home (Meet your neurosurgeon), About and the treatment page doctor card.
- **Treatments:** only Brain Tumor Surgery has a page so far. The other treatments are listed on the
  home page without links until their pages are written.
- **Hero image:** `assets/img/hero-brain.webp` on Home and Brain Tumor Surgery (static).
  Make sure you hold the licence for it before launch.
- **Testimonials** on the home page are **samples** (marked "Sample"). Replace them with genuine
  reviews shared with the patient's consent. See the comment above the section in `index.html`.

## Notes

- Mobile layout behaves like an app: bottom tab bar with a centre call button and app-style page
  transitions in supporting browsers.
- Motion respects `prefers-reduced-motion`. Canvases pause when off-screen or in background tabs.
- The appointment form has no backend. It opens WhatsApp with a pre-filled message.
- Medical content is general patient information, not a substitute for a consultation.
