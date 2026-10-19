(() => {
const { AnswerOption, OrderingRow, MatchRow, MatrixGrid, HighlightPassage, ClozeBlank } = window.QbankDesignSystem_4be789;

const FORMAT_NAMES = { single: 'Single answer', priority: 'Priority', sata: 'Select all that apply', highlight: 'Highlight', order: 'Ordering', match: 'Matching', matrix: 'Matrix', cloze: 'Drop-down' };
const RULES = {
  sata: '+1 for each correct choice, −1 for each wrong one',
  highlight: '+1 for each correct choice, −1 for each wrong one',
  order: 'Items in the right position; full credit needs all of them',
  match: '1 point for each correct pair',
  matrix: '1 point for each correct row',
  cloze: '1 point for each correct blank',
};

const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const range = (n) => Array.from({ length: n }, (_, i) => i);

// The shuffle she saw — saved with the attempt.
function makeLayout(q) {
  if (q.options) return { opt: shuffle(range(q.options.length)) };
  if (q.type === 'order') { let o = shuffle(range(q.items.length)); if (o.every((v, i) => v === i)) o = o.reverse(); return { start: o }; }
  if (q.type === 'match') return { choices: shuffle([...q.pairs.map((p) => p.r), ...(q.extra || [])]) };
  return {};
}
function initialResponse(q, layout) {
  if (q.type === 'order') return { order: layout.start.slice() };
  return {};
}
function isAnswered(q, r) {
  if (!r) return false;
  switch (q.type) {
    case 'single': case 'priority': return r.pick != null;
    case 'sata': case 'highlight': return (r.picks || []).length > 0;
    case 'order': return true;
    case 'match': return Object.keys(r.map || {}).length === q.pairs.length;
    case 'matrix': return Object.keys(r.map || {}).length === q.rows.length;
    case 'cloze': return Object.keys(r.map || {}).length === q.blanks.length;
  }
  return false;
}
function score(q, r, layout) {
  r = r || {};
  let points = 0, max = 1;
  switch (q.type) {
    case 'single': case 'priority': points = r.pick != null && q.options[r.pick].ok ? 1 : 0; break;
    case 'sata': { const ok = q.options.map((o) => !!o.ok); max = ok.filter(Boolean).length; points = Math.max(0, (r.picks || []).reduce((s, i) => s + (ok[i] ? 1 : -1), 0)); break; }
    case 'highlight': { max = q.segments.filter((s) => s.ok).length; points = Math.max(0, (r.picks || []).reduce((s, i) => s + (q.segments[i].ok ? 1 : -1), 0)); break; }
    case 'order': max = q.items.length; points = (r.order || []).filter((v, i) => v === i).length; break;
    case 'match': max = q.pairs.length; points = q.pairs.filter((p, i) => r.map && r.map[i] != null && layout.choices[r.map[i]] === p.r).length; break;
    case 'matrix': max = q.rows.length; points = q.rows.filter((row, i) => r.map && r.map[i] === row.ans).length; break;
    case 'cloze': max = q.blanks.length; points = q.blanks.filter((b, i) => r.map && r.map[i] === b.ans).length; break;
  }
  const status = points === max ? 'correct' : points > 0 ? 'partial' : 'wrong';
  return { points, max, status };
}

function QuestionBody({ q, layout, response, onChange, revealed, wide }) {
  const r = response || {};
  const set = (patch) => onChange({ ...r, ...patch });
  const gap = { display: 'flex', flexDirection: 'column', gap: 10 };
  switch (q.type) {
    case 'single': case 'priority':
    case 'sata': {
      const multi = q.type === 'sata';
      const picks = multi ? (r.picks || []) : r.pick != null ? [r.pick] : [];
      return <div style={gap} role={multi ? 'group' : 'radiogroup'}>{layout.opt.map((oi) => {
        const o = q.options[oi]; const picked = picks.includes(oi);
        const state = !revealed ? (picked ? 'selected' : 'idle') : picked && o.ok ? 'correct' : picked ? 'wrong' : o.ok ? 'missed' : 'dim';
        return <AnswerOption key={oi} control={multi ? 'checkbox' : 'radio'} text={o.t} state={state} reason={o.why}
          onClick={() => multi ? set({ picks: picked ? picks.filter((x) => x !== oi) : [...picks, oi] }) : set({ pick: oi })} />;
      })}</div>;
    }
    case 'order': {
      const order = r.order || layout.start;
      const move = (i, d) => { const o = order.slice(); [o[i], o[i + d]] = [o[i + d], o[i]]; set({ order: o }); };
      return <div style={{ ...gap, gap: 8 }}>{order.map((item, i) => (
        <OrderingRow key={item} position={i + 1} text={q.items[item]}
          state={!revealed ? 'idle' : item === i ? 'correct' : 'wrong'} correctPosition={item + 1}
          onMoveUp={i > 0 ? () => move(i, -1) : undefined} onMoveDown={i < order.length - 1 ? () => move(i, 1) : undefined} />
      ))}</div>;
    }
    case 'match':
      return <div style={gap}>{q.pairs.map((p, i) => {
        const v = r.map ? r.map[i] : null;
        return <MatchRow key={i} left={p.l} options={layout.choices} value={v} correctText={p.r}
          state={!revealed ? 'idle' : v != null && layout.choices[v] === p.r ? 'correct' : 'wrong'}
          onChange={(n) => set({ map: { ...(r.map || {}), [i]: n } })} />;
      })}</div>;
    case 'matrix':
      return <MatrixGrid columns={q.columns} rows={q.rows} value={r.map || {}} onChange={(m) => set({ map: m })} revealed={revealed} layout={wide ? 'table' : 'stacked'} />;
    case 'highlight': {
      const picks = r.picks || [];
      return <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface)', boxShadow: 'inset 0 0 0 0.5px var(--separator)' }}>
        <HighlightPassage segments={q.segments} selected={picks} revealed={revealed} size={wide ? 'lg' : 'md'}
          onToggle={(i) => set({ picks: picks.includes(i) ? picks.filter((x) => x !== i) : [...picks, i] })} />
      </div>;
    }
    case 'cloze':
      return <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface)', boxShadow: 'inset 0 0 0 0.5px var(--separator)' }}>
        <ClozeBlank template={q.template} blanks={q.blanks} value={r.map || {}} onChange={(m) => set({ map: m })} revealed={revealed} size={wide ? 'lg' : 'md'} />
      </div>;
  }
  return null;
}

Object.assign(window, { QB_Q: { FORMAT_NAMES, RULES, makeLayout, initialResponse, isAnswered, score, shuffle }, QuestionBody });
})();
