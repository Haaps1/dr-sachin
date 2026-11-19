# Dr Sachin G R: Website (drsachinneurocare.com)

Website for Dr Sachin G R, senior neurosurgeon (brain & spine surgery). PHP site for Hostinger
(any Apache/LiteSpeed host with PHP 7.4+). No database, no build step.

```
index.php, about.php, contact.php    Main pages (served as / , /about.html, /contact.html)
privacy-policy.php                   Privacy Policy
treatments/*.php                     14 treatment pages (served as /treatments/<name>.html)
404.php                              "Page not found" page
coming-soon.php                      Coming Soon page (switch in includes/config.php)
includes/config.php                  SETTINGS: Coming Soon on/off and preview key
includes/header.php                  Shared site header (logo, menu, Treatments dropdown)
includes/footer.php                  Shared footer, phone tab bar and Treatments sheet
includes/bootstrap.php               Loads settings, menu highlighting, Coming Soon logic
.htaccess                            https + non-www redirects, .html addresses, 404, redirects,
                                     security headers, blocking of private files, caching
sitemap.xml, robots.txt, llms.txt    Search engine and AI-assistant files
assets/                              CSS, JS, fonts, images
```

## Coming Soon: turn on / off

Edit `includes/config.php` (Hostinger: File Manager > public_html > includes > config.php):

- `define('COMING_SOON', true);`  Coming Soon page ON for all visitors (sends "503, come back later",
  so Google does not drop the site).
- `define('COMING_SOON', false);` website LIVE.

While it is ON you can view the real site at `https://drsachinneurocare.com/?preview=dr-33b4cc3e25fd`
(remembered for 30 days). Change `PREVIEW_KEY` to any word to make a new link. Note: this repository is
public, so the key in it can be seen; change it on the server if that matters.

## Editing

- Header/menu: `includes/header.php`. Footer and phone menu: `includes/footer.php`. A change there
  updates every page.
- Phone / WhatsApp / email also live in the `SITE` object at the top of `assets/js/main.js`.
- Placeholders to confirm before launch: email `care@drsachinneurocare.com` (create this mailbox in
  Hostinger or change it) and the consultation hours (Contact page and footer).
- Testimonials on the home page are samples (marked "Sample").
- Redirects: add lines in section 3 of `.htaccess`.

## Notes

- All addresses use https and no "www"; www requests are 301-redirected and marked noindex.
- No tracking, analytics or third-party scripts. A strict Content-Security-Policy is set in `.htaccess`.
- The appointment form has no backend; it opens WhatsApp with a pre-filled message.
- Hero images on treatment pages are AI-generated illustrations (Canva). Medical content is general
  patient information, not a substitute for a consultation.
