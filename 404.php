<?php
$base = '/';
$active = '';
require __DIR__ . '/includes/bootstrap.php';
http_response_code(404);
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Page Not Found | Dr Sachin G R, Neurosurgeon</title>
<meta name="robots" content="noindex, follow">
<meta name="theme-color" content="#0B1F3A">
<link rel="icon" href="/assets/img/logo-mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<?php include __DIR__ . '/includes/header.php'; ?>
<main id="main">
<section class="hero nf">
  <div class="hero-img" aria-hidden="true"><img src="/assets/img/hero-brain.webp" alt="" width="1374" height="1145"></div>
  <div class="wrap nf-grid">
    <div>
      <span class="nf-code">404</span>
      <h1 class="h1">This page is <em>not here.</em></h1>
      <p class="hero-sub">The page you are looking for may have moved or no longer exists. Try one of the links below, or call us and we will help.</p>
      <div class="hero-actions">
        <a class="btn btn--glow" href="/"><svg class="ico" aria-hidden="true"><use href="/assets/img/icons.svg#i-home"/></svg>Go to home page</a>
        <a class="btn btn--ghost" href="tel:+919914208940" data-phone><svg class="ico" aria-hidden="true"><use href="/assets/img/icons.svg#i-phone"/></svg>Call 99142 08940</a>
      </div>
      <div class="nf-links"><a href="/about.html">About Dr Sachin</a><a href="/#specialities">Treatments</a><a href="/treatments/brain-tumor-surgery.html">Brain Tumor Surgery</a><a href="/treatments/endoscopic-spine-surgery.html">Endoscopic Spine Surgery</a><a href="/contact.html">Contact</a></div>
    </div>
    <div class="brain-stage hero-side"></div>
  </div>
</section>
</main>
<?php include __DIR__ . '/includes/footer.php'; ?>
