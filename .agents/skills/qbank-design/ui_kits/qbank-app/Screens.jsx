(() => {
const { NavBar, Button, Icon, TextField, CourseCard, SetRow, Tile, FilterChip, ListGroup, ListRow, StatusMark, TermDefinition, EmptyState, ConfirmSheet } = window.QbankDesignSystem_4be789;
const D = window.QB_DATA;

function ReadOnlyBanner() {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', color: 'var(--text-2)', font: 'var(--text-footnote)' }}>
    <Icon name="eye" size={16} />Her progress, read-only. Answers, scores and Review can’t be changed here.
  </div>;
}

function Page({ title, subtitle, large = true, onBack, backLabel, trailing, phone, wide, admin, children, maxWidth }) {
  const pad = wide ? 'var(--gutter-tablet)' : 'var(--gutter-phone)';
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {phone && <div style={{ height: 54, flexShrink: 0, background: 'var(--material)' }}></div>}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <NavBar large={false} onBack={onBack} backLabel={backLabel} trailing={trailing} />
        <div style={{ maxWidth: maxWidth || (wide ? 'var(--content-max-wide)' : 'none'), margin: '0 auto', padding: `2px ${pad} ${phone ? 110 : 48}px`, display: 'flex', flexDirection: 'column', gap: 'var(--gap-section)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: -12 }}>
            <h1 style={{ margin: 0, font: 'var(--text-large-title)', letterSpacing: 'var(--tracking-tight)', color: 'var(--text-1)', textWrap: 'balance' }}>{title}</h1>
            {subtitle && <div style={{ font: 'var(--text-subhead)', color: 'var(--text-2)' }}>{subtitle}</div>}
          </div>
          {admin && <ReadOnlyBanner />}
          {children}
        </div>
      </div>
    </div>
  );
}

function SignIn({ onSignedIn, phone }) {
  const [forgot, setForgot] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: `${phone ? 110 : 80}px 24px 40px`, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
          <window.AppIconMark size={76} />
          <div>
            <h1 style={{ margin: 0, font: 'var(--text-title-1)', color: 'var(--text-1)' }}>{forgot ? 'Reset your password' : 'Qbank'}</h1>
            <p style={{ margin: '4px 0 0', font: 'var(--text-subhead)', color: 'var(--text-2)' }}>{forgot ? 'We’ll email you a link to set a new one.' : 'NCLEX practice, synced across your devices.'}</p>
          </div>
        </div>
        {sent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
            <Icon name="mail" size={28} color="var(--tint)" />
            <p style={{ margin: 0, font: 'var(--text-callout)', color: 'var(--text-2)', textWrap: 'pretty' }}>If that address has an account, a reset link is on its way. It works for one hour.</p>
            <Button variant="plain" onClick={() => { setForgot(false); setSent(false); }}>Back to sign in</Button>
          </div>
        ) : forgot ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <TextField label="Email" type="email" defaultValue="maya@example.com" />
            <Button size="lg" fullWidth onClick={() => setSent(true)}>Send reset link</Button>
            <Button variant="plain" onClick={() => setForgot(false)}>Cancel</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <TextField label="Email" type="email" defaultValue="maya@example.com" />
            <TextField label="Password" type="password" defaultValue="••••••••••" />
            <Button size="lg" fullWidth onClick={() => onSignedIn(true)}>Sign in</Button>
            <Button variant="secondary" size="lg" fullWidth icon="scan-face" onClick={() => onSignedIn(false)}>Sign in with a passkey</Button>
            <Button variant="plain" onClick={() => setForgot(true)}>Forgot password?</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Home({ nav, phone, wide, admin }) {
  return (
    <Page title="Home" phone={phone} wide={wide} admin={admin}
      trailing={!admin || true ? <Button variant="plain" size="sm" iconOnly icon="plus" label="Import a file" onClick={() => nav.tab('import')} /> : null}>
      {D.semesters.map((s) => (
        <section key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
            <h2 style={{ margin: 0, font: 'var(--text-title-3)', color: 'var(--text-1)' }}>{s.label}</h2>
            <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>{s.dates}</span>
          </div>
          {s.courses.length === 0 ? (
            <div style={{ borderRadius: 'var(--radius-md)', border: '1px dashed var(--separator-strong)' }}>
              <EmptyState compact icon="layers" message="A course appears here when its first question file is imported." actionLabel="Import a file" actionIcon="file-input" onAction={() => nav.tab('import')} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: wide ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: 'var(--gap-stack)' }}>
              {s.courses.map((c) => <CourseCard key={c.id} {...c} onClick={() => nav.push('course', { course: c })} />)}
            </div>
          )}
        </section>
      ))}
    </Page>
  );
}

function Course({ nav, course, phone, wide, admin }) {
  const c = course || D.semesters[1].courses[0];
  const [weeks, setWeeks] = React.useState(D.weeks);
  const [restore, setRestore] = React.useState(null);
  const doRestore = () => { setWeeks(weeks.map((w) => ({ ...w, sets: w.sets.map((s) => s.id === restore.id ? { ...s, status: 'done', detail: 'Restored just now · 12 questions' } : s) }))); setRestore(null); };
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Page title={c.title} subtitle={`${c.code} · Semester 2`} onBack={wide ? undefined : nav.back} backLabel="Home" phone={phone} wide={wide} admin={admin}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Tile icon="timer" label="Exam" detail={wide ? '40 questions in 60 min' : '40 in 60 min'} emphasis={!admin} onClick={() => nav.push('examSetup', { course: c })} />
          <Tile icon="inbox" value={c.toReview} label="to review" onClick={() => nav.push('review', { course: c })} />
          <Tile icon="book-open" value={c.terms || 41} label="terms" onClick={() => nav.push('terms', { course: c })} />
        </div>
        {!admin && (
          <ListGroup header="Pick up where you left off">
            <ListRow icon="clock" title="Week 3 · Set 2: Dysrhythmias" detail="7 of 12 answered" chevron onClick={() => nav.runSet('Week 3 · Set 2: Dysrhythmias')} />
          </ListGroup>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: wide ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 'var(--gap-section) 20px' }}>
          {weeks.map((w) => (
            <ListGroup key={w.id} header={`${w.label} · ${w.count} questions`}>
              {w.sets.map((s) => <SetRow key={s.id} {...s} readOnly={false}
                onClick={admin ? undefined : () => nav.runSet(`${w.label} · ${s.title}`)} onRestore={() => setRestore(s)} />)}
            </ListGroup>
          ))}
        </div>
      </Page>
      <ConfirmSheet contained centered={wide} open={!!restore} onDismiss={() => setRestore(null)}
        title={`Restore the previous “${restore ? restore.title.replace(/^Set \d+: /, '') : ''}”?`}
        message="The corrected file you imported today is kept, so you can switch back. Answers on questions that didn’t change are kept either way."
        actions={[{ label: 'Restore', variant: 'primary', onClick: doRestore }, { label: 'Cancel', onClick: () => setRestore(null) }]} />
    </div>
  );
}

function Terms({ nav, course, phone, wide, admin }) {
  const [q, setQ] = React.useState('');
  const list = Object.entries(D.terms).map(([k, [t, m]]) => ({ k, t, m })).sort((a, b) => a.t.localeCompare(b.t)).filter((x) => (x.t + x.m).toLowerCase().includes(q.toLowerCase()));
  return (
    <Page title="Terms" subtitle={`${(course || {}).code || 'NURS 214'} · ${list.length} terms`} onBack={nav.back} backLabel="Course" phone={phone} wide={wide} admin={admin} maxWidth="var(--content-max)">
      <TextField placeholder="Search terms" value={q} onChange={setQ} />
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '0 16px', boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)' }}>
        {list.length ? list.map((x, i) => <TermDefinition key={x.k} term={x.t} meaning={x.m} source={i % 3 === 0 ? 'Week 4 · Set 2' : i % 3 === 1 ? 'Week 3 · Set 1' : 'Week 2 · Set 1'} divider={i < list.length - 1} />)
          : <EmptyState compact icon="search" title="No matching terms" message="Try a shorter word." />}
      </div>
    </Page>
  );
}

function Review({ nav, course, phone, wide, admin }) {
  const [f, setF] = React.useState('all');
  const [confirm, setConfirm] = React.useState(false);
  const [cleared, setCleared] = React.useState(false);
  const counts = D.reviewCounts;
  const rows = cleared ? [] : D.review.filter((r) => f === 'all' || r.status === f);
  const n = cleared ? 0 : counts[f];
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Page title="Review" subtitle={`${(course || {}).code || 'NURS 214'} · what you missed or guessed`} onBack={nav.back} backLabel="Course" phone={phone} wide={wide} admin={admin} maxWidth="var(--content-max)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -4px', padding: '0 4px' }}>
            {[['all', 'All'], ['wrong', 'Missed'], ['partial', 'Partly right'], ['guessed', 'Guessed']].map(([id, l]) => <FilterChip key={id} label={l} count={cleared ? 0 : counts[id]} selected={f === id} onClick={() => setF(id)} />)}
          </div>
          {!admin && n > 0 && <Button size="lg" fullWidth icon="shuffle" onClick={() => nav.runSet(`Review · ${n} questions`)}>Practice these {n} (shuffled)</Button>}
        </div>
        {rows.length === 0 ? (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}><EmptyState icon="inbox" title="Nothing to review" message="Questions you miss or flag as a guess show up here. They leave when you answer them fully right without guessing." /></div>
        ) : (
          <ListGroup footer={f === 'all' ? `Showing ${rows.length} of ${n}.` : undefined}>
            {rows.map((r, i) => (
              <button key={i} onClick={admin ? undefined : () => nav.runSet(r.topic)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', border: 'none', background: 'transparent', textAlign: 'left', cursor: admin ? 'default' : 'pointer' }}>
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ font: 'var(--text-body)', color: 'var(--text-1)' }}>{r.topic}</span>
                  <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>{r.week} · {r.format}</span>
                  <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>{r.where}</span>
                </span>
                <StatusMark status={r.status} size="sm" />
                {!admin && <Icon name="chevron-right" size={18} color="var(--text-4)" strokeWidth={2} />}
              </button>
            ))}
          </ListGroup>
        )}
        {!admin && !cleared && <Button variant="plain" onClick={() => setConfirm(true)} style={{ color: 'var(--wrong)', alignSelf: 'center' }}>Clear the review list</Button>}
      </Page>
      <ConfirmSheet contained centered={wide} open={confirm} onDismiss={() => setConfirm(false)}
        title={`Clear all ${counts.all} questions from this course’s Review list?`} message="Your answers and scores are kept. Only the list is emptied."
        actions={[{ label: 'Clear', variant: 'destructive', onClick: () => { setCleared(true); setConfirm(false); } }, { label: 'Cancel', onClick: () => setConfirm(false) }]} />
    </div>
  );
}

Object.assign(window, { Page, SignIn, Home, Course, Terms, Review, ReadOnlyBanner });
})();
