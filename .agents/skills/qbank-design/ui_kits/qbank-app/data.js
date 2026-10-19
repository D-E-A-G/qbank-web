// Invented fixtures for the UI kit (per the PRD: no real course content). Not clinical advice.
window.QB_DATA = (() => {
  const semesters = [
    { id: 's1', num: 1, label: 'Semester 1', dates: 'May – Aug 2026', courses: [
      { id: 'n101', code: 'NURS 101', title: 'Foundations of Nursing Practice', questions: 61, weeks: 5, toReview: 4, progress: 1 },
      { id: 'n110', code: 'NURS 110', title: 'Health Assessment', questions: 86, weeks: 6, toReview: 9, progress: 0.92 },
    ] },
    { id: 's2', num: 2, label: 'Semester 2', dates: 'Aug – Dec 2026', courses: [
      { id: 'n214', code: 'NURS 214', title: 'Adult Health I', questions: 68, weeks: 4, toReview: 19, progress: 0.62, terms: 41 },
      { id: 'n220', code: 'NURS 220', title: 'Pharmacology', questions: 29, weeks: 2, toReview: 3, progress: 0.34 },
    ] },
    { id: 's3', num: 3, label: 'Semester 3', dates: 'Jan – Apr 2027', courses: [] },
  ];

  const weeks = [
    { id: 'w4', label: 'Week 4', count: 12, sets: [
      { id: 'set-shock', title: 'Set 2: Shock and perfusion', status: 'imported', count: 8 },
      { id: 'set-anticoag', title: 'Set 1: Anticoagulants', status: 'replaced', count: 12 },
    ] },
    { id: 'w3', label: 'Week 3', count: 29, sets: [
      { id: 'set-hf', title: 'Set 1: Heart failure', status: 'done', detail: 'Done Sep 17 · 13 of 17 fully right' },
      { id: 'set-dys', title: 'Set 2: Dysrhythmias', status: 'progress', detail: '7 of 12 answered' },
    ] },
    { id: 'w2', label: 'Week 2', count: 13, sets: [
      { id: 'set-ab', title: 'Set 1: Acid–base balance', status: 'done', detail: 'Done Sep 10 · 9 of 13 fully right' },
    ] },
    { id: 'w1', label: 'Week 1', count: 14, sets: [
      { id: 'set-fe', title: 'Set 1: Fluids and electrolytes', status: 'done', detail: 'Done Sep 3 · 11 of 14 fully right' },
    ] },
  ];

  const terms = {
    svr: ['Systemic vascular resistance (SVR)', 'How hard the blood vessels push back against the heart. Vasoconstriction raises it.'],
    lactate: ['Lactate', 'A by-product of cells working without enough oxygen. A rising level means tissues are under-perfused.'],
    pp: ['Pulse pressure', 'Systolic minus diastolic pressure. It narrows early in hypovolemic shock.'],
    preload: ['Preload', 'How much the ventricle is stretched by blood returning to the heart before it contracts.'],
    distributive: ['Distributive shock', 'Shock from widespread vasodilation, as in sepsis or anaphylaxis, rather than from fluid loss or pump failure.'],
    urticaria: ['Urticaria', 'Raised, itchy welts (hives) on the skin.'],
    stridor: ['Stridor', 'A high-pitched sound on breathing in, caused by a narrowed upper airway.'],
    oliguria: ['Oliguria', 'Low urine output, usually under 0.5 mL/kg per hour in adults.'],
  };

  const questions = [
    { id: 'Q1', type: 'single', topic: 'Septic shock', cj: 'Take action', need: 'Physiological Adaptation', diff: 4, wk: 'Week 4',
      stem: 'A client admitted with pneumonia now has a blood pressure of 84/50 mm Hg, heart rate 124/min, temperature 39.2 °C, and a serum lactate of 4.2 mmol/L. New orders have just been entered.',
      ask: 'Which order should the nurse implement first?',
      options: [
        { t: 'Infuse 30 mL/kg of IV crystalloid', ok: true, why: 'Restoring circulating volume comes first; it is the first step of the sepsis bundle for hypotension or lactate ≥ 4.' },
        { t: 'Start a norepinephrine infusion', why: 'A vasopressor follows if pressure stays low after fluids; it is not the first step.' },
        { t: 'Collect a urine specimen for culture', why: 'Cultures matter, but blood cultures before antibiotics come ahead of urine, and none of these outrank perfusion.' },
        { t: 'Give acetaminophen for the fever', why: 'Comfort measure; it does not address hypoperfusion.' },
      ],
      rationale: 'Hypotension with a lactate of 4.2 signals tissue hypoperfusion. Fluid resuscitation restores preload and is the first action; vasopressors are added only if the mean arterial pressure stays under 65 mm Hg after fluids.',
      takeaway: 'Septic shock: fluids first, then pressors if the MAP stays under 65.', terms: ['lactate', 'preload'] },
    { id: 'Q2', type: 'sata', topic: 'Hypovolemic shock', cj: 'Recognize cues', need: 'Physiological Adaptation', diff: 4, wk: 'Week 4',
      stem: 'A client is 6 hours post-op after a bowel resection. The nurse suspects early hypovolemic shock.',
      ask: 'Which findings support this? Select all that apply.',
      options: [
        { t: 'Heart rate rising from 88 to 112/min', ok: true, why: 'Tachycardia is an early compensation for falling stroke volume.' },
        { t: 'Cool, clammy skin', ok: true, why: 'Sympathetic vasoconstriction shunts blood away from the skin.' },
        { t: 'Pulse pressure narrowing from 40 to 22 mm Hg', ok: true, why: 'Diastolic rises with vasoconstriction while systolic falls, so the gap narrows.' },
        { t: 'Heart rate of 52/min', why: 'Bradycardia is a late, pre-arrest finding, not an early one.' },
        { t: 'Urine output of 120 mL/hr', why: 'Output falls in shock as the kidneys conserve fluid.' },
      ],
      rationale: 'Early shock is compensated: the heart speeds up and vessels constrict to hold blood pressure. Watch the trend in heart rate, skin, and pulse pressure before the blood pressure drops.',
      takeaway: 'Rising HR + narrowing pulse pressure = early shock, even with a normal BP.', terms: ['pp'] },
    { id: 'Q3', type: 'priority', topic: 'Prioritization', cj: 'Prioritize hypotheses', need: 'Management of Care', diff: 5, wk: 'Week 4',
      stem: 'The nurse receives report on four clients.',
      ask: 'Which client should the nurse see first?',
      options: [
        { t: 'A client who received IV cefazolin 10 minutes ago and now has hoarseness and stridor', ok: true, why: 'Stridor is an airway threat from possible anaphylaxis: airway first.' },
        { t: 'A client with septic shock whose MAP is 66 mm Hg on norepinephrine', why: 'At goal and on treatment; stable for now.' },
        { t: 'A client with heart failure who gained 1 kg overnight', why: 'Needs follow-up today, but not an emergency.' },
        { t: 'A client 2 days post-op reporting incision pain of 6/10', why: 'Important, but pain does not outrank an airway.' },
      ],
      rationale: 'New hoarseness and stridor minutes after an antibiotic point to anaphylaxis with airway swelling. Airway problems come before circulation problems that are already being treated.',
      takeaway: 'Stridor after a new drug = anaphylaxis until proven otherwise. Go now.', terms: ['stridor'] },
    { id: 'Q4', type: 'order', topic: 'Anaphylaxis', cj: 'Take action', need: 'Reduction of Risk Potential', diff: 4, wk: 'Week 4',
      stem: 'A client develops wheezing, urticaria, and a blood pressure of 86/48 mm Hg during an IV antibiotic infusion.',
      ask: 'Put the nurse’s actions in order, first to last.',
      items: ['Stop the antibiotic infusion', 'Assess airway and breathing', 'Give IM epinephrine as ordered', 'Reassess vital signs and response'],
      rationale: 'Remove the trigger first, then check the airway, then treat with epinephrine, then evaluate. Epinephrine should not wait on anything that is not the airway.',
      takeaway: 'Anaphylaxis: stop it, airway, epi, reassess.', terms: ['urticaria'] },
    { id: 'Q5', type: 'match', topic: 'Vasoactive drugs', cj: 'Analyze cues', need: 'Pharmacological Therapies', diff: 3, wk: 'Week 4',
      stem: 'The ICU nurse is reviewing the infusions for clients in shock.',
      ask: 'Match each drug to its main effect.',
      pairs: [
        { l: 'Norepinephrine', r: 'Raises SVR through vasoconstriction' },
        { l: 'Dobutamine', r: 'Increases the heart’s contractility' },
        { l: 'Nitroglycerin', r: 'Lowers preload through venous dilation' },
      ],
      extra: ['Slows conduction through the AV node'],
      rationale: 'Norepinephrine acts mostly on alpha-1 receptors to tighten vessels. Dobutamine acts on beta-1 receptors to strengthen contraction. Nitroglycerin dilates veins so less blood returns to the heart.',
      takeaway: 'Squeeze vessels: norepinephrine. Squeeze the heart: dobutamine. Unload the heart: nitroglycerin.', terms: ['svr', 'preload'] },
    { id: 'Q6', type: 'matrix', topic: 'Cardiogenic shock', cj: 'Generate solutions', need: 'Physiological Adaptation', diff: 5, wk: 'Week 4',
      stem: 'A client with an anterior MI is in cardiogenic shock: BP 82/56 mm Hg, crackles to mid-lung fields, JVD, and cool extremities.',
      ask: 'For each intervention, choose whether it is indicated or contraindicated.',
      columns: ['Indicated', 'Contraindicated'],
      rows: [
        { label: '2 L normal saline bolus', ans: 1 },
        { label: 'Dobutamine infusion', ans: 0 },
        { label: 'Strict intake and output', ans: 0 },
        { label: 'Trendelenburg position', ans: 1 },
      ],
      rationale: 'The pump is failing and the lungs are already wet, so a large fluid bolus worsens congestion and Trendelenburg increases the work of breathing. Supporting contractility and tracking fluid balance help.',
      takeaway: 'Cardiogenic shock with crackles: support the pump, don’t flood it.', terms: [] },
    { id: 'Q7', type: 'highlight', topic: 'Perfusion', cj: 'Recognize cues', need: 'Reduction of Risk Potential', diff: 4, wk: 'Week 4',
      stem: 'Nurse’s note, 0400:',
      ask: 'Highlight the findings that need follow-up.',
      segments: [
        { t: 'Client alert and oriented ×4.' }, { t: 'BP 88/52 mm Hg,', ok: true }, { t: 'down from 118/74 at midnight.', plain: true },
        { t: 'HR 118/min.', ok: true }, { t: 'Skin warm and dry.' }, { t: 'Urine output 20 mL over the last 2 hours.', ok: true }, { t: 'Reports mild thirst.' },
      ],
      rationale: 'A falling blood pressure, a climbing heart rate, and oliguria together point to worsening perfusion. Mild thirst and warm, dry skin are not the concerning findings here.',
      takeaway: 'Trend matters: a BP that drops 30 points overnight needs a call, even if the client feels fine.', terms: ['oliguria'] },
    { id: 'Q8', type: 'cloze', topic: 'Shock types', cj: 'Analyze cues', need: 'Physiological Adaptation', diff: 3, wk: 'Week 4',
      stem: 'Minutes after a bee sting, a client has flushed skin, wheezing, and a blood pressure of 80/40 mm Hg.',
      ask: 'Complete the sentence.',
      template: 'The client is most likely in {0} shock, as shown by {1}.',
      blanks: [
        { opts: ['hypovolemic', 'cardiogenic', 'distributive'], ans: 2 },
        { opts: ['widespread vasodilation and bronchospasm', 'jugular vein distention and crackles', 'flat neck veins after bleeding'], ans: 0 },
      ],
      rationale: 'Anaphylaxis is a form of distributive shock: histamine dilates vessels everywhere and tightens the airways.',
      takeaway: 'Anaphylactic shock is distributive shock.', terms: ['distributive'] },
  ];

  const review = [
    { qid: 'Q3', topic: 'Prioritization', week: 'Week 4', format: 'Priority', status: 'wrong', where: 'Exam · Sep 20' },
    { qid: 'Q2', topic: 'Hypovolemic shock', week: 'Week 4', format: 'Select all', status: 'partial', where: 'Set 2: Shock and perfusion · Today' },
    { qid: 'Q6', topic: 'Cardiogenic shock', week: 'Week 4', format: 'Matrix', status: 'guessed', where: 'Set 2: Shock and perfusion · Today' },
    { qid: 'Q1', topic: 'Heart failure diuretics', week: 'Week 3', format: 'Single answer', status: 'wrong', where: 'Set 1: Heart failure · Sep 17' },
    { qid: 'Q4', topic: 'Digoxin toxicity', week: 'Week 3', format: 'Ordering', status: 'partial', where: 'Set 1: Heart failure · Sep 17' },
    { qid: 'Q7', topic: 'Atrial fibrillation', week: 'Week 3', format: 'Highlight', status: 'guessed', where: 'Set 2: Dysrhythmias · Sep 19' },
    { qid: 'Q5', topic: 'Metabolic acidosis', week: 'Week 2', format: 'Matching', status: 'wrong', where: 'Exam · Sep 20' },
    { qid: 'Q8', topic: 'Hyperkalemia', week: 'Week 1', format: 'Drop-down', status: 'partial', where: 'Set 1: Fluids and electrolytes · Sep 3' },
  ];
  const reviewCounts = { all: 19, wrong: 7, partial: 5, guessed: 7 };

  const examWeeks = [
    { id: 'w1', label: 'Week 1', count: 14 },
    { id: 'w2', label: 'Week 2', count: 13 },
    { id: 'w3', label: 'Week 3', count: 29 },
    { id: 'w4', label: 'Week 4', count: 20 },
  ];
  const pastExams = [
    { id: 'e2', date: 'Sep 20', weeks: 'Weeks 1–3', right: 31, total: 40, minutes: 52 },
    { id: 'e1', date: 'Sep 12', weeks: 'Weeks 1–2', right: 20, total: 27, minutes: 38 },
  ];

  const sampleJSON = `{
  "title": "Week 4 - Set 2: Shock and perfusion",
  "desc": "Recognizing and treating the four types of shock.",
  "terms": { "lactate": ["Lactate", "A by-product of cells working without enough oxygen."] },
  "questions": [
    { "id": "Q1", "type": "single", "topic": "Septic shock", "cj": "Take action", ...`;
  const badJSON = `{
  "title": "Week 4 - Set 1: Anticoagulants",
  "questions": [
    { "id": "X04", "type": "single", "stem": "...", "ask": "...", ... },
    { "id": "X09", "type": "sata", ... }
  ]
}`;

  return { semesters, weeks, terms, questions, review, reviewCounts, examWeeks, pastExams, sampleJSON, badJSON };
})();
