/* Treatment content for Dr Sachin G R.
   Each entry: n name · c category · s one-line summary · o overview
   w when it is needed · h how it is done · r recovery · t technique tags.
   Content is general patient information, not a substitute for a consultation. */
window.CATEGORIES = [
  { id: 'brain',     name: 'Brain',          blurb: 'Tumours, trauma, epilepsy and movement disorders of the brain.' },
  { id: 'skullbase', name: 'Skull Base',     blurb: 'Deep-seated lesions at the base of the skull, reached through minimal corridors.' },
  { id: 'vascular',  name: 'Neurovascular',  blurb: 'Stroke, aneurysms and abnormal blood vessels of the brain.' },
  { id: 'spine',     name: 'Spine',          blurb: 'Neck and back conditions, from keyhole endoscopy to complex reconstruction.' },
  { id: 'nerves',    name: 'Nerves & Pain',  blurb: 'Peripheral nerve injuries, entrapments and chronic pain.' },
  { id: 'pediatric', name: 'Paediatric',     blurb: 'Brain and spine care for infants, children and teenagers.' }
];

window.TREATMENTS = [
  {
    id: 'brain-tumor-surgery', n: 'Brain Tumor Surgery', c: 'brain',
    s: 'Safe maximal removal of brain tumours with precision navigation.',
    o: 'Brain tumour surgery aims to remove as much of the tumour as is safely possible while protecting speech, movement and memory. Every operation is planned on advanced MRI so the route to the tumour avoids critical brain areas.',
    w: ['Headaches that are new, worsening or worse in the morning', 'Seizures starting in adulthood', 'Weakness, numbness or trouble with speech or vision', 'A tumour found on a CT or MRI scan'],
    h: ['Detailed MRI, functional mapping and tractography', 'Neuronavigation-guided small, targeted opening', 'Microsurgical removal, with awake mapping when needed', 'Tissue sent for diagnosis to guide further treatment'],
    r: 'Most patients walk within a day or two and go home in 3–5 days. Further treatment is planned with the tumour board once the biopsy report is back.',
    t: ['Neuronavigation', 'Operating microscope', 'Awake craniotomy', 'Intra-op monitoring']
  },
  {
    id: 'stroke-neurovascular', n: 'Stroke & Neurovascular Disorders', c: 'vascular',
    s: 'Emergency and planned care for bleeding and blocked vessels of the brain.',
    o: 'Strokes happen when blood flow to the brain is blocked or a vessel bursts. Timely surgery can relieve pressure, remove a clot or restore blood flow, and limit lasting damage.',
    w: ['Sudden weakness of the face, arm or leg', 'Sudden trouble speaking or understanding', 'Sudden severe headache, often described as the worst ever', 'Narrowed neck arteries or moyamoya disease'],
    h: ['Urgent CT, CT angiography or MRI', 'Clot evacuation or decompressive surgery when pressure is high', 'Carotid or bypass surgery for narrowed vessels', 'Stroke rehabilitation plan from day one'],
    r: 'Recovery depends on the size and site of the stroke. Early physiotherapy, speech therapy and control of risk factors make a real difference.',
    t: ['Decompressive craniectomy', 'Clot evacuation', 'Bypass surgery', 'Stroke rehab']
  },
  {
    id: 'spine-surgery', n: 'Spine Surgery', c: 'spine',
    s: 'Surgery for disc prolapse, stenosis, instability and spinal cord compression.',
    o: 'Spine surgery relieves pressure on the nerves and spinal cord and restores stability when conservative care has not helped. The least invasive option that fully treats the problem is always chosen first.',
    w: ['Leg or arm pain spreading from the back or neck', 'Numbness, tingling or weakness in the limbs', 'Difficulty walking or loss of balance', 'Bladder or bowel changes (an emergency)'],
    h: ['Clinical examination with MRI and dynamic X-rays', 'Decompression: discectomy, laminectomy or foraminotomy', 'Stabilisation with fixation when the spine is unstable', 'Early mobilisation, usually the same or next day'],
    r: 'Many patients stand and walk within 24 hours. Desk work usually resumes in 2–4 weeks, heavier work after 6–12 weeks.',
    t: ['Microdiscectomy', 'Laminectomy', 'Cervical surgery', 'Navigation']
  },
  {
    id: 'minimally-invasive-spine-surgery', n: 'Minimally Invasive Spine Surgery', c: 'spine',
    s: 'Keyhole spine surgery through small incisions for faster recovery.',
    o: 'Minimally invasive spine surgery (MISS) reaches the problem through tubes and small incisions, moving muscle aside instead of cutting it. This means less pain, less blood loss and a quicker return to normal life.',
    w: ['Slipped or herniated disc', 'Lumbar canal stenosis', 'Spondylolisthesis (slipped vertebra)', 'Selected spinal tumours and infections'],
    h: ['Precise level marking with X-ray guidance', 'Small incision and tubular muscle-splitting access', 'Decompression or fusion under the microscope', 'Percutaneous screws when fixation is needed'],
    r: 'Most patients walk within hours and go home in 1–2 days. Scars are small and return to work is usually quicker than with open surgery.',
    t: ['Tubular retractors', 'MIS-TLIF', 'Percutaneous screws', 'Day-care options']
  },
  {
    id: 'endoscopic-brain-spine-surgery', n: 'Endoscopic Brain & Spine Surgery', c: 'brain',
    s: 'Camera-guided surgery through natural pathways or tiny openings.',
    o: 'Endoscopes give a bright, magnified view deep inside the brain and spine through very small openings, sometimes through the nose. This avoids large incisions and reduces disturbance to healthy tissue.',
    w: ['Pituitary and skull base tumours', 'Hydrocephalus suitable for endoscopic third ventriculostomy', 'Cysts inside the brain\'s fluid spaces', 'Disc prolapse and canal stenosis'],
    h: ['High-definition endoscope and navigation planning', 'Access through the nose or a small burr hole', 'Removal or drainage under magnified vision', 'Repair and closure with minimal disturbance'],
    r: 'Hospital stay is often 1–3 days. Patients usually have less pain and resume normal activity sooner.',
    t: ['Endonasal', 'ETV', 'Full-endoscopic spine', '4K endoscopy']
  },
  {
    id: 'neuro-trauma', n: 'Neuro Trauma', c: 'brain',
    s: '24×7 care for head and spinal injuries after accidents and falls.',
    o: 'Head and spine injuries need fast, expert decisions. Dr Sachin manages everything from minor concussions to life-threatening bleeding and unstable spinal fractures.',
    w: ['Loss of consciousness or confusion after an injury', 'Repeated vomiting, severe headache or seizures', 'Neck or back pain with weakness or numbness', 'Bleeding in or around the brain on a scan'],
    h: ['Rapid CT assessment and stabilisation', 'Emergency evacuation of blood clots', 'Fixation of unstable spinal fractures', 'Neuro-ICU care and early rehabilitation'],
    r: 'Recovery varies widely with the injury. A structured rehabilitation programme and family counselling are part of the plan.',
    t: ['Emergency craniotomy', 'ICP monitoring', 'Spinal fixation', 'Neuro-ICU']
  },
  {
    id: 'epilepsy-surgery', n: 'Epilepsy Surgery', c: 'brain',
    s: 'Surgical options when seizures persist despite medicines.',
    o: 'About one in three people with epilepsy continue to have seizures despite trying medicines. For many of them, surgery can reduce or stop seizures and greatly improve quality of life.',
    w: ['Seizures despite two or more appropriate medicines', 'A seizure focus seen on MRI such as mesial temporal sclerosis', 'Seizures caused by a tumour or vascular malformation', 'Side effects that make medicines hard to tolerate'],
    h: ['Video-EEG, MRI and PET to locate the seizure focus', 'Multidisciplinary epilepsy team discussion', 'Resection or disconnection of the seizure focus', 'Neuromodulation such as VNS when resection is not possible'],
    r: 'Most patients go home within a week. Medicines are continued and reviewed over time. Many become seizure-free.',
    t: ['Temporal lobectomy', 'Lesionectomy', 'VNS', 'EEG mapping']
  },
  {
    id: 'functional-neurosurgery', n: 'Functional Neurosurgery', c: 'brain',
    s: 'Restoring function in movement disorders, pain and spasticity.',
    o: 'Functional neurosurgery changes how nerve circuits work rather than removing tissue. It uses precise electrodes, stimulators and targeted procedures to treat conditions that do not respond well to medicines.',
    w: ['Parkinson\'s disease, tremor or dystonia', 'Trigeminal neuralgia and other nerve pain', 'Spasticity after stroke, injury or cerebral palsy', 'Selected cases of epilepsy'],
    h: ['Stereotactic planning on MRI and CT', 'Deep brain stimulation or lesioning', 'Microvascular decompression for nerve pain', 'Programming and long-term follow-up'],
    r: 'Hospital stay is typically 2–5 days. Stimulator settings are fine-tuned over the following weeks.',
    t: ['Stereotaxy', 'DBS', 'MVD', 'Intrathecal pumps']
  },
  {
    id: 'parkinsons-movement-disorders', n: 'Parkinson\'s & Movement Disorders', c: 'brain',
    s: 'Deep brain stimulation for Parkinson\'s, tremor and dystonia.',
    o: 'When Parkinson\'s symptoms fluctuate or medicines cause troublesome side effects, deep brain stimulation (DBS) can smooth out movement, reduce tremor and lower medication needs.',
    w: ['Parkinson\'s with "on-off" fluctuations', 'Medication-induced dyskinesias', 'Essential tremor affecting daily tasks', 'Generalised or focal dystonia'],
    h: ['Assessment with a movement-disorder neurologist', 'Frame-based or frameless stereotactic targeting', 'Placement of fine electrodes and a pacemaker-like battery', 'Staged programming for the best balance of benefit'],
    r: 'Patients usually go home in 3–4 days. Programming starts a few weeks later, and improvement builds over months.',
    t: ['DBS', 'Micro-electrode recording', 'Stereotaxy', 'Programming clinic']
  },
  {
    id: 'peripheral-nerve-surgery', n: 'Peripheral Nerve Surgery', c: 'nerves',
    s: 'Repair and release of injured or compressed nerves in the limbs.',
    o: 'Nerves in the arms and legs can be trapped, injured or affected by tumours. Surgery can release compression, repair damage and restore feeling and strength.',
    w: ['Carpal or cubital tunnel syndrome', 'Brachial plexus injury after an accident', 'Nerve cuts or injuries from trauma', 'Nerve sheath tumours such as schwannomas'],
    h: ['Nerve conduction studies and high-resolution imaging', 'Decompression of trapped nerves', 'Nerve repair, grafting or transfers', 'Hand and limb therapy afterwards'],
    r: 'Release procedures are often day-care. Recovery after nerve repair is gradual as nerves regrow about 1 mm a day.',
    t: ['Nerve decompression', 'Nerve transfers', 'Brachial plexus', 'Microsurgery']
  },
  {
    id: 'pediatric-neurosurgery', n: 'Pediatric Neurosurgery', c: 'pediatric',
    s: 'Gentle, child-focused brain and spine surgery. Trained at SickKids, Toronto.',
    o: 'Children are not small adults. Their brain and spine conditions need specialised surgical skill, child-friendly care and close partnership with families.',
    w: ['Hydrocephalus and large head size in infants', 'Spina bifida and tethered spinal cord', 'Craniosynostosis (early fusion of skull bones)', 'Brain tumours and cysts in children'],
    h: ['Child-friendly assessment with the family involved', 'Paediatric anaesthesia and neuro-monitoring', 'Minimally invasive and endoscopic techniques where possible', 'Long-term developmental follow-up'],
    r: 'Children usually recover faster than adults. Parents stay involved through every step, from admission to follow-up.',
    t: ['Spina bifida repair', 'ETV', 'Craniosynostosis', 'Tethered cord release']
  },
  {
    id: 'skull-base-surgery', n: 'Skull Base Surgery', c: 'skullbase',
    s: 'Advanced surgery for deep tumours at the base of the skull. Fellowship-trained in Osaka, Japan.',
    o: 'The skull base holds critical nerves and blood vessels. Skull base surgery uses precise corridors, often through the nose or small keyhole openings, to reach tumours that were once considered inoperable.',
    w: ['Pituitary adenomas and craniopharyngiomas', 'Skull base meningiomas and chordomas', 'Vestibular schwannomas (acoustic neuromas)', 'Spontaneous or post-traumatic CSF leaks'],
    h: ['Thin-slice CT and MRI with 3D planning', 'Endoscopic endonasal or keyhole approach', 'Cranial nerve monitoring throughout surgery', 'Multilayer skull base reconstruction'],
    r: 'Stay is usually 3–7 days depending on the approach. Hormone and vision checks are part of follow-up.',
    t: ['Endoscopic endonasal', 'Keyhole approach', 'Nerve monitoring', 'Osaka fellowship']
  },
  {
    id: 'brain-aneurysm-avm', n: 'Brain Aneurysm & AVM Treatment', c: 'vascular',
    s: 'Clipping, coiling and excision of dangerous blood vessel abnormalities.',
    o: 'An aneurysm is a weak bulge in a brain artery. An AVM is a tangle of abnormal vessels. Both can bleed, so treatment aims to secure them safely and permanently.',
    w: ['Sudden severe "thunderclap" headache', 'Aneurysm found incidentally on a scan', 'Seizures or bleeding from an AVM', 'Family history of aneurysms'],
    h: ['CT angiography or digital subtraction angiography', 'Team decision: surgical clipping or endovascular coiling', 'Microsurgical AVM excision where appropriate', 'Close monitoring for vasospasm in the ICU'],
    r: 'Planned (unruptured) cases often go home within a week. Recovery after a bleed takes longer and includes rehabilitation.',
    t: ['Microsurgical clipping', 'Coiling', 'AVM excision', 'ICG angiography']
  },
  {
    id: 'hydrocephalus-shunt-surgery', n: 'Hydrocephalus & Shunt Surgery', c: 'brain',
    s: 'Draining excess brain fluid with shunts or endoscopic ventriculostomy.',
    o: 'Hydrocephalus is a build-up of cerebrospinal fluid that raises pressure inside the head. It affects babies and adults, and can be treated with a shunt or an endoscopic bypass.',
    w: ['Enlarging head or bulging soft spot in infants', 'Headache, vomiting and blurred vision', 'Walking difficulty, memory problems and urinary urgency in older adults', 'Blocked or infected existing shunts'],
    h: ['MRI to understand the cause and pathway of fluid', 'Endoscopic third ventriculostomy when suitable', 'Programmable shunt placement when needed', 'Shunt revision and long-term surveillance'],
    r: 'Most patients go home in 2–3 days. In normal pressure hydrocephalus, walking often improves within weeks.',
    t: ['VP shunt', 'ETV', 'Programmable valves', 'NPH evaluation']
  },
  {
    id: 'neuro-oncology', n: 'Neuro-Oncology', c: 'brain',
    s: 'Complete, team-based care for tumours of the brain and spine.',
    o: 'Neuro-oncology combines surgery, radiotherapy, chemotherapy and supportive care. Each patient\'s plan is shaped by the tumour\'s molecular profile and the patient\'s own goals.',
    w: ['Primary brain tumours such as gliomas', 'Brain metastases from cancers elsewhere', 'Spinal cord and spinal column tumours', 'Tumour recurrence after earlier treatment'],
    h: ['Surgery for diagnosis and safe maximal removal', 'Molecular and genetic tumour profiling', 'Tumour board plan with radiation and medical oncology', 'Regular MRI surveillance and supportive care'],
    r: 'Treatment is a journey, not a single event. A dedicated coordinator helps families through each step.',
    t: ['Tumour board', 'Molecular profiling', 'Metastasis surgery', 'Survivorship care']
  },
  {
    id: 'pain-management', n: 'Pain Management', c: 'nerves',
    s: 'Interventional and surgical relief for chronic neck, back and nerve pain.',
    o: 'Long-standing pain affects sleep, work and mood. Image-guided injections, nerve procedures and neuromodulation can bring lasting relief, often without major surgery.',
    w: ['Chronic back or neck pain', 'Sciatica not settling with medicines', 'Trigeminal neuralgia', 'Pain persisting after previous spine surgery'],
    h: ['Clear diagnosis of the pain source', 'Image-guided nerve root or facet injections', 'Radiofrequency ablation of pain nerves', 'Spinal cord stimulation for resistant pain'],
    r: 'Most injection procedures are day-care. Patients usually return to routine activities within a day or two.',
    t: ['Nerve blocks', 'Radiofrequency ablation', 'Spinal cord stimulation', 'Day-care']
  },
  {
    id: 'spine-care', n: 'Spine Care', c: 'spine',
    s: 'Non-surgical diagnosis, rehab and prevention for a healthy spine.',
    o: 'Most back and neck problems get better without surgery. Spine care focuses on accurate diagnosis, targeted exercise, posture correction and pain relief, with surgery only when it is clearly needed.',
    w: ['Recurrent back or neck pain', 'Postural strain from desk work', 'Early disc degeneration', 'A second opinion before spine surgery'],
    h: ['Thorough examination and review of scans', 'Personalised physiotherapy and core strengthening', 'Ergonomic and lifestyle advice', 'Regular review, escalating treatment only if needed'],
    r: 'Many patients improve within 6–12 weeks of a structured programme.',
    t: ['Second opinions', 'Physiotherapy', 'Ergonomics', 'Conservative first']
  },
  {
    id: 'spine-fusion', n: 'Spine Fusion', c: 'spine',
    s: 'Stabilising unstable or deformed segments of the spine.',
    o: 'Spinal fusion joins two or more vertebrae so they heal into a single solid bone. It stops painful movement at an unstable segment and protects the nerves.',
    w: ['Spondylolisthesis with nerve compression', 'Instability after fractures, infection or tumours', 'Severe degenerative disc disease', 'Spinal deformity'],
    h: ['Dynamic X-rays, MRI and CT planning', 'Decompression of the nerves', 'Screws and a cage placed, often minimally invasively', 'Bone graft to fuse the segment over months'],
    r: 'Walking starts the next day. Bone fusion matures over 3–6 months, with activity increased step by step.',
    t: ['TLIF', 'ACDF', 'MIS fusion', 'Navigation']
  },
  {
    id: 'scoliosis', n: 'Scoliosis', c: 'spine',
    s: 'Correction of spinal curvature in adolescents and adults.',
    o: 'Scoliosis is a sideways curve of the spine. Mild curves are watched or braced; larger or progressive curves can be straightened and stabilised with surgery.',
    w: ['Uneven shoulders, waist or hips', 'A rib hump when bending forward', 'Curves progressing on serial X-rays', 'Back pain or leg symptoms in adult scoliosis'],
    h: ['Standing whole-spine X-rays and MRI', 'Observation or bracing for smaller curves', 'Deformity correction with neuromonitoring', 'Structured return to school, work and sport'],
    r: 'Hospital stay is usually 4–6 days. Most teenagers return to school in 4–6 weeks.',
    t: ['Deformity correction', 'Neuromonitoring', 'Bracing', 'Adult scoliosis']
  },
  {
    id: 'endoscopic-spine-surgery', n: 'Endoscopic Spine Surgery', c: 'spine',
    s: 'Full-endoscopic disc and stenosis surgery through an 8 mm incision. Fellowship-trained in South Korea.',
    o: 'Endoscopic spine surgery uses a camera about the width of a pencil to remove disc herniations and relieve stenosis. Muscle and bone are preserved, and many patients go home the same day.',
    w: ['Lumbar or cervical disc herniation', 'Foraminal and lateral recess stenosis', 'Recurrent disc after earlier surgery', 'Patients wanting the fastest possible recovery'],
    h: ['Precise targeting with fluoroscopy', 'Tiny incision and working channel endoscope', 'Removal of the disc fragment under HD vision', 'Walking within a few hours'],
    r: 'Most patients are discharged the same or next day and return to desk work within 1–2 weeks.',
    t: ['Transforaminal', 'Interlaminar', 'UBE', 'Day-care']
  },
  {
    id: 'pituitary-tumors', n: 'Pituitary Tumors', c: 'skullbase',
    s: 'Endoscopic removal through the nose, with no scar on the face.',
    o: 'Pituitary tumours can press on the optic nerves or disturb hormones. Most can be removed endoscopically through the nose, without any external incision.',
    w: ['Blurred or narrowing vision', 'Hormone problems: acromegaly, Cushing\'s or prolactinoma', 'Irregular periods, infertility or low libido', 'Pituitary tumour found on a scan'],
    h: ['Hormone profile, visual fields and MRI', 'Endoscopic endonasal transsphenoidal surgery', 'Careful protection of the normal gland', 'Endocrinology follow-up'],
    r: 'Hospital stay is usually 3–4 days. Vision often begins to improve within days.',
    t: ['Endonasal', 'Transsphenoidal', 'Vision rescue', 'Endocrine care']
  },
  {
    id: 'csf-leak-repair', n: 'CSF Leak & Repair', c: 'skullbase',
    s: 'Sealing leaks of brain fluid from the nose or ear.',
    o: 'A CSF leak happens when fluid around the brain escapes through a defect in the skull base, often as a clear watery nasal drip. Repair is important to prevent meningitis.',
    w: ['Clear watery fluid dripping from one nostril', 'Salty taste in the throat', 'Leak after head injury or previous surgery', 'Recurrent meningitis'],
    h: ['CT and MR cisternography to pinpoint the leak', 'Endoscopic endonasal repair', 'Multilayer graft and vascularised flap', 'Treatment of raised pressure if present'],
    r: 'Patients avoid straining and nose blowing for a few weeks. Most go home in 3–5 days.',
    t: ['Endoscopic repair', 'Nasoseptal flap', 'Skull base', 'Meningitis prevention']
  },
  {
    id: 'meningiomas', n: 'Meningiomas', c: 'brain',
    s: 'Surgery for tumours arising from the brain\'s coverings.',
    o: 'Meningiomas are usually benign tumours of the membranes around the brain and spinal cord. Many can be cured with complete surgical removal.',
    w: ['Headaches, seizures or personality change', 'Vision, hearing or smell changes', 'Weakness or numbness', 'Growing meningioma on repeat scans'],
    h: ['MRI and angiography to plan the approach', 'Navigation-guided craniotomy or keyhole approach', 'Complete removal including the attachment where safe', 'Follow-up MRI, with radiosurgery for residual tumour'],
    r: 'Most patients go home in 3–5 days. Long-term outlook is excellent after complete removal.',
    t: ['Convexity & skull base', 'Simpson grading', 'Keyhole', 'Radiosurgery']
  },
  {
    id: 'gliomas', n: 'Gliomas', c: 'brain',
    s: 'Function-preserving surgery for gliomas, including awake craniotomy.',
    o: 'Gliomas grow from the brain\'s support cells and often lie close to important areas. Removing as much as is safely possible, while preserving function, improves outcomes.',
    w: ['New seizures', 'Progressive weakness or speech difficulty', 'Personality or memory changes', 'A mass on MRI suggesting a glioma'],
    h: ['Functional MRI and tractography', 'Awake craniotomy with language and motor mapping', 'Fluorescence-guided resection', 'Molecular diagnosis and oncology plan'],
    r: 'Most patients go home in 4–5 days, with radiotherapy and chemotherapy planned as needed.',
    t: ['Awake mapping', 'Fluorescence guidance', 'Tractography', 'Molecular profiling']
  },
  {
    id: 'pediatric-brain-tumors', n: 'Pediatric Brain Tumors', c: 'pediatric',
    s: 'Specialised surgery and coordinated care for brain tumours in children.',
    o: 'Brain tumours are the most common solid tumours in children. Surgery is central to treatment, delivered by a team that understands the developing brain.',
    w: ['Morning headaches and vomiting', 'Unsteady walking or clumsiness', 'Squint, head tilt or vision problems', 'Delayed milestones or behaviour change'],
    h: ['Child-friendly MRI, under sedation if needed', 'Safe maximal removal of the tumour', 'Treatment of associated hydrocephalus', 'Paediatric oncology and rehabilitation'],
    r: 'Children usually go home in 5–7 days. Growth, learning and development are monitored over the long term.',
    t: ['Medulloblastoma', 'Posterior fossa', 'Paediatric oncology', 'Family support']
  }
];
