<?php
/* Desktop Treatments mega menu: specialities (left), their treatments (middle), help card (right).
   Phones use the separate Treatments sheet in footer.php. */
$mega = [
  ['brain', 'Brain Tumor Surgery', 'brain-tumor-surgery', [
    ['brain-tumor-surgery', 'Brain Tumor Surgery', 'Safe removal with modern navigation'],
    ['gliomas', 'Glioma Treatment', 'Maximal safe resection, brain function protected'],
    ['meningiomas', 'Meningioma Treatment', 'Complete removal of benign tumours'],
    ['skull-base-surgery', 'Skull Base Surgery', 'Endoscopic and microsurgical approaches'],
    ['pituitary-tumors', 'Pituitary Tumor Surgery', 'Through-the-nose endoscopic surgery'],
  ]],
  ['vessel', 'Cerebrovascular Surgery', 'brain-aneurysm-avm', [
    ['brain-aneurysm-avm', 'Brain Aneurysm &amp; AVM', 'Clipping and repair of abnormal vessels'],
  ]],
  ['spine', 'Spine Surgery', 'endoscopic-spine-surgery', [
    ['endoscopic-spine-surgery', 'Endoscopic Spine Surgery', 'Keyhole surgery, faster recovery'],
    ['scoliosis', 'Scoliosis Treatment', 'Correction of spinal curves'],
  ]],
  ['spark', 'Functional Neurosurgery', 'epilepsy-surgery', [
    ['epilepsy-surgery', 'Epilepsy Treatment', 'Surgery for drug-resistant seizures'],
    ['pain-management', 'Pain Management', 'Relief for nerve and spine pain'],
  ]],
  ['shield', 'Neurotrauma &amp; Emergency', 'neuro-trauma', [
    ['neuro-trauma', 'Neuro Trauma', 'Urgent care for head and spine injuries'],
  ]],
  ['child', 'Pediatric Neurosurgery', 'pediatric-neurosurgery', [
    ['pediatric-neurosurgery', 'Pediatric Neurosurgery', 'Brain and spine surgery for children'],
  ]],
  ['skullbase', 'Hydrocephalus &amp; CSF', 'hydrocephalus-shunt-surgery', [
    ['hydrocephalus-shunt-surgery', 'Hydrocephalus Treatment', 'Shunt and endoscopic (ETV) surgery'],
    ['csf-leak-repair', 'CSF Leak Treatment', 'Endoscopic repair of spinal fluid leaks'],
  ]],
];
?>
<div class="mega"><div class="mg-cats"><?php foreach ($mega as $i => $c): ?><button type="button" class="mg-cat<?= $i ? '' : ' on' ?>" data-i="<?= $i ?>" data-img="<?= $base ?>assets/img/hero-<?= $c[2] ?>.webp"><svg class="ico" aria-hidden="true"><use href="<?= $base ?>assets/img/icons.svg#i-<?= $c[0] ?>"/></svg><?= $c[1] ?></button><?php endforeach; ?></div><div class="mg-list"><?php foreach ($mega as $i => $c): ?><div class="mg-pane<?= $i ? '' : ' on' ?>" data-i="<?= $i ?>"><span class="mg-h"><?= $c[1] ?></span><?php foreach ($c[3] as $t): ?><a href="<?= $base ?>treatments/<?= $t[0] ?>.html"><b><?= $t[1] ?></b><span><?= $t[2] ?></span></a><?php endforeach; ?></div><?php endforeach; ?></div><div class="mg-feat"><img src="<?= $base ?>assets/img/hero-brain-tumor-surgery.webp" alt="" width="1374" height="1145" loading="lazy"><b>Not sure which treatment?</b><p>Share your MRI on WhatsApp and Dr Sachin will guide you.</p><a class="mg-cta" href="<?= $base ?>contact.html"><svg class="ico" aria-hidden="true"><use href="<?= $base ?>assets/img/icons.svg#i-phone"/></svg>Book consultation</a></div></div>
