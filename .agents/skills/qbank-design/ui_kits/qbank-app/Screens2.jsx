(() => {
const { Button, Icon, TextField, SegmentedControl, ListGroup, ListRow, WeekCheckboxRow, IssueList, ConfirmSheet, PickerSelect, StatusMark } = window.QbankDesignSystem_4be789;
const D = window.QB_DATA;

// App icon mark (option A, "Q on accent") — follows data-palette. See assets/app-icons for the full set.
function AppIconMark({ size = 60 }) {
  return <span aria-hidden="true" style={{ width: size, height: size, borderRadius: size * 0.2237, background: 'linear-gradient(180deg, var(--icon-top) 0%, var(--icon-bottom) 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,.12), inset 0 0 0 0.5px rgba(255,255,255,.12)', flexShrink: 0 }}>
    <span style={{ font: `700 ${size * 0.66}px/1 var(--font-display)`, letterSpacing: -size * 0.03, color: 'var(--icon-fg)', marginTop: -size * 0.04 }}>Q</span>
  </span>;
}

function draw(weeks) {
  const total = weeks.reduce((s, w) => s + w.count, 0);
  if (total <= 40) return { n: total, minutes: Math.round(total * 1.5), per: Object.fromEntries(weeks.map((w) => [w.id, w.count])) };
  const raw = weeks.map((w) => ({ id: w.id, x: (w.count / total) * 40 }));
  const per = Object.fromEntries(raw.map((r) => [r.id, Math.floor(r.x)]));
  let left = 40 - Object.values(per).reduce((a, b) => a + b, 0);
  raw.sort((a, b) => (b.x % 1) - (a.x % 1)).forEach((r) => { if (left > 0) { per[r.id]++; left--; } });
  return { n: 40, minutes: 60, per };
}

function ExamSetup({ nav, phone, wide, admin }) {
  const [on, setOn] = React.useState({ w1: true, w2: true, w3: true, w4: false });
  const picked = D.examWeeks.filter((w) => on[w.id]);
  const d = draw(picked);
  const Page = window.Page;
  return (
    <Page title="Exam" subtitle="NURS 214 · Adult Health I" onBack={nav.back} backLabel="Course" phone={phone} wide={wide} admin={admin} maxWidth="var(--content-max)">
      <ListGroup header="Weeks this exam covers" footer="Questions are drawn only from the weeks you tick, in proportion to each week’s size.">
        {D.examWeeks.map((w) => <WeekCheckboxRow key={w.id} label={w.label} count={w.count} drawn={d.per[w.id]} checked={!!on[w.id]} onChange={(v) => setOn({ ...on, [w.id]: v })} />)}
      </ListGroup>
      {!admin && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface)', boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ font: 'var(--text-title-2)', color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>{d.n} questions</span>
            <span style={{ font: 'var(--text-callout)', color: 'var(--text-2)' }}>in {d.minutes} minutes</span>
          </div>
          <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)', textWrap: 'pretty' }}>
            {picked.length ? picked.map((w) => `${d.per[w.id]} from ${w.label}`).join(' · ') : 'Tick at least one week.'}
            {picked.length > 0 && d.n < 40 ? ' · Fewer than 40, so it’s all of them at 1.5 minutes each.' : ''}
          </span>
          <span style={{ font: 'var(--text-footnote)', color: 'var(--text-2)' }}>Feedback comes at the end. Leaving midway ends the exam and scores what you answered.</span>
          <Button size="lg" fullWidth disabled={!picked.length} onClick={() => nav.runExam(picked.map((w) => w.label).join(', '))}>Start exam</Button>
        </div>
      )}
      <ListGroup header="Past exams">
        {D.pastExams.map((e) => <ListRow key={e.id} title={`${e.weeks} · ${e.date}`} detail={`${e.minutes} min`} value={`${e.right} of ${e.total}`} chevron onClick={() => {}} />)}
      </ListGroup>
    </Page>
  );
}

const COURSE_OPTS = ['NURS 214 · Adult Health I', 'NURS 220 · Pharmacology', 'NURS 110 · Health Assessment', 'NURS 101 · Foundations', '+ New course'];
const WEEK_OPTS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5 (new)', 'Weeks 1–3 (mixed)'];

function Import({ nav, phone, wide, admin }) {
  const Page = window.Page;
  const [src, setSrc] = React.useState('paste');
  const [sample, setSample] = React.useState('new');
  const [course, setCourse] = React.useState(0);
  const [week, setWeek] = React.useState(3);
  const [name, setName] = React.useState('Set 2: Shock and perfusion');
  const [checked, setChecked] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [sheet, setSheet] = React.useState(false);
  const [done, setDone] = React.useState(null);
  const load = (k) => { setSample(k); setChecked(null); setName(k === 'new' ? 'Set 2: Shock and perfusion' : 'Set 1: Anticoagulants'); };
  const text = sample === 'bad' ? D.badJSON : D.sampleJSON;
  const clash = name.trim() === 'Set 1: Anticoagulants' && week === 3 && course === 0;
  const doImport = () => (clash ? setSheet(true) : setDone('Imported'));
  const lbl = { font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-2)' };

  if (done) return (
    <Page title="Import" phone={phone} wide={wide} maxWidth="var(--content-max)">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center', padding: '32px 0 8px' }}>
        <span style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--correct-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={done === 'Imported' ? 'check' : 'rotate-ccw'} size={30} color="var(--correct)" strokeWidth={2.25} /></span>
        <h2 style={{ margin: 0, font: 'var(--text-title-1)', color: 'var(--text-1)' }}>{done}</h2>
        <p style={{ margin: 0, font: 'var(--text-callout)', color: 'var(--text-2)', maxWidth: 340, textWrap: 'pretty' }}>
          “{name}” · {sample === 'new' ? 8 : 12} questions in {COURSE_OPTS[course].split(' · ')[0]}, {WEEK_OPTS[week]}.{done === 'Replaced' ? ' The previous version can be restored from the week’s page.' : ''}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!admin && <Button size="lg" fullWidth onClick={() => nav.runSet(`${WEEK_OPTS[week]} · ${name}`)}>Practice the new set now</Button>}
        <Button variant="secondary" size="lg" fullWidth onClick={() => nav.openCourse()}>Open the course</Button>
        <Button variant="plain" onClick={() => { setDone(null); setChecked(null); }}>Import another file</Button>
      </div>
    </Page>
  );

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Page title="Import" subtitle={admin ? 'Files go into her courses.' : undefined} phone={phone} wide={wide} maxWidth="var(--content-max)">
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SegmentedControl value={src} onChange={setSrc} options={[{ value: 'paste', label: 'Paste JSON', icon: 'clipboard-paste' }, { value: 'file', label: 'Choose file', icon: 'file-json' }]} />
          {src === 'paste'
            ? <TextField multiline mono rows={7} value={text} onChange={() => setChecked(null)} placeholder="Paste the JSON from your Firstmate" />
            : <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 'var(--radius-sm)', border: '1px dashed var(--separator-strong)', background: 'var(--surface)', cursor: 'pointer', textAlign: 'left' }}>
                <Icon name="file-json" size={24} color="var(--tint)" />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ font: 'var(--text-body)', color: 'var(--text-1)' }}>week4-set2.json</span><span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>14 KB · from iCloud Drive</span></span>
              </button>}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', font: 'var(--text-caption)', color: 'var(--text-3)' }}>
            Demo files:
            {[['new', 'New set'], ['bad', 'With errors'], ['fixed', 'Corrected set (replaces)']].map(([k, l]) => <Button key={k} variant={sample === k ? 'secondary' : 'plain'} size="sm" onClick={() => load(k)} style={{ height: 26, padding: '0 8px', font: 'var(--weight-medium) var(--size-caption-1)/1 var(--font-ui)' }}>{l}</Button>)}
          </div>
        </section>
        <section style={{ display: 'grid', gridTemplateColumns: wide ? '1fr 1fr' : '1fr', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={lbl}>Course</span><PickerSelect options={COURSE_OPTS} value={course} onChange={setCourse} /></label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={lbl}>Week</span><PickerSelect options={WEEK_OPTS} value={week} onChange={setWeek} /></label>
          {course === COURSE_OPTS.length - 1 && <>
            <TextField label="Course code" placeholder="NURS 230" />
            <TextField label="Course name" placeholder="Maternal and Newborn Health" />
          </>}
          <TextField label="Set name" value={name} onChange={(v) => { setName(v); }} hint="Filled from the file’s title. You can change it." style={{ gridColumn: '1 / -1' }} />
        </section>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {checked === 'ok' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--correct-soft)', boxShadow: 'inset 0 0 0 1px var(--correct-border)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--text-headline)', color: 'var(--text-1)' }}><Icon name="circle-check" size={20} color="var(--correct)" strokeWidth={2} />Ready: {sample === 'new' ? '8 questions, 8 terms' : '12 questions, 9 terms'}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(sample === 'new' ? ['1 single', '1 priority', '1 select all', '1 ordering', '1 matching', '1 matrix', '1 highlight', '1 drop-down'] : ['6 single', '3 select all', '2 matrix', '1 drop-down']).map((t) => <span key={t} style={{ padding: '3px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-raised)', font: 'var(--weight-medium) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)', color: 'var(--text-2)' }}>{t}</span>)}
              </div>
            </div>
          )}
          {checked === 'error' && <IssueList kind="error" items={['Question 4 (X04): missing takeaway', 'Question 9 (X09): select-all needs some but not all options marked ok']} onCopy={() => setCopied(true)} copied={copied} />}
          {checked && sample !== 'bad' && <IssueList kind="warning" items={['Question 6 (Q6): no src citation']} />}
          {checked === 'ok'
            ? <Button size="lg" fullWidth icon="download" onClick={doImport}>Import</Button>
            : <Button size="lg" fullWidth onClick={() => { setCopied(false); setChecked(sample === 'bad' ? 'error' : 'ok'); }}>Check file</Button>}
        </section>
      </Page>
      <ConfirmSheet contained centered={wide} open={sheet} onDismiss={() => setSheet(false)}
        title="Replace “Set 1: Anticoagulants”?"
        message="NURS 214, Week 4 already has a set with this name. Replacing swaps its 12 questions for the 12 in this file. Answers on unchanged questions are kept, and the old version stays restorable."
        actions={[{ label: 'Replace', variant: 'primary', onClick: () => { setSheet(false); setDone('Replaced'); } }, { label: 'Import as a separate set', variant: 'secondary', onClick: () => { setSheet(false); setDone('Imported'); } }, { label: 'Cancel', onClick: () => setSheet(false) }]} />
    </div>
  );
}

function Settings({ nav, phone, wide, admin, look, setLook }) {
  const Page = window.Page;
  const [confirmOut, setConfirmOut] = React.useState(false);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Page title="Settings" phone={phone} wide={wide} maxWidth="var(--content-max)">
        <ListGroup header="Account">
          <ListRow icon="user" title={admin ? 'daniel@example.com' : 'maya@example.com'} detail={admin ? 'Admin' : 'Student'} />
          <ListRow icon="lock" title="Change password" chevron onClick={() => {}} />
        </ListGroup>
        <ListGroup header="Passkeys" footer="Passkeys let you sign in with Face ID or Touch ID.">
          <ListRow icon="key-round" title="iPhone" detail="Added Aug 30" accessory={<Button variant="plain" size="sm">Remove</Button>} />
          <ListRow icon="key-round" title="MacBook Air" detail="Added Sep 2" accessory={<Button variant="plain" size="sm">Remove</Button>} />
          <ListRow icon="plus" title="Add a passkey" onClick={() => {}} />
        </ListGroup>
        {!admin && (
          <ListGroup header="Semesters and courses" footer="Rename, move between semesters, archive or unarchive a course. Courses can also be made from Import.">
            {D.semesters.map((s) => <ListRow key={s.id} icon="graduation-cap" title={s.label} value={`${s.courses.length} ${s.courses.length === 1 ? 'course' : 'courses'}`} chevron onClick={() => {}} />)}
            <ListRow icon="plus" title="Add a semester" onClick={() => {}} />
            <ListRow icon="plus" title="Add a course" onClick={() => {}} />
          </ListGroup>
        )}
        <ListGroup header="Look">
          <div style={{ padding: 12 }}>
            <SegmentedControl value={look} onChange={setLook} options={[{ value: 'auto', label: 'Match device' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
          </div>
        </ListGroup>
        {!admin && (
          <ListGroup footer="Downloads your answers and progress as a JSON file.">
            <ListRow icon="download" title="Export my progress" onClick={() => {}} />
          </ListGroup>
        )}
        <ListGroup><ListRow icon="log-out" title="Sign out" destructive onClick={() => setConfirmOut(true)} /></ListGroup>
      </Page>
      <ConfirmSheet contained centered={wide} open={confirmOut} onDismiss={() => setConfirmOut(false)} title="Sign out on this device?" message="Your progress is saved on the server. You’ll need your password or a passkey to sign back in."
        actions={[{ label: 'Sign out', variant: 'destructive', onClick: () => { setConfirmOut(false); nav.signOut(); } }, { label: 'Cancel', onClick: () => setConfirmOut(false) }]} />
    </div>
  );
}

Object.assign(window, { AppIconMark, ExamSetup, Import, Settings });
})();
