(() => {
const { Button, Icon, TextField, ListGroup, ListRow, ConfirmSheet, PickerSelect } = window.QbankDesignSystem_4be789;
const D = window.QB_DATA;

function AdminHome({ nav, phone, wide }) {
  const Page = window.Page;
  const [repair, setRepair] = React.useState(false);
  const [done, setDone] = React.useState(false);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Page title="Admin" subtitle="Fix things in the app and in her account" phone={phone} wide={wide} maxWidth="var(--content-max)">
        <ListGroup header="Semesters and courses" footer="Same controls as her Settings: add, rename, move between semesters, archive and unarchive.">
          {D.semesters.map((s) => <ListRow key={s.id} icon="graduation-cap" title={s.label} value={`${s.courses.length} ${s.courses.length === 1 ? 'course' : 'courses'}`} chevron onClick={() => {}} />)}
          <ListRow icon="plus" title="Add a semester" onClick={() => {}} />
          <ListRow icon="plus" title="Add a course" onClick={() => {}} />
        </ListGroup>
        <ListGroup header="Weeks">
          <ListRow icon="pencil" title="Fix a week" detail="Rename a week label or move a set to another week" chevron onClick={() => nav.push('adminWeeks')} />
        </ListGroup>
        <ListGroup header="Her account">
          <ListRow icon="key-round" title="Reset her password" detail="Send a reset email or set a temporary password" chevron onClick={() => nav.push('adminAccount')} />
        </ListGroup>
        <ListGroup header="Repair" footer="For when something breaks, not for normal use. Each repair says what it will change and asks first.">
          <ListRow icon="wrench" title="Rebuild progress and Review" detail={done ? 'Rebuilt just now · nothing else changed' : 'From her saved answers'} onClick={() => setRepair(true)} />
        </ListGroup>
      </Page>
      <ConfirmSheet contained centered={wide} open={repair} onDismiss={() => setRepair(false)}
        title="Rebuild her progress and Review?"
        message="This recalculates course completion, set status and the Review list for all 4 courses from her 412 saved answers. Her answers and scores are not changed. 2 questions in NURS 214 would move back into Review."
        actions={[{ label: 'Rebuild', variant: 'primary', onClick: () => { setRepair(false); setDone(true); } }, { label: 'Cancel', onClick: () => setRepair(false) }]} />
    </div>
  );
}

function AdminWeeks({ nav, phone, wide }) {
  const Page = window.Page;
  const [course, setCourse] = React.useState(0);
  const [saved, setSaved] = React.useState(false);
  const labels = D.weeks.map((w) => w.label);
  return (
    <Page title="Fix a week" onBack={nav.back} backLabel="Admin" phone={phone} wide={wide} maxWidth="var(--content-max)">
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-2)' }}>Course</span>
        <PickerSelect options={['NURS 214 · Adult Health I', 'NURS 220 · Pharmacology', 'NURS 110 · Health Assessment', 'NURS 101 · Foundations']} value={course} onChange={setCourse} />
      </label>
      {D.weeks.map((w) => (
        <section key={w.id} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface)', boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)' }}>
          <TextField label="Week label" defaultValue={w.label} hint={w.id === 'w4' ? 'e.g. “Weeks 3–4” for a mixed week' : undefined} />
          {w.sets.map((s) => (
            <div key={s.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 150px', gap: 10, alignItems: 'center' }}>
              <span style={{ font: 'var(--text-subhead)', color: 'var(--text-1)' }}>{s.title}</span>
              <PickerSelect options={labels.map((l) => `Move to ${l}`)} value={labels.indexOf(w.label)} onChange={() => setSaved(false)} />
            </div>
          ))}
        </section>
      ))}
      <Button size="lg" fullWidth icon={saved ? 'check' : undefined} onClick={() => setSaved(true)}>{saved ? 'Saved' : 'Save changes'}</Button>
    </Page>
  );
}

function AdminAccount({ nav, phone, wide }) {
  const Page = window.Page;
  const [sent, setSent] = React.useState(false);
  const [temp, setTemp] = React.useState(false);
  return (
    <Page title="Her password" onBack={nav.back} backLabel="Admin" phone={phone} wide={wide} maxWidth="var(--content-max)">
      <ListGroup header="Send a reset email" footer="She gets a link at maya@example.com that works for one hour.">
        <ListRow icon={sent ? 'check' : 'mail'} title={sent ? 'Reset email sent' : 'Send reset email'} onClick={() => setSent(true)} />
      </ListGroup>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <TextField label="Or set a temporary password" type="text" defaultValue="lamp-river-42" hint="Give it to her yourself. She’s asked to change it the next time she signs in." />
        <Button variant="secondary" size="lg" fullWidth icon={temp ? 'check' : 'lock'} onClick={() => setTemp(true)}>{temp ? 'Temporary password set' : 'Set temporary password'}</Button>
      </section>
    </Page>
  );
}

Object.assign(window, { AdminHome, AdminWeeks, AdminAccount });
})();
