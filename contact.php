<?php
$base = '';
$active = 'contact';
require __DIR__ . '/includes/bootstrap.php';
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Contact Dr Sachin G R · Book a Neurosurgery Consultation</title>
<meta name="description" content="Call or WhatsApp Dr Sachin G R on 99142 08940 to book a brain or spine consultation or share your MRI for an opinion.">
<meta name="theme-color" content="#0B1F3A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta property="og:title" content="Contact Dr Sachin G R · Book a Neurosurgery Consultation">
<meta property="og:description" content="Call or WhatsApp Dr Sachin G R on 99142 08940 to book a brain or spine consultation or share your MRI for an opinion.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://drsachinneurocare.com/contact.html">
<meta property="og:image" content="https://drsachinneurocare.com/assets/img/hero-brain.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://drsachinneurocare.com/contact.html">
<link rel="icon" href="assets/img/logo-mark.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/img/logo-mark.svg">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preload" href="assets/fonts/poppins-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<?php include __DIR__ . '/includes/header.php'; ?>
<main id="main">
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb" data-reveal="focus"><a href="/">Home</a><span>/</span><span>Contact</span></nav>
    <h1 class="h1" data-split>Let’s talk about <em>your scans.</em></h1>
    <p class="lead" data-reveal="focus" style="--d:.4s">Call, WhatsApp or send a message. You will get a clear answer on the next step.</p>
  </div>
</section>

<section class="section">
  <div class="wrap contact-grid">
    <div>
      <div class="c-tiles" data-stagger>
        <a class="c-tile" href="tel:+919914208940" data-phone data-tilt data-reveal="flip"><span class="glare"></span><span class="t-ic"><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-phone"/></svg></span><span><small>Call for appointments</small><b>99142 08940</b></span><span class="t-go"><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-arrow"/></svg></span></a>
        <a class="c-tile wa" href="https://wa.me/919914208940" data-wa="Hello Dr Sachin, I would like to book a consultation." target="_blank" rel="noopener" data-tilt data-reveal="flip"><span class="glare"></span><span class="t-ic"><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-chat"/></svg></span><span><small>WhatsApp: share reports &amp; MRI</small><b>99142 08940</b></span><span class="t-go"><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-arrow"/></svg></span></a>
        <a class="c-tile" href="mailto:care@drsachinneurocare.com" data-email data-tilt data-reveal="flip"><span class="glare"></span><span class="t-ic"><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-mail"/></svg></span><span><small>Email</small><b data-email-text>care@drsachinneurocare.com</b></span><span class="t-go"><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-arrow"/></svg></span></a>
      </div>
      <div class="hours" data-reveal="scan">
        <h3><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-clock"/></svg>Consultation hours</h3>
        <ul><li><span>Monday to Friday</span><b>10:00 am to 6:00 pm</b></li><li><span>Saturday</span><b>10:00 am to 2:00 pm</b></li><li><span>Sunday</span><b>By appointment</b></li></ul>
        <p class="em">For head or spine injuries and sudden weakness, call immediately. Emergency care is available 24×7.</p>
      </div>
    </div>
    <form class="form" data-wa-form novalidate data-reveal="flip">
      <h2>Request an appointment</h2>
      <p>Fill this in and it opens WhatsApp with your message ready to send.</p>
      <div class="fields">
        <div class="field"><input id="f-name" name="name" placeholder=" " required autocomplete="name"><label for="f-name">Full name</label><p class="err">Please enter your name</p></div>
        <div class="field"><input id="f-phone" name="phone" type="tel" placeholder=" " required autocomplete="tel" inputmode="tel"><label for="f-phone">Phone number</label><p class="err">Enter a valid 10-digit number</p></div>
        <div class="field"><input id="f-age" name="age" inputmode="numeric" placeholder=" "><label for="f-age">Patient age (optional)</label></div>
        <div class="field"><select id="f-concern" name="concern" required><option value="">Select…</option>
          <option>Brain tumour</option><option>Spine / disc problem</option><option>Back or neck pain</option><option>Skull base / pituitary</option><option>Stroke / aneurysm</option><option>Child's condition</option><option>Head or spine injury</option><option>Second opinion on MRI</option><option>Other</option></select><label for="f-concern">Concern</label><p class="err">Please choose a concern</p></div>
        <div class="field full"><textarea id="f-msg" name="message" placeholder=" "></textarea><label for="f-msg">Tell us briefly about the symptoms (optional)</label></div>
      </div>
      <button class="btn btn--primary" type="submit"><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-chat"/></svg>Send on WhatsApp</button>
      <p class="note">Please do not share sensitive medical details you are not comfortable sending over WhatsApp.</p>
    </form>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap faq-wrap">
    <div><span class="eyebrow">Good to know</span><h2 class="h2" data-split>Before you <em>visit.</em></h2></div>
    <div class="faq" data-stagger><details data-reveal="flip"><summary>Can I get a second opinion on my MRI?<i><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-plus"/></svg></i></summary><div class="ans"><p>Yes. You can share your MRI or CT reports and images on WhatsApp before visiting. Dr Sachin will advise whether an in-person consultation is needed.</p></div></details><details data-reveal="flip"><summary>How long will I stay in hospital?<i><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-plus"/></svg></i></summary><div class="ans"><p>It depends on the procedure. Endoscopic spine surgery is often a day-care or overnight stay, spine fusion usually 3-5 days, and brain surgery typically 4-7 days.</p></div></details><details data-reveal="flip"><summary>Do you treat children?<i><svg class="ico" aria-hidden="true"><use href="assets/img/icons.svg#i-plus"/></svg></i></summary><div class="ans"><p>Yes. Dr Sachin trained in paediatric neurosurgery at SickKids, Toronto, and treats hydrocephalus, spina bifida, craniosynostosis and brain tumours in children.</p></div></details></div>
  </div>
</section>
</main>
<?php include __DIR__ . '/includes/footer.php'; ?>
