<?php
/* Coming Soon page. Turned on/off in includes/config.php (COMING_SOON). */
if (!defined('SHOW_COMING_SOON')) {
    require_once __DIR__ . '/includes/config.php';
    if (!COMING_SOON) { header('Location: /', true, 302); exit; }
    http_response_code(503);
    header('X-Robots-Tag: noindex, nofollow');
}
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Coming Soon | Dr Sachin G R, Neurosurgeon</title>
<meta name="description" content="The website of Dr Sachin G R, senior neurosurgeon, is coming soon.">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0B1F3A">
<link rel="icon" href="/assets/img/logo-mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body class="cs-body">
<main class="cs">
  <div class="cs-img" aria-hidden="true"><img src="/assets/img/hero-brain.webp" alt="" width="1374" height="1145"></div>
  <div class="cs-card">
    <img class="cs-logo" src="/assets/img/logo-mark.svg" alt="" width="56" height="56">
    <span class="cs-badge"><b></b>Website coming soon</span>
    <h1>Dr Sachin G R</h1>
    <p class="cs-role">MS, MCh (Neurosurgery) · Brain &amp; Spine Surgery</p>
    <p class="cs-txt">Our new website is almost ready. For appointments or to share your MRI and CT reports, please call or message us on WhatsApp.</p>
    <div class="cs-actions">
      <a class="btn btn--glow" href="tel:+919914208940"><svg class="ico" aria-hidden="true"><use href="/assets/img/icons.svg#i-phone"/></svg>Call 99142 08940</a>
      <a class="btn btn--ghost" href="https://wa.me/919914208940" target="_blank" rel="noopener"><svg class="ico" aria-hidden="true"><use href="/assets/img/icons.svg#i-chat"/></svg>WhatsApp</a>
    </div>
  </div>
</main>
</body>
</html>
