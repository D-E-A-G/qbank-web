(() => {
const { Button, Icon, ProgressBar, Checkbox, FeedbackBanner, RationaleBlock, TermDefinition, CountdownTimer, ConfirmSheet, StatusMark, ListGroup } = window.QbankDesignSystem_4be789;
const D = window.QB_DATA;

function Runner({ mode = 'practice', title, questions, wide, phone, onExit, onFinish, seconds: startSeconds }) {
  const Q = window.QB_Q;
  const exam = mode === 'exam';
  const layouts = React.useMemo(() => Object.fromEntries(questions.map((q) => [q.id, Q.makeLayout(q)])), [questions]);
  const [idx, setIdx] = React.useState(0);
  const [resp, setResp] = React.useState(() => Object.fromEntries(questions.map((q) => [q.id, Q.initialResponse(q, layouts[q.id])])));
  const [guess, setGuess] = React.useState({});
  const [checked, setChecked] = React.useState({});
  const [submitted, setSubmitted] = React.useState({});
  const [skipped, setSkipped] = React.useState([]);
  const [notice, setNotice] = React.useState(null);
  const [confirmEnd, setConfirmEnd] = React.useState(false);
  const [secs, setSecs] = React.useState(startSeconds || 0);
  const t0 = React.useRef(Date.now());
  const scroller = React.useRef(null);
  const feedbackRef = React.useRef(null);
  const q = questions[idx];
  const revealed = !exam && checked[q.id];
  const answered = Q.isAnswered(q, resp[q.id]);

  const finish = React.useCallback((reason) => {
    const items = questions.map((qq) => {
      const done = exam ? submitted[qq.id] : checked[qq.id];
      const s = done ? Q.score(qq, resp[qq.id], layouts[qq.id]) : { points: 0, max: Q.score(qq, {}, layouts[qq.id]).max, status: 'unanswered' };
      return { q: qq, ...s, guessed: !!guess[qq.id] && done, response: resp[qq.id], layout: layouts[qq.id] };
    });
    onFinish && onFinish({ mode, title, items, minutes: Math.max(1, Math.round((Date.now() - t0.current) / 60000)), reason });
  }, [questions, submitted, checked, resp, guess, layouts]);

  React.useEffect(() => {
    if (!exam) return;
    const t = setInterval(() => setSecs((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [exam]);
  React.useEffect(() => { if (exam && secs <= 0 && startSeconds) finish('timeout'); }, [secs]);
  React.useEffect(() => { if (scroller.current) scroller.current.scrollTop = 0; setNotice(null); }, [idx]);

  const go = (i) => setIdx(i);
  const check = () => {
    setChecked({ ...checked, [q.id]: true });
    setTimeout(() => { if (scroller.current && feedbackRef.current) scroller.current.scrollTo({ top: feedbackRef.current.offsetTop - 12, behavior: 'smooth' }); }, 60);
  };
  const next = () => (idx < questions.length - 1 ? go(idx + 1) : finish('done'));

  const examAdvance = (sub, skp) => {
    const remaining = skp.filter((id) => !sub[id]);
    let n = idx + 1;
    if (n < questions.length) return go(n);
    if (remaining.length) {
      const first = questions.findIndex((qq) => qq.id === remaining[0]);
      go(first);
      setTimeout(() => setNotice(`${remaining.length} skipped ${remaining.length === 1 ? 'question' : 'questions'} left. This is the first one.`), 0);
      return;
    }
    finish('done');
  };
  const submit = () => { const sub = { ...submitted, [q.id]: true }; setSubmitted(sub); const skp = skipped.filter((id) => id !== q.id); setSkipped(skp); examAdvance(sub, skp); };
  const skip = () => { const skp = skipped.includes(q.id) ? skipped : [...skipped, q.id]; setSkipped(skp); examAdvance(submitted, skp); };
  const answeredCount = Object.keys(submitted).length;
  const allVisited = idx === questions.length - 1 || skipped.length > 0 && questions.slice(idx + 1).every((qq) => submitted[qq.id] || skipped.includes(qq.id));

  const pad = wide ? 32 : 16;
  const result = revealed ? Q.score(q, resp[q.id], layouts[q.id]) : null;
  const termKeys = q.terms || [];

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ paddingTop: phone ? 54 : 0, background: 'var(--material)', backdropFilter: 'var(--blur-material)', WebkitBackdropFilter: 'var(--blur-material)', borderBottom: '0.5px solid var(--separator)', zIndex: 5 }}>
        <div style={{ height: 48, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 8px' }}>
          <div>{exam
            ? <Button variant="plain" size="sm" onClick={() => setConfirmEnd(true)}>End exam</Button>
            : <Button variant="plain" size="sm" iconOnly icon="x" label="Close" onClick={onExit} style={{ color: 'var(--text-2)' }} />}</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ font: 'var(--text-headline)', color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>{idx + 1} of {questions.length}</div>
            <div style={{ font: 'var(--text-caption)', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: wide ? 420 : 200 }}>{title}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 8 }}>{exam && <CountdownTimer seconds={secs} compact={!wide} />}</div>
        </div>
        <ProgressBar value={(idx + (revealed || submitted[q.id] ? 1 : 0)) / questions.length} height={3} style={{ borderRadius: 0 }} />
      </div>

      <div ref={scroller} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: `${wide ? 28 : 20}px ${pad}px 28px`, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {notice && <div role="status" style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--tint-soft)', color: 'var(--text-1)', font: 'var(--text-subhead)' }}><Icon name="info" size={18} color="var(--tint)" />{notice}</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-3)' }}>
            <span style={{ color: 'var(--tint)' }}>{Q.FORMAT_NAMES[q.type]}</span><span>{q.topic}</span>{exam && skipped.includes(q.id) && <span style={{ color: 'var(--partial)' }}>Skipped earlier</span>}
          </div>
          <p style={{ margin: 0, font: wide ? 'var(--text-reading-lg)' : 'var(--text-reading)', color: 'var(--text-1)', textWrap: 'pretty' }}>{q.stem}</p>
          <p style={{ margin: 0, font: wide ? 'var(--weight-semibold) var(--size-title-3)/var(--lh-title-3) var(--font-ui)' : 'var(--text-headline)', color: 'var(--text-1)', textWrap: 'pretty' }}>{q.ask}</p>
          {revealed && <div ref={feedbackRef}><FeedbackBanner status={result.status} points={result.points} max={result.max} rule={Q.RULES[q.type]} guessed={guess[q.id]} /></div>}
          <window.QuestionBody key={q.id} q={q} layout={layouts[q.id]} response={resp[q.id]} revealed={revealed} wide={wide}
            onChange={(r) => !revealed && !submitted[q.id] && setResp({ ...resp, [q.id]: r })} />
          {!revealed && <Checkbox tone="guess" checked={!!guess[q.id]} onChange={(v) => setGuess({ ...guess, [q.id]: v })} label="I'm guessing" detail="Flag for review" />}

          {revealed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4 }}>
              <RationaleBlock>{q.rationale}</RationaleBlock>
              <RationaleBlock variant="takeaway">{q.takeaway}</RationaleBlock>
              {termKeys.length > 0 && (
                <section style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ margin: '0 0 2px', font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>Terms in this question</h4>
                  {termKeys.map((k, i) => <TermDefinition key={k} term={D.terms[k][0]} meaning={D.terms[k][1]} divider={i < termKeys.length - 1} />)}
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: `12px ${pad}px ${phone ? 34 : 16}px`, background: 'var(--material)', backdropFilter: 'var(--blur-material)', WebkitBackdropFilter: 'var(--blur-material)', borderTop: '0.5px solid var(--separator)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'flex', gap: 10 }}>
          {exam ? (<>
            <Button variant="quiet" size="lg" onClick={skip} style={{ flex: '0 0 auto' }}>Skip for now</Button>
            <Button size="lg" fullWidth disabled={!answered} onClick={submit}>{allVisited && skipped.filter((id) => id !== q.id).length === 0 ? 'Finish exam' : 'Submit and continue'}</Button>
          </>) : revealed
            ? <Button size="lg" fullWidth iconRight={idx < questions.length - 1 ? 'arrow-right' : undefined} onClick={next}>{idx < questions.length - 1 ? 'Next question' : 'See results'}</Button>
            : <Button size="lg" fullWidth disabled={!answered} onClick={check}>Check answer</Button>}
        </div>
      </div>

      <ConfirmSheet contained open={confirmEnd} centered={wide} onDismiss={() => setConfirmEnd(false)}
        title="End the exam now?"
        message={`The ${answeredCount} ${answeredCount === 1 ? 'question' : 'questions'} you answered will be scored. Skipped and unreached questions score 0 and stay out of Review.`}
        actions={[{ label: 'End exam', variant: 'destructive', onClick: () => { setConfirmEnd(false); finish('left'); } }, { label: 'Keep going', onClick: () => setConfirmEnd(false) }]} />
    </div>
  );
}

function BreakdownRows({ rows }) {
  return <ListGroup>{rows.map((r) => (
    <div key={r.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 90px 64px', gap: 12, alignItems: 'center', padding: '12px 16px' }}>
      <span style={{ font: 'var(--text-subhead)', color: 'var(--text-1)' }}>{r.label}</span>
      <ProgressBar value={r.total ? r.right / r.total : 0} tone={r.right === r.total ? 'correct' : 'tint'} height={6} />
      <span style={{ font: 'var(--weight-semibold) var(--size-subhead)/1 var(--font-ui)', color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{r.right} of {r.total}</span>
    </div>
  ))}</ListGroup>;
}

function ResultRow({ item, n, wide }) {
  const [open, setOpen] = React.useState(false);
  const st = item.status === 'unanswered' ? 'unanswered' : item.guessed ? 'guessed' : item.status;
  return (
    <div>
      <button onClick={() => setOpen(!open)} aria-expanded={open} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ width: 22, font: 'var(--weight-semibold) var(--size-footnote)/1 var(--font-mono)', color: 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>{n}</span>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--text-body)', color: 'var(--text-1)' }}>{item.q.topic}</span>
          <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>{window.QB_Q.FORMAT_NAMES[item.q.type]} · {item.points} of {item.max}</span>
        </span>
        <StatusMark status={st} size="sm" label={st === 'guessed' ? `Guessed · ${item.status === 'correct' ? 'right' : 'not right'}` : undefined} />
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} color="var(--text-4)" strokeWidth={2} />
      </button>
      {open && (
        <div style={{ padding: '4px 16px 18px 50px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: 0, font: 'var(--text-reading-sm)', color: 'var(--text-1)' }}>{item.q.stem} <strong style={{ fontFamily: 'var(--font-ui)' }}>{item.q.ask}</strong></p>
          <window.QuestionBody q={item.q} layout={item.layout} response={item.response} revealed wide={wide} onChange={() => {}} />
          <RationaleBlock>{item.q.rationale}</RationaleBlock>
          <RationaleBlock variant="takeaway">{item.q.takeaway}</RationaleBlock>
        </div>
      )}
    </div>
  );
}

function Results({ result, wide, phone, onDone, onReview }) {
  const exam = result.mode === 'exam';
  const it = result.items;
  const right = it.filter((i) => i.status === 'correct').length;
  const pts = it.reduce((s, i) => s + i.points, 0), max = it.reduce((s, i) => s + i.max, 0);
  const count = (k) => it.filter((i) => i.status === k).length;
  const guessed = it.filter((i) => i.guessed).length;
  const toReview = it.filter((i) => i.status !== 'unanswered' && (i.status !== 'correct' || i.guessed)).length;
  const cjs = [...new Set(it.map((i) => i.q.cj))].map((cj) => ({ label: cj, right: it.filter((i) => i.q.cj === cj && i.status === 'correct').length, total: it.filter((i) => i.q.cj === cj).length }));
  const pad = wide ? 32 : 16;
  const stat = (label, value, st) => (
    <div style={{ flex: 1, minWidth: 90, display: 'flex', flexDirection: 'column', gap: 4, padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--surface)', boxShadow: 'inset 0 0 0 0.5px var(--separator)' }}>
      <span style={{ font: 'var(--weight-bold) var(--size-title-3)/var(--lh-title-3) var(--font-display)', color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {st ? <StatusMark status={st} size="sm" label={label} /> : <span style={{ font: 'var(--text-footnote)', color: 'var(--text-3)' }}>{label}</span>}
    </div>
  );
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: `${phone ? 58 : 32}px ${pad}px 48px`, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: phone ? '0 -8px -4px 0' : '-20px -8px 0 0' }}><Button variant="plain" size="sm" onClick={onDone}>Done</Button></div>
          <span style={{ font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)', color: 'var(--text-3)' }}>{exam ? 'Exam result' : 'Set finished'} · {result.title}</span>
          <h1 style={{ margin: 0, font: 'var(--text-large-title)', letterSpacing: 'var(--tracking-tight)', color: 'var(--text-1)' }}>{right} of {it.length} fully right</h1>
          <span style={{ font: 'var(--text-callout)', color: 'var(--text-2)' }}>{pts} of {max} points · {result.minutes} min{result.reason === 'timeout' ? ' · Time ran out' : result.reason === 'left' ? ' · Ended early' : ''}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {stat('Partly right', count('partial'), 'partial')}{stat('Missed', count('wrong'), 'wrong')}{stat('Guessed', guessed, 'guessed')}
          {exam && stat('Not answered', count('unanswered'), 'unanswered')}
        </div>
        {exam && toReview > 0 && <Button size="lg" fullWidth icon="inbox" onClick={onReview}>Open Review · {toReview} from this exam</Button>}
        {exam && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><h3 style={{ margin: 0, font: 'var(--text-headline)' }}>By week</h3><BreakdownRows rows={[{ label: 'Week 4', right, total: it.length }]} /></div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><h3 style={{ margin: 0, font: 'var(--text-headline)' }}>By clinical judgment step</h3><BreakdownRows rows={cjs} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3 style={{ margin: 0, font: 'var(--text-headline)' }}>Questions</h3>
          <ListGroup>{it.map((item, i) => <ResultRow key={item.q.id} item={item} n={i + 1} wide={wide} />)}</ListGroup>
        </div>
        <Button variant={exam ? 'quiet' : 'primary'} size="lg" fullWidth onClick={onDone}>Back to course</Button>
      </div>
    </div>
  );
}

Object.assign(window, { Runner, Results });
})();
