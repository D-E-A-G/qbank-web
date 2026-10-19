(() => {
const { TabBar, Sidebar, SegmentedControl, ConfirmSheet, Icon } = window.QbankDesignSystem_4be789;
const D = window.QB_DATA;

const FRAMES = { iphone: { w: 402, h: 874 }, ipad: { w: 1180, h: 820 }, mac: { w: 1280, h: 800 } };

function useFit(frame, reserved = 64) {
  const [s, setS] = React.useState(1);
  React.useEffect(() => {
    const f = () => setS(Math.min((window.innerWidth - 32) / (frame.w + 28), (window.innerHeight - reserved - 24) / (frame.h + 28), 1));
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f);
  }, [frame.w, frame.h]);
  return s;
}

function IPadFrame({ children, dark }) {
  return <div style={{ width: 1180 + 28, height: 820 + 28, padding: 14, boxSizing: 'border-box', borderRadius: 42, background: '#1b1b1d', boxShadow: '0 30px 80px rgba(0,0,0,.25)' }}>
    <div style={{ width: 1180, height: 820, borderRadius: 26, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 24, flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 22px', font: '600 13px/1 -apple-system, system-ui', color: dark ? '#fff' : '#000', background: 'var(--bg-sidebar)', position: 'absolute', left: 0, right: 0, top: 0, zIndex: 30, pointerEvents: 'none', backgroundColor: 'transparent' }}><span>9:41 Mon Sep 28</span><span>100%</span></div>
      {children}
    </div>
  </div>;
}

function MacFrame({ children }) {
  return <div style={{ width: 1280, height: 800, borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 0 0 0.5px rgba(0,0,0,.35), 0 30px 80px rgba(0,0,0,.28)' }}>
    <div style={{ height: 38, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', background: 'var(--bg-sidebar)', borderBottom: '0.5px solid var(--separator-strong)', position: 'relative' }}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,.15)' }}></span>)}
      <span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', font: 'var(--weight-semibold) 13px/1 var(--font-ui)', color: 'var(--text-2)', pointerEvents: 'none' }}>Qbank</span>
    </div>
    <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>{children}</div>
  </div>;
}

function App() {
  const role = window.QB_ROLE || 'student';
  const admin = role === 'admin';
  const [device, setDevice] = React.useState(() => localStorage.getItem('qb-kit-device') || 'iphone');
  const [look, setLook] = React.useState(() => localStorage.getItem('qb-kit-look') || 'light');
  const [palette, setPalette] = React.useState(() => localStorage.getItem('qb-kit-palette') || 'dusk');
  React.useEffect(() => { localStorage.setItem('qb-kit-palette', palette); document.documentElement.setAttribute('data-palette', palette); }, [palette]);
  const [signedIn, setSignedIn] = React.useState(admin || localStorage.getItem('qb-kit-signed') === '1');
  const [offer, setOffer] = React.useState(false);
  const [tab, setTab] = React.useState('home');
  const home = D.semesters[1].courses[0];
  const [stacks, setStacks] = React.useState({ home: [{ name: 'home' }, { name: 'course', course: home }], import: [{ name: 'import' }], settings: [{ name: 'settings' }], admin: [{ name: 'admin' }] });
  const [overlay, setOverlay] = React.useState(null);
  React.useEffect(() => localStorage.setItem('qb-kit-device', device), [device]);
  React.useEffect(() => localStorage.setItem('qb-kit-look', look), [look]);
  React.useEffect(() => localStorage.setItem('qb-kit-signed', signedIn ? '1' : '0'), [signedIn]);
  const osDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = look === 'auto' ? (osDark ? 'dark' : 'light') : look; // kit resolves 'auto' itself; real app sets data-theme="auto"
  const phone = device === 'iphone', wide = !phone;
  const frame = FRAMES[device];
  const scale = useFit(frame);

  const stack = stacks[tab];
  const top = stack[stack.length - 1];
  const setStack = (t, s) => setStacks((all) => ({ ...all, [t]: s }));
  const nav = {
    push: (name, params) => setStack(tab, [...stack, { name, ...params }]),
    back: () => setStack(tab, stack.length > 1 ? stack.slice(0, -1) : stack),
    tab: (t) => { setTab(t); },
    openCourse: (c) => { setTab('home'); setStack('home', [{ name: 'home' }, { name: 'course', course: c || home }]); },
    runSet: (title) => setOverlay({ kind: 'runner', mode: 'practice', title, questions: D.questions }),
    runExam: (weeks) => setOverlay({ kind: 'runner', mode: 'exam', title: `Exam · ${weeks}`, questions: D.questions, seconds: Math.round(D.questions.length * 1.5 * 60) }),
    signOut: () => { setSignedIn(false); setTab('home'); },
  };
  const selectSidebar = (id) => {
    const c = D.semesters.flatMap((s) => s.courses).find((x) => x.id === id);
    if (c) return nav.openCourse(c);
    setTab(id); if (id === 'home') setStack('home', [{ name: 'home' }]);
  };

  const props = { nav, phone, wide, admin, look, setLook };
  const screens = { home: window.Home, course: window.Course, terms: window.Terms, review: window.Review, examSetup: window.ExamSetup, import: window.Import, settings: window.Settings, admin: window.AdminHome, adminWeeks: window.AdminWeeks, adminAccount: window.AdminAccount };
  const Screen = screens[top.name] || window.Home;
  const tabs = [{ id: 'home', label: 'Home', icon: 'house' }, { id: 'import', label: 'Import', icon: 'file-input' }, ...(admin ? [{ id: 'admin', label: 'Admin', icon: 'shield' }] : []), { id: 'settings', label: 'Settings', icon: 'settings' }];

  let content;
  if (!signedIn) {
    content = <window.SignIn phone={phone} onSignedIn={(first) => { setSignedIn(true); if (first) setOffer(true); }} />;
  } else if (overlay && overlay.kind === 'runner') {
    content = <window.Runner key={overlay.title + overlay.mode} {...overlay} phone={phone} wide={wide} onExit={() => setOverlay(null)} onFinish={(result) => setOverlay({ kind: 'results', result })} />;
  } else if (overlay && overlay.kind === 'results') {
    content = <window.Results result={overlay.result} phone={phone} wide={wide} onDone={() => setOverlay(null)} onReview={() => { setOverlay(null); nav.openCourse(); setStack('home', [{ name: 'home' }, { name: 'course', course: home }, { name: 'review', course: home }]); }} />;
  } else {
    const body = <Screen key={tab + stack.length + top.name} {...props} {...top} />;
    content = phone ? (
      <div style={{ position: 'relative', height: '100%' }}>{body}<TabBar contained items={tabs} active={tab} onChange={(t) => (t === tab ? setStack(t, stack.slice(0, 1)) : setTab(t))} /></div>
    ) : (
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ height: '100%', boxSizing: 'border-box', paddingTop: device === 'ipad' ? 24 : 0, background: 'var(--bg-sidebar)' }}><Sidebar active={top.name === 'home' || tab !== 'home' ? tab : (stack.find((s) => s.course) || {}).course?.id} onSelect={selectSidebar}
          nav={tabs} semesters={D.semesters.map((s) => ({ ...s, courses: s.courses.map((c) => ({ ...c })) }))}
          footer={<div style={{ padding: '8px 10px', font: 'var(--text-caption)', color: 'var(--text-3)' }}>{admin ? 'Signed in as admin' : 'Synced · just now'}</div>} /></div>
        <div style={{ flex: 1, minWidth: 0, position: 'relative', paddingTop: device === 'ipad' ? 24 : 0, background: 'var(--bg)' }}>{body}</div>
      </div>
    );
  }

  const screen = (
    <div data-theme={theme} style={{ height: '100%', background: 'var(--bg)', color: 'var(--text-1)', position: 'relative', font: 'var(--text-body)', paddingTop: device === 'ipad' && (!signedIn || overlay) ? 24 : 0, boxSizing: 'border-box' }}>
      {content}
      <ConfirmSheet contained centered={wide} open={offer} onDismiss={() => setOffer(false)} title="Save a passkey for this device?" message="Next time, sign in with Face ID instead of your password. You can remove it in Settings."
        actions={[{ label: 'Save a passkey', variant: 'primary', onClick: () => setOffer(false) }, { label: 'Not now', onClick: () => setOffer(false) }]} />
    </div>
  );
  const framed = device === 'iphone' ? <window.IOSDevice dark={theme === 'dark'}>{screen}</window.IOSDevice>
    : device === 'ipad' ? <IPadFrame dark={theme === 'dark'}>{screen}</IPadFrame> : <div data-theme={theme}><MacFrame>{screen}</MacFrame></div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: theme === 'dark' ? '#0c0c0b' : '#E7E3DA' }}>
      <div data-theme={theme} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <SegmentedControl fullWidth={false} value={device} onChange={setDevice} options={[{ value: 'iphone', label: 'iPhone' }, { value: 'ipad', label: 'iPad' }, { value: 'mac', label: 'Mac' }]} />
        <SegmentedControl fullWidth={false} value={theme} onChange={setLook} options={[{ value: 'light', label: 'Light', icon: 'sun' }, { value: 'dark', label: 'Dark', icon: 'moon' }]} />
        <SegmentedControl fullWidth={false} value={palette} onChange={setPalette} options={[{ value: 'pink', label: 'Pink' }, { value: 'ink', label: 'Ink' }, { value: 'earth', label: 'Earth' }, { value: 'dusk', label: 'Dusk' }]} />
        {!admin && signedIn && <button onClick={() => setSignedIn(false)} style={{ border: 'none', background: 'transparent', color: 'var(--text-3)', font: 'var(--text-footnote)', cursor: 'pointer' }}>Show sign in</button>}
      </div>
      <div style={{ width: (frame.w + 28) * scale, height: (frame.h + 28) * scale, display: 'flex', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', padding: 14 }}>{framed}</div>
      </div>
    </div>
  );
}

window.QbankApp = App;
})();
