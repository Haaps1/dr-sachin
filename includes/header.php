<?php /* Site header: logo, main menu and Treatments dropdown. Shared by every page. */ ?>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="top-progress" aria-hidden="true"></div>
<header class="header header--dark">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Dr Sachin G R, home"><img src="<?= $base ?>assets/img/logo-mark.svg" alt="" width="44" height="44"><span><b>Dr Sachin G R</b><small>Neurosurgeon · Brain &amp; Spine</small></span></a>
    <nav class="nav" aria-label="Main"><a href="/"<?= cur('home') ?>>Home</a><a href="<?= $base ?>about.html"<?= cur('about') ?>>About</a><div class="nav-dd"><a href="/#specialities" class="dd-toggle" aria-haspopup="true" aria-expanded="false"<?= cur('treatments') ?>>Treatments<svg class="ico dd-car" aria-hidden="true"><use href="<?= $base ?>assets/img/icons.svg#i-arrow"/></svg></a><?php include __DIR__ . '/mega.php'; ?></div><a href="<?= $base ?>contact.html"<?= cur('contact') ?>>Contact</a></nav>
    <div class="header-cta">
      <a class="btn btn--glow" href="tel:+919914208940" data-phone><svg class="ico" aria-hidden="true"><use href="<?= $base ?>assets/img/icons.svg#i-phone"/></svg>99142 08940</a>
      <a class="icon-btn header-call-m" href="tel:+919914208940" data-phone aria-label="Call Dr Sachin"><svg class="ico" aria-hidden="true"><use href="<?= $base ?>assets/img/icons.svg#i-phone"/></svg></a>
    </div>
  </div>
</header>
