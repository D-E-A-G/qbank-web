/* @ds-bundle: {"format":4,"namespace":"QbankDesignSystem_4be789","components":[{"name":"AnswerOption","sourcePath":"components/answers/AnswerOption.jsx"},{"name":"ClozeBlank","sourcePath":"components/answers/ClozeBlank.jsx"},{"name":"HighlightPassage","sourcePath":"components/answers/HighlightPassage.jsx"},{"name":"PickerSelect","sourcePath":"components/answers/MatchRow.jsx"},{"name":"MatchRow","sourcePath":"components/answers/MatchRow.jsx"},{"name":"MatrixGrid","sourcePath":"components/answers/MatrixGrid.jsx"},{"name":"OrderingRow","sourcePath":"components/answers/OrderingRow.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"CheckboxBox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ListGroup","sourcePath":"components/core/ListGroup.jsx"},{"name":"ListRow","sourcePath":"components/core/ListGroup.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"SegmentedControl","sourcePath":"components/core/SegmentedControl.jsx"},{"name":"StatusMark","sourcePath":"components/core/StatusMark.jsx"},{"name":"TextField","sourcePath":"components/core/TextField.jsx"},{"name":"ConfirmSheet","sourcePath":"components/feedback/ConfirmSheet.jsx"},{"name":"CountdownTimer","sourcePath":"components/feedback/CountdownTimer.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"FeedbackBanner","sourcePath":"components/feedback/FeedbackBanner.jsx"},{"name":"IssueList","sourcePath":"components/feedback/IssueList.jsx"},{"name":"RationaleBlock","sourcePath":"components/feedback/RationaleBlock.jsx"},{"name":"TermDefinition","sourcePath":"components/feedback/TermDefinition.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"CourseCard","sourcePath":"components/study/CourseCard.jsx"},{"name":"FilterChip","sourcePath":"components/study/FilterChip.jsx"},{"name":"SetRow","sourcePath":"components/study/SetRow.jsx"},{"name":"Tile","sourcePath":"components/study/Tile.jsx"},{"name":"WeekCheckboxRow","sourcePath":"components/study/WeekCheckboxRow.jsx"}],"sourceHashes":{"components/answers/AnswerOption.jsx":"885bf8d73b0c","components/answers/ClozeBlank.jsx":"1aa3f43cdaaa","components/answers/HighlightPassage.jsx":"4ee5abe0f494","components/answers/MatchRow.jsx":"d4cf2063a149","components/answers/MatrixGrid.jsx":"cddedeb04032","components/answers/OrderingRow.jsx":"38d5e3bd335d","components/core/Button.jsx":"bf262329bb2d","components/core/Checkbox.jsx":"59643bf820c8","components/core/Icon.jsx":"07bc826135b2","components/core/ListGroup.jsx":"8b2599251c26","components/core/ProgressBar.jsx":"6c9cc1dd0869","components/core/SegmentedControl.jsx":"ba452bd10dd3","components/core/StatusMark.jsx":"672f20dfecdd","components/core/TextField.jsx":"48cf56455eb3","components/core/press.js":"c63d77f3959d","components/feedback/ConfirmSheet.jsx":"0f856e17c2fb","components/feedback/CountdownTimer.jsx":"75f539da15bb","components/feedback/EmptyState.jsx":"75d2bc089784","components/feedback/FeedbackBanner.jsx":"f26496fac628","components/feedback/IssueList.jsx":"9b388a8172f6","components/feedback/RationaleBlock.jsx":"e82cc9ee682b","components/feedback/TermDefinition.jsx":"6c387d9edf6a","components/navigation/NavBar.jsx":"09a1a2f0a196","components/navigation/Sidebar.jsx":"85295ae8ab7d","components/navigation/TabBar.jsx":"e89775c5a16b","components/study/CourseCard.jsx":"6f2e20a0a2ff","components/study/FilterChip.jsx":"9a5007026ff0","components/study/SetRow.jsx":"1358f9f91fb9","components/study/Tile.jsx":"f09fc23d917a","components/study/WeekCheckboxRow.jsx":"1811a2d0eaa9","ui_kits/qbank-admin/Admin.jsx":"0283a7f6a6da","ui_kits/qbank-app/Question.jsx":"eb312e693d25","ui_kits/qbank-app/Runner.jsx":"7e902fb25a30","ui_kits/qbank-app/Screens.jsx":"f168492045c9","ui_kits/qbank-app/Screens2.jsx":"cfa1c116df58","ui_kits/qbank-app/Shell.jsx":"89abd329e2f0","ui_kits/qbank-app/data.js":"6d70b8226ab9","ui_kits/qbank-app/ios-frame.jsx":"24642b887be3"},"inlinedExternals":[],"unexposedExports":[{"name":"usePress","sourcePath":"components/core/press.js"}]} */

(() => {

const __ds_ns = (window.QbankDesignSystem_4be789 = window.QbankDesignSystem_4be789 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/answers/HighlightPassage.jsx
try { (() => {
// Tap passage segments to highlight them. After reveal: picked+right = highlight + green underline,
// picked+wrong = red strike-through underline, right-but-missed = dashed green underline.
function HighlightPassage({
  segments,
  selected = [],
  onToggle,
  revealed,
  size = 'md'
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: size === 'lg' ? 'var(--text-reading-lg)' : 'var(--text-reading)',
      color: 'var(--text-1)',
      textWrap: 'pretty'
    }
  }, segments.map((seg, i) => {
    if (seg.plain) return /*#__PURE__*/React.createElement("span", {
      key: i
    }, seg.t);
    const picked = selected.includes(i);
    let st = picked ? 'picked' : 'idle';
    if (revealed) st = picked && seg.ok ? 'correct' : picked ? 'wrong' : seg.ok ? 'missed' : 'dim';
    const deco = {
      idle: {
        bg: 'transparent',
        line: '1.5px dotted var(--separator-strong)'
      },
      picked: {
        bg: 'var(--highlight)',
        line: '1.5px solid transparent'
      },
      correct: {
        bg: 'var(--highlight)',
        line: '2px solid var(--correct)'
      },
      wrong: {
        bg: 'var(--wrong-soft)',
        line: '2px solid var(--wrong)',
        strike: true
      },
      missed: {
        bg: 'transparent',
        line: '2px dashed var(--correct)'
      },
      dim: {
        bg: 'transparent',
        line: '1.5px solid transparent'
      }
    }[st];
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      role: revealed ? undefined : 'button',
      "aria-pressed": revealed ? undefined : picked,
      tabIndex: revealed ? undefined : 0,
      onClick: () => !revealed && onToggle && onToggle(i),
      onKeyDown: e => {
        if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          onToggle && onToggle(i);
        }
      },
      style: {
        background: deco.bg,
        color: st === 'picked' || st === 'correct' ? 'var(--highlight-text)' : 'inherit',
        borderBottom: deco.line,
        textDecoration: deco.strike ? 'line-through' : 'none',
        textDecorationColor: 'var(--wrong)',
        borderRadius: 3,
        padding: '2px 1px',
        cursor: revealed ? 'default' : 'pointer',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
        transition: 'background var(--dur-quick)'
      }
    }, seg.t);
  }).reduce((acc, el, i) => i ? [...acc, ' ', el] : [el], []));
}
Object.assign(__ds_scope, { HighlightPassage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/answers/HighlightPassage.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
// Lucide v0.460.0 (ISC) glyphs, copied from lucide-static. Source SVGs live in assets/icons/.
const PATHS = {
  "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  "file-input": "<path d=\"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M2 15h10\" /><path d=\"m9 18 3-3-3-3\" />",
  "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "shield": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />",
  "book-open": "<path d=\"M12 7v14\" /><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />",
  "timer": "<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\" /><line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\" /><circle cx=\"12\" cy=\"14\" r=\"8\" />",
  "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\" /><line x1=\"4\" x2=\"4\" y1=\"22\" y2=\"15\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "x": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
  "minus": "<path d=\"M5 12h14\" />",
  "plus": "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-up": "<path d=\"m18 15-6-6-6 6\" />",
  "circle-alert": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\" /><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\" />",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /><path d=\"M12 9v4\" /><path d=\"M12 17h.01\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />",
  "grip-vertical": "<circle cx=\"9\" cy=\"12\" r=\"1\" /><circle cx=\"9\" cy=\"5\" r=\"1\" /><circle cx=\"9\" cy=\"19\" r=\"1\" /><circle cx=\"15\" cy=\"12\" r=\"1\" /><circle cx=\"15\" cy=\"5\" r=\"1\" /><circle cx=\"15\" cy=\"19\" r=\"1\" />",
  "rotate-ccw": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" /><path d=\"M3 3v5h5\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
  "file-json": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1\" /><path d=\"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1\" />",
  "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"17 8 12 3 7 8\" /><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\" />",
  "clipboard-paste": "<path d=\"M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z\" /><path d=\"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10\" /><path d=\"m17 10 4 4-4 4\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /><path d=\"m21 21-4.3-4.3\" />",
  "key-round": "<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\" /><circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />",
  "scan-face": "<path d=\"M3 7V5a2 2 0 0 1 2-2h2\" /><path d=\"M17 3h2a2 2 0 0 1 2 2v2\" /><path d=\"M21 17v2a2 2 0 0 1-2 2h-2\" /><path d=\"M7 21H5a2 2 0 0 1-2-2v-2\" /><path d=\"M8 14s1.5 2 4 2 4-2 4-2\" /><path d=\"M9 9h.01\" /><path d=\"M15 9h.01\" />",
  "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /><polyline points=\"16 17 21 12 16 7\" /><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />",
  "monitor": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /><line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /><line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" />",
  "panel-left": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /><path d=\"M9 3v18\" />",
  "graduation-cap": "<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\" /><path d=\"M22 10v6\" /><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\" />",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m9 12 2 2 4-4\" />",
  "circle-x": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m15 9-6 6\" /><path d=\"m9 9 6 6\" />",
  "circle-minus": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M8 12h8\" />",
  "shuffle": "<path d=\"M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22\" /><path d=\"m18 2 4 4-4 4\" /><path d=\"M2 6h1.9c1.5 0 2.9.9 3.6 2.2\" /><path d=\"M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8\" /><path d=\"m18 14 4 4-4 4\" />",
  "arrow-right": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />",
  "arrow-left": "<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /><circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "calendar": "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
  "highlighter": "<path d=\"m9 11-6 6v3h9l3-3\" /><path d=\"m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4\" />",
  "wrench": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\" />",
  "archive": "<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\" /><path d=\"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8\" /><path d=\"M10 12h4\" />",
  "archive-restore": "<rect width=\"20\" height=\"5\" x=\"2\" y=\"3\" rx=\"1\" /><path d=\"M4 8v11a2 2 0 0 0 2 2h2\" /><path d=\"M20 8v11a2 2 0 0 1-2 2h-2\" /><path d=\"m9 15 3-3 3 3\" /><path d=\"M12 12v9\" />",
  "trash-2": "<path d=\"M3 6h18\" /><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\" /><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\" /><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\" /><line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\" />",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "list-checks": "<path d=\"m3 17 2 2 4-4\" /><path d=\"m3 7 2 2 4-4\" /><path d=\"M13 6h8\" /><path d=\"M13 12h8\" /><path d=\"M13 18h8\" />",
  "list-ordered": "<path d=\"M10 12h11\" /><path d=\"M10 18h11\" /><path d=\"M10 6h11\" /><path d=\"M4 10h2\" /><path d=\"M4 6h1v4\" /><path d=\"M6 18H4c0-1 2-2 2-3s-1-1.5-2-1\" />",
  "grid-3x3": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /><path d=\"M3 9h18\" /><path d=\"M3 15h18\" /><path d=\"M9 3v18\" /><path d=\"M15 3v18\" />",
  "link-2": "<path d=\"M9 17H7A5 5 0 0 1 7 7h2\" /><path d=\"M15 7h2a5 5 0 1 1 0 10h-2\" /><line x1=\"8\" x2=\"16\" y1=\"12\" y2=\"12\" />",
  "text-cursor-input": "<path d=\"M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1\" /><path d=\"M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5\" /><path d=\"M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1\" /><path d=\"M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7\" /><path d=\"M9 7v10\" />",
  "square-check": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /><path d=\"m9 12 2 2 4-4\" />",
  "layers": "<path d=\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\" /><path d=\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\" /><path d=\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\" />",
  "book-marked": "<path d=\"M10 2v8l3-3 3 3V2\" /><path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20\" />",
  "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"7 10 12 15 17 10\" /><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />",
  "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\" /><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /><path d=\"m15 5 4 4\" />",
  "move": "<path d=\"M12 2v20\" /><path d=\"m15 19-3 3-3-3\" /><path d=\"m19 9 3 3-3 3\" /><path d=\"M2 12h20\" /><path d=\"m5 9-3 3 3 3\" /><path d=\"m9 5 3-3 3 3\" />",
  "inbox": "<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\" /><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\" />",
  "circle": "<circle cx=\"12\" cy=\"12\" r=\"10\" />",
  "list-filter": "<path d=\"M3 6h18\" /><path d=\"M7 12h10\" /><path d=\"M10 18h4\" />",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><polyline points=\"12 6 12 12 16 14\" />"
};
const ICON_NAMES = Object.keys(PATHS);
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = 'currentColor',
  label,
  style,
  ...rest
}) {
  const inner = PATHS[name];
  if (!inner) return null;
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    role: label ? 'img' : undefined,
    'aria-label': label,
    'aria-hidden': label ? undefined : true,
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    },
    ...rest
  });
}
Object.assign(__ds_scope, { ICON_NAMES, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/answers/MatchRow.jsx
try { (() => {
// Shared native picker button — native <select> gives the iOS wheel/menu for free.
function PickerSelect({
  options,
  value,
  onChange,
  placeholder = 'Choose',
  state = 'idle',
  inline,
  disabled
}) {
  const c = state === 'correct' ? 'var(--correct)' : state === 'wrong' ? 'var(--wrong)' : value != null && value !== -1 ? 'var(--tint)' : 'var(--separator-strong)';
  const bg = state === 'correct' ? 'var(--correct-soft)' : state === 'wrong' ? 'var(--wrong-soft)' : value != null && value !== -1 ? 'var(--tint-soft)' : 'var(--surface-raised)';
  const revealed = state === 'correct' || state === 'wrong';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: inline ? 'inline-flex' : 'flex',
      alignItems: 'center',
      verticalAlign: 'baseline',
      maxWidth: '100%'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value == null ? -1 : value,
    disabled: disabled || revealed,
    onChange: e => onChange && onChange(Number(e.target.value)),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: inline ? 'auto' : '100%',
      maxWidth: '100%',
      minHeight: inline ? 34 : 44,
      padding: inline ? '4px 30px 4px 10px' : '0 36px 0 14px',
      boxSizing: 'border-box',
      borderRadius: 8,
      cursor: revealed ? 'default' : 'pointer',
      border: 'none',
      boxShadow: `inset 0 0 0 1.5px ${c}`,
      background: bg,
      color: value == null || value === -1 ? 'var(--text-3)' : 'var(--text-1)',
      font: inline ? 'var(--weight-medium) var(--size-callout)/var(--lh-callout) var(--font-ui)' : 'var(--text-body)',
      opacity: 1
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: -1,
    disabled: true
  }, placeholder), options.map((o, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: i
  }, o))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: inline ? 8 : 12,
      pointerEvents: 'none',
      display: 'flex',
      color: state === 'idle' ? 'var(--text-3)' : c
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: state === 'correct' ? 'circle-check' : state === 'wrong' ? 'circle-x' : 'chevron-down',
    size: 16,
    strokeWidth: 2
  })));
}

// Matching: pair a left item with a right choice.
function MatchRow({
  left,
  options,
  value,
  onChange,
  state = 'idle',
  correctText
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 14,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface)',
      boxShadow: 'inset 0 0 0 1px var(--separator)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-headline)',
      color: 'var(--text-1)',
      textWrap: 'pretty'
    }
  }, left), /*#__PURE__*/React.createElement(PickerSelect, {
    options: options,
    value: value,
    onChange: onChange,
    state: state,
    placeholder: "Choose a match"
  }), state === 'wrong' && correctText && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-footnote)',
      color: 'var(--text-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--correct)',
      fontWeight: 600
    }
  }, "Correct match:"), " ", correctText));
}
Object.assign(__ds_scope, { PickerSelect, MatchRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/answers/MatchRow.jsx", error: String((e && e.message) || e) }); }

// components/answers/ClozeBlank.jsx
try { (() => {
// Drop-down cloze: a template with {0}, {1}… placeholders, each rendered as an inline picker.
function ClozeBlank({
  template,
  blanks,
  value = {},
  onChange,
  revealed,
  size = 'md'
}) {
  const parts = template.split(/(\{\d+\})/g);
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: size === 'lg' ? 'var(--text-reading-lg)' : 'var(--text-reading)',
      color: 'var(--text-1)',
      lineHeight: size === 'lg' ? '44px' : '42px',
      textWrap: 'pretty'
    }
  }, parts.map((p, i) => {
    const m = p.match(/^\{(\d+)\}$/);
    if (!m) return /*#__PURE__*/React.createElement("span", {
      key: i
    }, p);
    const b = Number(m[1]);
    const blank = blanks[b];
    const v = value[b];
    const state = !revealed ? 'idle' : v === blank.ans ? 'correct' : 'wrong';
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        verticalAlign: 'middle',
        margin: '0 2px'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.PickerSelect, {
      inline: true,
      options: blank.opts,
      value: v,
      state: state,
      onChange: n => onChange && onChange({
        ...value,
        [b]: n
      }),
      placeholder: "Select"
    }), state === 'wrong' && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)',
        color: 'var(--correct)',
        padding: '2px 2px 0'
      }
    }, "Correct: ", blank.opts[blank.ans]));
  }));
}
Object.assign(__ds_scope, { ClozeBlank });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/answers/ClozeBlank.jsx", error: String((e && e.message) || e) }); }

// components/answers/OrderingRow.jsx
try { (() => {
// One draggable/movable item in an Ordering question. Up/down buttons are the
// reliable path on touch; drag is a bonus on pointer devices.
function OrderingRow({
  position,
  text,
  state = 'idle',
  correctPosition,
  onMoveUp,
  onMoveDown,
  dragging
}) {
  const revealed = state === 'correct' || state === 'wrong';
  const c = state === 'correct' ? 'var(--correct)' : state === 'wrong' ? 'var(--wrong)' : null;
  const arrowBtn = (name, fn, label) => /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    onClick: fn,
    disabled: !fn,
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      borderRadius: 8,
      background: 'var(--surface-sunken)',
      color: fn ? 'var(--text-2)' : 'var(--text-4)',
      cursor: fn ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: 18,
    strokeWidth: 2
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 10px 10px 12px',
      boxSizing: 'border-box',
      borderRadius: 'var(--radius-sm)',
      background: state === 'correct' ? 'var(--correct-soft)' : state === 'wrong' ? 'var(--wrong-soft)' : 'var(--surface-raised)',
      boxShadow: dragging ? 'var(--shadow-popover), inset 0 0 0 1.5px var(--tint)' : `inset 0 0 0 ${c ? 1.5 : 1}px ${c || 'var(--separator-strong)'}`,
      transform: dragging ? 'scale(1.02)' : 'none',
      transition: 'transform var(--dur-quick), box-shadow var(--dur-quick)'
    }
  }, !revealed && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "grip-vertical",
    size: 18,
    color: "var(--text-4)",
    style: {
      cursor: 'grab'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      flexShrink: 0,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: c || 'var(--surface-sunken)',
      color: c ? 'var(--text-on-tint)' : 'var(--text-2)',
      font: 'var(--weight-semibold) var(--size-footnote)/1 var(--font-mono)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, position), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--text-1)',
      textWrap: 'pretty'
    }
  }, text), state === 'wrong' && correctPosition != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)',
      color: 'var(--wrong)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-x",
    size: 14,
    strokeWidth: 2
  }), "Belongs at ", correctPosition), state === 'correct' && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)',
      color: 'var(--correct)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-check",
    size: 14,
    strokeWidth: 2
  }), "Right position")), !revealed && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, arrowBtn('chevron-up', onMoveUp, 'Move up'), arrowBtn('chevron-down', onMoveDown, 'Move down')));
}
Object.assign(__ds_scope, { OrderingRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/answers/OrderingRow.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
// Standalone check glyph box; also used inside WeekCheckboxRow and AnswerOption.
function CheckboxBox({
  checked,
  shape = 'square',
  tone = 'tint',
  size = 22
}) {
  const color = tone === 'guess' ? 'var(--guess)' : 'var(--tint)';
  const round = shape === 'circle';
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: size,
      height: size,
      flexShrink: 0,
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: round ? '50%' : 'var(--radius-xs)',
      border: checked ? 'none' : '1.5px solid var(--separator-strong)',
      background: checked ? color : 'var(--surface-raised)',
      color: 'var(--text-on-tint)',
      transition: 'background var(--dur-quick)'
    }
  }, checked && (round ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: size * 0.4,
      height: size * 0.4,
      borderRadius: '50%',
      background: 'var(--text-on-tint)'
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: size * 0.72,
    strokeWidth: 3
  })));
}
function Checkbox({
  checked,
  onChange,
  label,
  detail,
  tone = 'tint',
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      minHeight: 44,
      padding: '11px 0',
      boxSizing: 'border-box',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement(CheckboxBox, {
    checked: checked,
    tone: tone
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      paddingTop: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--text-1)'
    }
  }, label), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-footnote)',
      color: 'var(--text-3)'
    }
  }, detail)));
}
Object.assign(__ds_scope, { CheckboxBox, Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/answers/MatrixGrid.jsx
try { (() => {
// Matrix: pick one column per row. layout "stacked" (iPhone) or "table" (iPad/Mac).
function MatrixGrid({
  columns,
  rows,
  value = {},
  onChange,
  revealed,
  layout = 'stacked'
}) {
  const cellState = (r, ci) => {
    const picked = value[r] === ci;
    if (!revealed) return picked ? 'selected' : 'idle';
    const ans = rows[r].ans;
    if (picked && ci === ans) return 'correct';
    if (picked) return 'wrong';
    if (ci === ans) return 'missed';
    return 'dim';
  };
  const mark = st => st === 'correct' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-check",
    size: 22,
    color: "var(--correct)",
    strokeWidth: 2
  }) : st === 'wrong' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-x",
    size: 22,
    color: "var(--wrong)",
    strokeWidth: 2
  }) : st === 'missed' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-check",
    size: 22,
    color: "var(--correct)",
    strokeWidth: 1.5,
    style: {
      opacity: 0.7
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.CheckboxBox, {
    checked: st === 'selected',
    shape: "circle"
  });
  const pick = (r, ci) => !revealed && onChange && onChange({
    ...value,
    [r]: ci
  });
  if (layout === 'table') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'inset 0 0 0 1px var(--separator)',
        overflow: 'hidden',
        background: 'var(--surface)'
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '10px 14px',
        font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
        color: 'var(--text-3)',
        background: 'var(--surface-sunken)'
      }
    }), columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
      key: i,
      style: {
        padding: '10px 8px',
        font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
        color: 'var(--text-2)',
        background: 'var(--surface-sunken)',
        textAlign: 'center'
      }
    }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, r) => /*#__PURE__*/React.createElement("tr", {
      key: r,
      style: {
        borderTop: '0.5px solid var(--separator)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '12px 14px',
        font: 'var(--text-body)',
        color: 'var(--text-1)'
      }
    }, row.label), columns.map((c, ci) => {
      const st = cellState(r, ci);
      return /*#__PURE__*/React.createElement("td", {
        key: ci,
        onClick: () => pick(r, ci),
        style: {
          textAlign: 'center',
          cursor: revealed ? 'default' : 'pointer',
          background: st === 'correct' ? 'var(--correct-soft)' : st === 'wrong' ? 'var(--wrong-soft)' : 'transparent'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          minWidth: 44,
          minHeight: 44,
          alignItems: 'center',
          justifyContent: 'center'
        },
        "aria-label": `${row.label}: ${c}`
      }, mark(st)));
    }))))));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, rows.map((row, r) => /*#__PURE__*/React.createElement("div", {
    key: r,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 14,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface)',
      boxShadow: 'inset 0 0 0 1px var(--separator)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--text-1)',
      textWrap: 'pretty'
    }
  }, row.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, columns.map((c, ci) => {
    const st = cellState(r, ci);
    const border = st === 'selected' ? 'var(--tint)' : st === 'correct' || st === 'missed' ? 'var(--correct)' : st === 'wrong' ? 'var(--wrong)' : 'var(--separator-strong)';
    return /*#__PURE__*/React.createElement("button", {
      key: ci,
      onClick: () => pick(r, ci),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 40,
        padding: '0 12px 0 8px',
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        cursor: revealed ? 'default' : 'pointer',
        background: st === 'selected' ? 'var(--tint-soft)' : st === 'correct' ? 'var(--correct-soft)' : st === 'wrong' ? 'var(--wrong-soft)' : 'var(--surface-raised)',
        boxShadow: `inset 0 0 0 ${st === 'idle' || st === 'dim' ? 1 : 1.5}px ${border}`,
        outline: st === 'missed' ? '1.5px dashed var(--correct)' : 'none',
        outlineOffset: -1.5,
        color: st === 'dim' ? 'var(--text-3)' : 'var(--text-1)',
        font: 'var(--weight-medium) var(--size-subhead)/var(--lh-subhead) var(--font-ui)'
      }
    }, mark(st), c);
  })))));
}
Object.assign(__ds_scope, { MatrixGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/answers/MatrixGrid.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
const TONES = {
  tint: 'var(--progress-fill)',
  correct: 'var(--correct)',
  partial: 'var(--partial)',
  wrong: 'var(--wrong)',
  neutral: 'var(--text-3)'
};
function ProgressBar({
  value = 0,
  tone = 'tint',
  height = 4,
  label,
  style
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": Math.round(pct),
    "aria-label": label,
    style: {
      height,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--progress-track)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      borderRadius: 'var(--radius-pill)',
      background: TONES[tone] || TONES.tint,
      transition: 'width var(--dur-standard) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/SegmentedControl.jsx
try { (() => {
function SegmentedControl({
  options,
  value,
  onChange,
  fullWidth = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      padding: 2,
      gap: 2,
      borderRadius: 9,
      background: 'var(--surface-sunken)',
      boxShadow: 'inset 0 0 0 0.5px var(--separator)',
      ...style
    }
  }, options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    const on = opt.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: opt.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(opt.value),
      style: {
        flex: fullWidth ? 1 : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 32,
        padding: '0 14px',
        border: 'none',
        borderRadius: 7,
        cursor: 'pointer',
        background: on ? 'var(--surface-raised)' : 'transparent',
        color: on ? 'var(--text-1)' : 'var(--text-2)',
        boxShadow: on ? 'var(--shadow-raised)' : 'none',
        font: `${on ? 'var(--weight-semibold)' : 'var(--weight-medium)'} var(--size-subhead)/var(--lh-subhead) var(--font-ui)`,
        transition: 'background var(--dur-quick), color var(--dur-quick)'
      }
    }, opt.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: opt.icon,
      size: 16
    }), opt.label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusMark.jsx
try { (() => {
const STATES = {
  correct: {
    icon: 'circle-check',
    color: 'var(--correct)',
    soft: 'var(--correct-soft)',
    word: 'Correct'
  },
  partial: {
    icon: 'circle-minus',
    color: 'var(--partial)',
    soft: 'var(--partial-soft)',
    word: 'Partly right'
  },
  wrong: {
    icon: 'circle-x',
    color: 'var(--wrong)',
    soft: 'var(--wrong-soft)',
    word: 'Missed'
  },
  guessed: {
    icon: 'flag',
    color: 'var(--guess)',
    soft: 'var(--guess-soft)',
    word: 'Guessed'
  },
  unanswered: {
    icon: 'circle',
    color: 'var(--text-3)',
    soft: 'var(--surface-sunken)',
    word: 'Not answered'
  }
};

// Icon + word: the non-color-dependent way to show an answer status anywhere.
function StatusMark({
  status = 'correct',
  label,
  showLabel = true,
  variant = 'plain',
  size = 'md'
}) {
  const s = STATES[status] || STATES.correct;
  const sm = size === 'sm';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: sm ? 4 : 6,
      color: s.color,
      whiteSpace: 'nowrap',
      padding: variant === 'pill' ? sm ? '2px 8px 2px 6px' : '4px 10px 4px 8px' : 0,
      background: variant === 'pill' ? s.soft : 'transparent',
      borderRadius: 'var(--radius-pill)',
      font: `var(--weight-semibold) ${sm ? 'var(--size-caption-1)/var(--lh-caption-1)' : 'var(--size-footnote)/var(--lh-footnote)'} var(--font-ui)`
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: sm ? 14 : 16,
    strokeWidth: 2
  }), showLabel && (label || s.word));
}
Object.assign(__ds_scope, { StatusMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusMark.jsx", error: String((e && e.message) || e) }); }

// components/core/TextField.jsx
try { (() => {
function TextField({
  label,
  value,
  defaultValue,
  placeholder,
  type = 'text',
  multiline,
  rows = 6,
  mono,
  hint,
  error,
  disabled,
  onChange,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const border = error ? 'var(--wrong)' : focus ? 'var(--tint)' : 'var(--separator-strong)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
      color: 'var(--text-2)'
    }
  }, label), /*#__PURE__*/React.createElement(Tag, {
    type: multiline ? undefined : type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    rows: multiline ? rows : undefined,
    disabled: disabled,
    onChange: onChange ? e => onChange(e.target.value, e) : undefined,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      boxSizing: 'border-box',
      width: '100%',
      minHeight: 44,
      padding: multiline ? '12px 14px' : '0 14px',
      height: multiline ? undefined : 44,
      resize: multiline ? 'vertical' : undefined,
      background: 'var(--surface-raised)',
      color: 'var(--text-1)',
      borderRadius: 'var(--radius-sm)',
      border: `1px solid ${border}`,
      boxShadow: focus ? '0 0 0 3px var(--tint-soft-border)' : 'none',
      outline: 'none',
      font: mono ? 'var(--text-mono)' : 'var(--text-body)',
      transition: 'border-color var(--dur-quick), box-shadow var(--dur-quick)',
      opacity: disabled ? 0.5 : 1
    }
  }), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-footnote)',
      color: error ? 'var(--wrong)' : 'var(--text-3)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TextField.jsx", error: String((e && e.message) || e) }); }

// components/core/press.js
try { (() => {
// Tiny pressed-state hook shared by tappable components (no CSS needed).
function usePress(disabled) {
  const [pressed, setPressed] = React.useState(false);
  if (disabled) return [false, {}];
  return [pressed, {
    onPointerDown: () => setPressed(true),
    onPointerUp: () => setPressed(false),
    onPointerLeave: () => setPressed(false),
    onPointerCancel: () => setPressed(false)
  }];
}
Object.assign(__ds_scope, { usePress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/press.js", error: String((e && e.message) || e) }); }

// components/answers/AnswerOption.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// state: idle | selected | correct (picked, right) | wrong (picked, wrong) | missed (right, not picked) | dim (not picked, not right; after check)
const LOOK = {
  idle: {
    bg: 'var(--surface)',
    border: 'var(--separator-strong)',
    width: 1,
    style: 'solid'
  },
  selected: {
    bg: 'var(--tint-soft)',
    border: 'var(--tint)',
    width: 1.5,
    style: 'solid'
  },
  correct: {
    bg: 'var(--correct-soft)',
    border: 'var(--correct)',
    width: 1.5,
    style: 'solid',
    icon: 'circle-check',
    color: 'var(--correct)',
    tag: 'Your answer · Correct'
  },
  wrong: {
    bg: 'var(--wrong-soft)',
    border: 'var(--wrong)',
    width: 1.5,
    style: 'solid',
    icon: 'circle-x',
    color: 'var(--wrong)',
    tag: 'Your answer · Not correct'
  },
  missed: {
    bg: 'var(--surface)',
    border: 'var(--correct)',
    width: 1.5,
    style: 'dashed',
    icon: 'circle-check',
    color: 'var(--correct)',
    tag: 'Correct answer · Missed'
  },
  dim: {
    bg: 'var(--surface)',
    border: 'var(--separator)',
    width: 1,
    style: 'solid'
  }
};
function AnswerOption({
  text,
  control = 'radio',
  state = 'idle',
  reason,
  onClick,
  disabled
}) {
  const l = LOOK[state] || LOOK.idle;
  const revealed = ['correct', 'wrong', 'missed', 'dim'].includes(state);
  const interactive = !revealed && !disabled && onClick;
  const [pressed, ph] = __ds_scope.usePress(!interactive);
  const picked = state === 'selected' || state === 'correct' || state === 'wrong';
  return /*#__PURE__*/React.createElement("div", _extends({
    role: interactive ? control === 'radio' ? 'radio' : 'checkbox' : undefined,
    "aria-checked": interactive ? picked : undefined,
    tabIndex: interactive ? 0 : undefined,
    onClick: interactive ? onClick : undefined,
    onKeyDown: interactive ? e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onClick();
      }
    } : undefined
  }, ph, {
    style: {
      display: 'flex',
      gap: 12,
      padding: '14px 16px',
      boxSizing: 'border-box',
      borderRadius: 'var(--radius-sm)',
      background: pressed ? 'var(--surface-pressed)' : l.bg,
      boxShadow: `inset 0 0 0 ${l.width}px ${l.border}`,
      outline: l.style === 'dashed' ? `1.5px dashed ${l.border}` : 'none',
      outlineOffset: -1.5,
      cursor: interactive ? 'pointer' : 'default',
      transition: 'background var(--dur-quick), box-shadow var(--dur-quick)',
      ...(l.style === 'dashed' ? {
        boxShadow: 'none'
      } : null)
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingTop: 1
    }
  }, l.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: l.icon,
    size: 22,
    color: l.color,
    strokeWidth: 2
  }) : /*#__PURE__*/React.createElement(__ds_scope.CheckboxBox, {
    checked: picked,
    shape: control === 'radio' ? 'circle' : 'square'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: state === 'dim' ? 'var(--text-2)' : 'var(--text-1)',
      textWrap: 'pretty'
    }
  }, text), l.tag && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)',
      color: l.color,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)'
    }
  }, l.tag), revealed && reason && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-reading-sm)',
      color: 'var(--text-2)',
      textWrap: 'pretty'
    }
  }, reason)));
}
Object.assign(__ds_scope, { AnswerOption });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/answers/AnswerOption.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  lg: {
    height: 50,
    padding: '0 20px',
    font: 'var(--text-headline)',
    icon: 20,
    radius: 'var(--radius-sm)'
  },
  md: {
    height: 44,
    padding: '0 16px',
    font: 'var(--weight-semibold) var(--size-callout)/var(--lh-callout) var(--font-ui)',
    icon: 18,
    radius: 'var(--radius-sm)'
  },
  sm: {
    height: 32,
    padding: '0 12px',
    font: 'var(--weight-semibold) var(--size-subhead)/var(--lh-subhead) var(--font-ui)',
    icon: 16,
    radius: '8px'
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--tint)',
    fg: 'var(--text-on-tint)',
    pressedBg: 'var(--tint-pressed)'
  },
  secondary: {
    bg: 'var(--tint-soft)',
    fg: 'var(--tint)',
    pressedBg: 'var(--tint-soft-border)'
  },
  quiet: {
    bg: 'var(--surface-sunken)',
    fg: 'var(--text-1)',
    pressedBg: 'var(--surface-pressed)'
  },
  plain: {
    bg: 'transparent',
    fg: 'var(--tint)',
    pressedBg: 'var(--surface-sunken)'
  },
  destructive: {
    bg: 'var(--wrong-soft)',
    fg: 'var(--wrong)',
    pressedBg: 'var(--wrong-border)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  disabled,
  iconOnly,
  label,
  onClick,
  children,
  style,
  type = 'button'
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [pressed, pressHandlers] = __ds_scope.usePress(disabled);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    "aria-label": iconOnly ? label : undefined
  }, pressHandlers, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.height,
      minWidth: iconOnly ? s.height : undefined,
      padding: iconOnly ? 0 : s.padding,
      width: fullWidth ? '100%' : undefined,
      boxSizing: 'border-box',
      border: 'none',
      borderRadius: iconOnly && variant === 'plain' ? 'var(--radius-pill)' : s.radius,
      background: pressed ? v.pressedBg : v.bg,
      color: v.fg,
      font: s.font,
      opacity: disabled ? 0.4 : 1,
      cursor: disabled ? 'default' : 'pointer',
      transition: 'background var(--dur-instant) var(--ease-standard), transform var(--dur-instant) var(--ease-standard)',
      transform: pressed ? 'scale(0.98)' : 'none',
      whiteSpace: 'nowrap',
      ...style
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon,
    strokeWidth: 2
  }), !iconOnly && children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon,
    strokeWidth: 2
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/ListGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ListGroup({
  header,
  footer,
  children,
  inset = true,
  style
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, header && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      padding: inset ? '0 16px' : 0,
      font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)'
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)',
      overflow: 'hidden'
    }
  }, items.map((child, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'relative'
    }
  }, child, i < items.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      right: 0,
      bottom: 0,
      height: 0.5,
      background: 'var(--separator)'
    }
  })))), footer && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: inset ? '0 16px' : 0,
      font: 'var(--text-footnote)',
      color: 'var(--text-3)',
      textWrap: 'pretty'
    }
  }, footer));
}
function ListRow({
  icon,
  title,
  detail,
  value,
  chevron,
  destructive,
  selected,
  accessory,
  onClick,
  disabled
}) {
  const [pressed, ph] = __ds_scope.usePress(disabled || !onClick);
  const Tag = onClick ? 'button' : 'div';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    onClick: disabled ? undefined : onClick
  }, ph, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      minHeight: 44,
      padding: '11px 16px',
      boxSizing: 'border-box',
      border: 'none',
      textAlign: 'left',
      cursor: onClick && !disabled ? 'pointer' : 'default',
      background: pressed ? 'var(--surface-pressed)' : selected ? 'var(--tint-soft)' : 'transparent',
      color: destructive ? 'var(--wrong)' : 'var(--text-1)',
      opacity: disabled ? 0.4 : 1,
      transition: 'background var(--dur-instant)'
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20,
    color: destructive ? 'var(--wrong)' : 'var(--tint)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)'
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-footnote)',
      color: 'var(--text-3)'
    }
  }, detail)), value && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--text-3)'
    }
  }, value), accessory, chevron && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-4)",
    strokeWidth: 2
  }));
}
Object.assign(__ds_scope, { ListGroup, ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ListGroup.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ConfirmSheet.jsx
try { (() => {
// Bottom sheet on iPhone; centered dialog when `centered` (iPad/Mac). The last action is the safe one (Cancel).
function ConfirmSheet({
  open = true,
  title,
  message,
  actions = [],
  centered,
  contained,
  onDismiss
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onDismiss,
    style: {
      position: contained ? 'absolute' : 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'var(--overlay)',
      display: 'flex',
      alignItems: centered ? 'center' : 'flex-end',
      justifyContent: 'center',
      padding: centered ? 24 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "alertdialog",
    "aria-modal": "true",
    "aria-label": title,
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: centered ? 400 : 'none',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      padding: centered ? 24 : '12px 20px calc(20px + env(safe-area-inset-bottom))',
      background: 'var(--surface-raised)',
      borderRadius: centered ? 'var(--radius-lg)' : 'var(--radius-lg) var(--radius-lg) 0 0',
      boxShadow: centered ? 'var(--shadow-popover)' : 'var(--shadow-sheet)'
    }
  }, !centered && /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'center',
      width: 36,
      height: 5,
      borderRadius: 3,
      background: 'var(--separator-strong)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--text-title-3)',
      color: 'var(--text-1)',
      textWrap: 'pretty'
    }
  }, title), message && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--text-callout)',
      color: 'var(--text-2)',
      textWrap: 'pretty'
    }
  }, message)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, actions.map((a, i) => /*#__PURE__*/React.createElement(__ds_scope.Button, {
    key: i,
    size: "lg",
    fullWidth: true,
    variant: a.variant || 'quiet',
    onClick: a.onClick
  }, a.label)))));
}
Object.assign(__ds_scope, { ConfirmSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ConfirmSheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/CountdownTimer.jsx
try { (() => {
const fmt = s => {
  const m = Math.floor(Math.max(0, s) / 60);
  const r = Math.max(0, s) % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
};

// Low-time state: turns red, gains a filled background AND the word "left", so it doesn't rely on color.
function CountdownTimer({
  seconds,
  lowAt = 300,
  compact
}) {
  const low = seconds <= lowAt;
  return /*#__PURE__*/React.createElement("span", {
    role: "timer",
    "aria-live": low ? 'polite' : 'off',
    "aria-label": `${fmt(seconds)} left`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 30,
      padding: '0 10px 0 8px',
      borderRadius: 'var(--radius-pill)',
      background: low ? 'var(--timer-low-soft)' : 'var(--surface-sunken)',
      color: low ? 'var(--timer-low)' : 'var(--timer-normal)',
      boxShadow: low ? 'inset 0 0 0 1px var(--wrong-border)' : 'none',
      font: 'var(--weight-semibold) var(--size-subhead)/1 var(--font-ui)',
      fontVariantNumeric: 'tabular-nums',
      transition: 'background var(--dur-standard), color var(--dur-standard)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: low ? 'triangle-alert' : 'timer',
    size: 16,
    strokeWidth: 2
  }), fmt(seconds), (low || !compact) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "left"));
}
Object.assign(__ds_scope, { CountdownTimer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/CountdownTimer.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function EmptyState({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  actionIcon,
  onAction,
  compact
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: compact ? 8 : 12,
      padding: compact ? '20px 16px' : '40px 24px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: compact ? 40 : 56,
      height: compact ? 40 : 56,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-sunken)',
      color: 'var(--text-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: compact ? 20 : 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      maxWidth: 320
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-headline)',
      color: 'var(--text-1)'
    }
  }, title), message && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-subhead)',
      color: 'var(--text-2)',
      textWrap: 'pretty'
    }
  }, message)), actionLabel && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "md",
    icon: actionIcon,
    onClick: onAction
  }, actionLabel));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/FeedbackBanner.jsx
try { (() => {
const KIND = {
  correct: {
    icon: 'circle-check',
    title: 'Correct',
    fg: 'var(--correct)',
    bg: 'var(--correct-soft)',
    border: 'var(--correct-border)'
  },
  partial: {
    icon: 'circle-minus',
    title: 'Partly correct',
    fg: 'var(--partial)',
    bg: 'var(--partial-soft)',
    border: 'var(--partial-border)'
  },
  wrong: {
    icon: 'circle-x',
    title: 'Not correct',
    fg: 'var(--wrong)',
    bg: 'var(--wrong-soft)',
    border: 'var(--wrong-border)'
  }
};
function FeedbackBanner({
  status = 'correct',
  points,
  max,
  rule,
  guessed
}) {
  const k = KIND[status] || KIND.correct;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      gap: 12,
      padding: '14px 16px',
      borderRadius: 'var(--radius-md)',
      background: k.bg,
      boxShadow: `inset 0 0 0 1px ${k.border}`
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: k.icon,
    size: 26,
    color: k.fg,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) var(--size-title-3)/var(--lh-title-3) var(--font-display)',
      color: k.fg
    }
  }, k.title), max > 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      whiteSpace: 'nowrap',
      font: 'var(--weight-semibold) var(--size-subhead)/var(--lh-subhead) var(--font-ui)',
      color: 'var(--text-1)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, points, " of ", max, " points")), rule && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-footnote)',
      color: 'var(--text-2)',
      textWrap: 'pretty'
    }
  }, rule), guessed && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
      font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
      color: 'var(--guess)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "flag",
    size: 14,
    strokeWidth: 2
  }), "Flagged as a guess \u2014 it stays in Review")));
}
Object.assign(__ds_scope, { FeedbackBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/FeedbackBanner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/IssueList.jsx
try { (() => {
// Import-check results. kind: error (blocks import) | warning (imports anyway).
function IssueList({
  kind = 'error',
  items = [],
  onCopy,
  copied
}) {
  const err = kind === 'error';
  const fg = err ? 'var(--wrong)' : 'var(--partial)';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 16,
      borderRadius: 'var(--radius-md)',
      background: err ? 'var(--wrong-soft)' : 'var(--partial-soft)',
      boxShadow: `inset 0 0 0 1px ${err ? 'var(--wrong-border)' : 'var(--partial-border)'}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: err ? 'circle-alert' : 'triangle-alert',
    size: 20,
    color: fg,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      font: 'var(--text-headline)',
      color: 'var(--text-1)'
    }
  }, items.length, " ", err ? items.length === 1 ? 'error' : 'errors' : items.length === 1 ? 'warning' : 'warnings', /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--text-2)'
    }
  }, err ? ' — fix these and check again' : ' — these import anyway'))), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, items.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      font: 'var(--text-mono)',
      color: 'var(--text-1)',
      wordBreak: 'break-word'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: fg
    }
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, t)))), err && onCopy && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "quiet",
    size: "sm",
    icon: copied ? 'check' : 'copy',
    onClick: onCopy,
    style: {
      alignSelf: 'flex-start',
      background: 'var(--surface-raised)'
    }
  }, copied ? 'Copied' : 'Copy these for your Firstmate'));
}
Object.assign(__ds_scope, { IssueList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/IssueList.jsx", error: String((e && e.message) || e) }); }

// components/feedback/RationaleBlock.jsx
try { (() => {
// variant: rationale (why) | takeaway (the one thing to remember)
function RationaleBlock({
  variant = 'rationale',
  title,
  children
}) {
  const take = variant === 'takeaway';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: take ? '14px 16px' : 0,
      borderRadius: take ? 'var(--radius-md)' : 0,
      background: take ? 'var(--tint-soft)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
      color: take ? 'var(--tint)' : 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)'
    }
  }, take && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "book-marked",
    size: 15,
    strokeWidth: 2
  }), title || (take ? 'Key takeaway' : 'Rationale')), /*#__PURE__*/React.createElement("div", {
    style: {
      font: take ? 'var(--weight-semibold) var(--size-reading)/var(--lh-reading) var(--font-reading)' : 'var(--text-reading)',
      color: 'var(--text-1)',
      textWrap: 'pretty'
    }
  }, children));
}
Object.assign(__ds_scope, { RationaleBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/RationaleBlock.jsx", error: String((e && e.message) || e) }); }

// components/feedback/TermDefinition.jsx
try { (() => {
function TermDefinition({
  term,
  meaning,
  source,
  divider = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      padding: '12px 0',
      borderBottom: divider ? '0.5px solid var(--separator)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--size-reading-sm)/var(--lh-reading-sm) var(--font-reading)',
      color: 'var(--text-1)'
    }
  }, term), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-reading-sm)',
      color: 'var(--text-2)',
      textWrap: 'pretty'
    }
  }, meaning), source && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-3)',
      marginTop: 2
    }
  }, source));
}
Object.assign(__ds_scope, { TermDefinition });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/TermDefinition.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
// Top bar. `large` adds an iOS large title below the bar row.
function NavBar({
  title,
  large,
  backLabel,
  onBack,
  leading,
  trailing,
  subtitle,
  sticky = true
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: sticky ? 'sticky' : 'relative',
      top: 0,
      zIndex: 10,
      background: 'var(--material)',
      backdropFilter: 'var(--blur-material)',
      WebkitBackdropFilter: 'var(--blur-material)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--navbar-height)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minWidth: 0
    }
  }, onBack ? /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      height: 44,
      padding: '0 8px 0 0',
      border: 'none',
      background: 'transparent',
      color: 'var(--tint)',
      cursor: 'pointer',
      font: 'var(--text-body)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-left",
    size: 26,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, backLabel || 'Back')) : leading), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      minWidth: 0
    }
  }, !large && title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-headline)',
      color: 'var(--text-1)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), !large && subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-caption)',
      color: 'var(--text-3)'
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 4
    }
  }, trailing)), large && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '2px 16px 10px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--text-large-title)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-1)',
      textWrap: 'balance'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--text-subhead)',
      color: 'var(--text-2)',
      marginTop: 2
    }
  }, subtitle)));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SideItem({
  icon,
  label,
  caption,
  badge,
  active,
  onClick,
  indent
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    "aria-current": active ? 'page' : undefined,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      minHeight: 36,
      padding: indent ? '6px 10px 6px 12px' : '6px 10px',
      boxSizing: 'border-box',
      border: 'none',
      borderRadius: 8,
      textAlign: 'left',
      cursor: 'pointer',
      background: active ? 'var(--tint)' : hover ? 'var(--surface-pressed)' : 'transparent',
      color: active ? 'var(--text-on-tint)' : 'var(--text-1)'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    color: active ? 'currentColor' : 'var(--tint)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, caption && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--size-caption-2)/var(--lh-caption-2) var(--font-mono)',
      color: active ? 'currentColor' : 'var(--text-3)',
      opacity: active ? 0.8 : 1,
      letterSpacing: '0.02em'
    }
  }, caption), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--size-subhead)/var(--lh-subhead) var(--font-ui)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, label)), badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--size-footnote)/1 var(--font-mono)',
      color: active ? 'currentColor' : 'var(--text-3)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, badge));
}

// iPad/Mac sidebar: top-level nav, then the semester → course tree.
function Sidebar({
  title = 'Qbank',
  nav = [],
  semesters = [],
  active,
  onSelect,
  footer,
  width
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: width || 'var(--sidebar-width)',
      flexShrink: 0,
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '16px 12px',
      background: 'var(--bg-sidebar)',
      borderRight: '0.5px solid var(--separator-strong)',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 10px 0',
      font: 'var(--text-title-3)',
      color: 'var(--text-1)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, nav.map(n => /*#__PURE__*/React.createElement(SideItem, _extends({
    key: n.id
  }, n, {
    active: active === n.id,
    onClick: () => onSelect && onSelect(n.id)
  })))), semesters.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 10px 4px',
      font: 'var(--weight-semibold) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)',
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)'
    }
  }, s.label), s.courses.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 10px',
      font: 'var(--text-footnote)',
      color: 'var(--text-4)'
    }
  }, "No courses yet"), s.courses.map(c => /*#__PURE__*/React.createElement(SideItem, {
    key: c.id,
    indent: true,
    caption: c.code,
    label: c.title,
    badge: c.toReview || undefined,
    active: active === c.id,
    onClick: () => onSelect && onSelect(c.id)
  })))), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, footer));
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
// iPhone bottom tabs. Translucent material; add safe-area inset below.
function TabBar({
  items,
  active,
  onChange,
  contained
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: contained ? 'absolute' : 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 20,
      display: 'flex',
      paddingBottom: contained ? 28 : 'env(safe-area-inset-bottom)',
      background: 'var(--material)',
      backdropFilter: 'var(--blur-material)',
      WebkitBackdropFilter: 'var(--blur-material)',
      borderTop: '0.5px solid var(--separator-strong)'
    }
  }, items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onChange && onChange(it.id),
      "aria-current": on ? 'page' : undefined,
      style: {
        flex: 1,
        height: 'var(--tabbar-height)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: on ? 'var(--tint)' : 'var(--text-3)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 24,
      strokeWidth: on ? 2 : 1.75
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-medium) 10px/12px var(--font-ui)'
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/study/CourseCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CourseCard({
  code,
  title,
  questions,
  weeks,
  toReview = 0,
  progress = 0,
  archived,
  onClick,
  style
}) {
  const [pressed, ph] = __ds_scope.usePress(!onClick);
  const pct = Math.round(progress * 100);
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick
  }, ph, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      padding: 16,
      boxSizing: 'border-box',
      textAlign: 'left',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: onClick ? 'pointer' : 'default',
      background: pressed ? 'var(--surface-pressed)' : 'var(--surface)',
      color: 'var(--text-1)',
      boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)',
      opacity: archived ? 0.6 : 1,
      transition: 'background var(--dur-instant)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
      color: 'var(--tint)',
      letterSpacing: '0.02em'
    }
  }, code), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-headline)',
      textWrap: 'pretty'
    }
  }, title)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-4)",
    strokeWidth: 2,
    style: {
      marginTop: 10
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '4px 12px',
      font: 'var(--text-footnote)',
      color: 'var(--text-2)'
    }
  }, /*#__PURE__*/React.createElement("span", null, questions, " questions"), /*#__PURE__*/React.createElement("span", null, weeks, " ", weeks === 1 ? 'week' : 'weeks'), toReview > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      color: 'var(--text-1)',
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "inbox",
    size: 14,
    strokeWidth: 2
  }), toReview, " to review")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: progress,
    style: {
      flex: 1
    },
    label: `${pct}% answered`
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)',
      color: 'var(--text-3)',
      fontVariantNumeric: 'tabular-nums',
      minWidth: 32,
      textAlign: 'right'
    }
  }, pct, "%")));
}
Object.assign(__ds_scope, { CourseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/study/CourseCard.jsx", error: String((e && e.message) || e) }); }

// components/study/FilterChip.jsx
try { (() => {
function FilterChip({
  label,
  count,
  selected,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-pressed": !!selected,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 34,
      padding: '0 12px',
      flexShrink: 0,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      border: selected ? '1px solid var(--text-1)' : '1px solid var(--separator-strong)',
      background: selected ? 'var(--text-1)' : 'var(--surface)',
      color: selected ? 'var(--bg)' : 'var(--text-1)',
      font: 'var(--weight-medium) var(--size-subhead)/var(--lh-subhead) var(--font-ui)',
      transition: 'background var(--dur-quick), color var(--dur-quick)'
    }
  }, label, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums',
      opacity: selected ? 0.75 : 1,
      color: selected ? 'inherit' : 'var(--text-3)'
    }
  }, count));
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/study/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/study/SetRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// status: done | progress | new | imported | replaced
const STATUS = {
  done: {
    icon: 'circle-check',
    color: 'var(--correct)'
  },
  progress: {
    icon: 'clock',
    color: 'var(--tint)'
  },
  new: {
    icon: 'circle',
    color: 'var(--text-4)'
  },
  imported: {
    icon: 'download',
    color: 'var(--tint)'
  },
  replaced: {
    icon: 'rotate-ccw',
    color: 'var(--partial)'
  }
};
function SetRow({
  title,
  status = 'new',
  detail,
  count,
  onClick,
  onRestore,
  readOnly
}) {
  const s = STATUS[status] || STATUS.new;
  const [pressed, ph] = __ds_scope.usePress(!onClick);
  const text = detail || {
    new: 'Not started',
    imported: 'Imported today',
    replaced: 'Replaced today with a corrected file'
  }[status];
  return /*#__PURE__*/React.createElement("div", _extends({
    role: onClick ? 'button' : undefined,
    onClick: onClick
  }, ph, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minHeight: 60,
      padding: '10px 16px',
      boxSizing: 'border-box',
      background: pressed ? 'var(--surface-pressed)' : 'transparent',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background var(--dur-instant)'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: 20,
    color: s.color,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--text-1)',
      textWrap: 'pretty'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-footnote)',
      color: status === 'replaced' ? 'var(--partial)' : 'var(--text-3)'
    }
  }, text, count != null && status !== 'replaced' ? ` · ${count} questions` : '')), status === 'replaced' && onRestore && !readOnly ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    icon: "rotate-ccw",
    onClick: e => {
      e.stopPropagation();
      onRestore();
    }
  }, "Restore") : onClick && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-4)",
    strokeWidth: 2
  }));
}
Object.assign(__ds_scope, { SetRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/study/SetRow.jsx", error: String((e && e.message) || e) }); }

// components/study/Tile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Course-level entry tile: Exam / N to review / N terms.
function Tile({
  icon,
  value,
  label,
  detail,
  onClick,
  emphasis,
  style
}) {
  const [pressed, ph] = __ds_scope.usePress(!onClick);
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick
  }, ph, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 10,
      flex: 1,
      minWidth: 0,
      minHeight: 96,
      padding: 14,
      boxSizing: 'border-box',
      textAlign: 'left',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      cursor: onClick ? 'pointer' : 'default',
      background: emphasis ? pressed ? 'var(--tint-pressed)' : 'var(--tint)' : pressed ? 'var(--surface-pressed)' : 'var(--surface)',
      color: emphasis ? 'var(--text-on-tint)' : 'var(--text-1)',
      boxShadow: emphasis ? 'none' : 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)',
      transition: 'background var(--dur-instant)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 22,
    color: emphasis ? 'currentColor' : 'var(--tint)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, value != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) var(--size-title-2)/var(--lh-title-2) var(--font-display)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      font: value != null ? 'var(--text-footnote)' : 'var(--text-headline)',
      color: emphasis ? 'currentColor' : value != null ? 'var(--text-2)' : 'var(--text-1)'
    }
  }, label), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-caption)',
      opacity: 0.8,
      marginTop: 2
    }
  }, detail)));
}
Object.assign(__ds_scope, { Tile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/study/Tile.jsx", error: String((e && e.message) || e) }); }

// components/study/WeekCheckboxRow.jsx
try { (() => {
// Exam setup row: tick a week; shows its size and, when ticked, how many the draw takes.
function WeekCheckboxRow({
  label,
  count,
  drawn,
  checked,
  onChange,
  disabled
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => !disabled && onChange && onChange(!checked),
    "aria-pressed": !!checked,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      minHeight: 52,
      padding: '10px 16px',
      boxSizing: 'border-box',
      border: 'none',
      background: 'transparent',
      textAlign: 'left',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.CheckboxBox, {
    checked: checked
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-body)',
      color: 'var(--text-1)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--text-footnote)',
      color: 'var(--text-3)'
    }
  }, count, " questions")), checked && drawn != null && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap',
      font: 'var(--weight-semibold) var(--size-subhead)/var(--lh-subhead) var(--font-ui)',
      color: 'var(--tint)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, drawn, " in exam"));
}
Object.assign(__ds_scope, { WeekCheckboxRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/study/WeekCheckboxRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qbank-admin/Admin.jsx
try { (() => {
(() => {
  const {
    Button,
    Icon,
    TextField,
    ListGroup,
    ListRow,
    ConfirmSheet,
    PickerSelect
  } = window.QbankDesignSystem_4be789;
  const D = window.QB_DATA;
  function AdminHome({
    nav,
    phone,
    wide
  }) {
    const Page = window.Page;
    const [repair, setRepair] = React.useState(false);
    const [done, setDone] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(Page, {
      title: "Admin",
      subtitle: "Fix things in the app and in her account",
      phone: phone,
      wide: wide,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement(ListGroup, {
      header: "Semesters and courses",
      footer: "Same controls as her Settings: add, rename, move between semesters, archive and unarchive."
    }, D.semesters.map(s => /*#__PURE__*/React.createElement(ListRow, {
      key: s.id,
      icon: "graduation-cap",
      title: s.label,
      value: `${s.courses.length} ${s.courses.length === 1 ? 'course' : 'courses'}`,
      chevron: true,
      onClick: () => {}
    })), /*#__PURE__*/React.createElement(ListRow, {
      icon: "plus",
      title: "Add a semester",
      onClick: () => {}
    }), /*#__PURE__*/React.createElement(ListRow, {
      icon: "plus",
      title: "Add a course",
      onClick: () => {}
    })), /*#__PURE__*/React.createElement(ListGroup, {
      header: "Weeks"
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "pencil",
      title: "Fix a week",
      detail: "Rename a week label or move a set to another week",
      chevron: true,
      onClick: () => nav.push('adminWeeks')
    })), /*#__PURE__*/React.createElement(ListGroup, {
      header: "Her account"
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "key-round",
      title: "Reset her password",
      detail: "Send a reset email or set a temporary password",
      chevron: true,
      onClick: () => nav.push('adminAccount')
    })), /*#__PURE__*/React.createElement(ListGroup, {
      header: "Repair",
      footer: "For when something breaks, not for normal use. Each repair says what it will change and asks first."
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "wrench",
      title: "Rebuild progress and Review",
      detail: done ? 'Rebuilt just now · nothing else changed' : 'From her saved answers',
      onClick: () => setRepair(true)
    }))), /*#__PURE__*/React.createElement(ConfirmSheet, {
      contained: true,
      centered: wide,
      open: repair,
      onDismiss: () => setRepair(false),
      title: "Rebuild her progress and Review?",
      message: "This recalculates course completion, set status and the Review list for all 4 courses from her 412 saved answers. Her answers and scores are not changed. 2 questions in NURS 214 would move back into Review.",
      actions: [{
        label: 'Rebuild',
        variant: 'primary',
        onClick: () => {
          setRepair(false);
          setDone(true);
        }
      }, {
        label: 'Cancel',
        onClick: () => setRepair(false)
      }]
    }));
  }
  function AdminWeeks({
    nav,
    phone,
    wide
  }) {
    const Page = window.Page;
    const [course, setCourse] = React.useState(0);
    const [saved, setSaved] = React.useState(false);
    const labels = D.weeks.map(w => w.label);
    return /*#__PURE__*/React.createElement(Page, {
      title: "Fix a week",
      onBack: nav.back,
      backLabel: "Admin",
      phone: phone,
      wide: wide,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
        color: 'var(--text-2)'
      }
    }, "Course"), /*#__PURE__*/React.createElement(PickerSelect, {
      options: ['NURS 214 · Adult Health I', 'NURS 220 · Pharmacology', 'NURS 110 · Health Assessment', 'NURS 101 · Foundations'],
      value: course,
      onChange: setCourse
    })), D.weeks.map(w => /*#__PURE__*/React.createElement("section", {
      key: w.id,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)'
      }
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Week label",
      defaultValue: w.label,
      hint: w.id === 'w4' ? 'e.g. “Weeks 3–4” for a mixed week' : undefined
    }), w.sets.map(s => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 150px',
        gap: 10,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-subhead)',
        color: 'var(--text-1)'
      }
    }, s.title), /*#__PURE__*/React.createElement(PickerSelect, {
      options: labels.map(l => `Move to ${l}`),
      value: labels.indexOf(w.label),
      onChange: () => setSaved(false)
    }))))), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      icon: saved ? 'check' : undefined,
      onClick: () => setSaved(true)
    }, saved ? 'Saved' : 'Save changes'));
  }
  function AdminAccount({
    nav,
    phone,
    wide
  }) {
    const Page = window.Page;
    const [sent, setSent] = React.useState(false);
    const [temp, setTemp] = React.useState(false);
    return /*#__PURE__*/React.createElement(Page, {
      title: "Her password",
      onBack: nav.back,
      backLabel: "Admin",
      phone: phone,
      wide: wide,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement(ListGroup, {
      header: "Send a reset email",
      footer: "She gets a link at maya@example.com that works for one hour."
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: sent ? 'check' : 'mail',
      title: sent ? 'Reset email sent' : 'Send reset email',
      onClick: () => setSent(true)
    })), /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Or set a temporary password",
      type: "text",
      defaultValue: "lamp-river-42",
      hint: "Give it to her yourself. She\u2019s asked to change it the next time she signs in."
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      fullWidth: true,
      icon: temp ? 'check' : 'lock',
      onClick: () => setTemp(true)
    }, temp ? 'Temporary password set' : 'Set temporary password')));
  }
  Object.assign(window, {
    AdminHome,
    AdminWeeks,
    AdminAccount
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qbank-admin/Admin.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qbank-app/Question.jsx
try { (() => {
(() => {
  const {
    AnswerOption,
    OrderingRow,
    MatchRow,
    MatrixGrid,
    HighlightPassage,
    ClozeBlank
  } = window.QbankDesignSystem_4be789;
  const FORMAT_NAMES = {
    single: 'Single answer',
    priority: 'Priority',
    sata: 'Select all that apply',
    highlight: 'Highlight',
    order: 'Ordering',
    match: 'Matching',
    matrix: 'Matrix',
    cloze: 'Drop-down'
  };
  const RULES = {
    sata: '+1 for each correct choice, −1 for each wrong one',
    highlight: '+1 for each correct choice, −1 for each wrong one',
    order: 'Items in the right position; full credit needs all of them',
    match: '1 point for each correct pair',
    matrix: '1 point for each correct row',
    cloze: '1 point for each correct blank'
  };
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const range = n => Array.from({
    length: n
  }, (_, i) => i);

  // The shuffle she saw — saved with the attempt.
  function makeLayout(q) {
    if (q.options) return {
      opt: shuffle(range(q.options.length))
    };
    if (q.type === 'order') {
      let o = shuffle(range(q.items.length));
      if (o.every((v, i) => v === i)) o = o.reverse();
      return {
        start: o
      };
    }
    if (q.type === 'match') return {
      choices: shuffle([...q.pairs.map(p => p.r), ...(q.extra || [])])
    };
    return {};
  }
  function initialResponse(q, layout) {
    if (q.type === 'order') return {
      order: layout.start.slice()
    };
    return {};
  }
  function isAnswered(q, r) {
    if (!r) return false;
    switch (q.type) {
      case 'single':
      case 'priority':
        return r.pick != null;
      case 'sata':
      case 'highlight':
        return (r.picks || []).length > 0;
      case 'order':
        return true;
      case 'match':
        return Object.keys(r.map || {}).length === q.pairs.length;
      case 'matrix':
        return Object.keys(r.map || {}).length === q.rows.length;
      case 'cloze':
        return Object.keys(r.map || {}).length === q.blanks.length;
    }
    return false;
  }
  function score(q, r, layout) {
    r = r || {};
    let points = 0,
      max = 1;
    switch (q.type) {
      case 'single':
      case 'priority':
        points = r.pick != null && q.options[r.pick].ok ? 1 : 0;
        break;
      case 'sata':
        {
          const ok = q.options.map(o => !!o.ok);
          max = ok.filter(Boolean).length;
          points = Math.max(0, (r.picks || []).reduce((s, i) => s + (ok[i] ? 1 : -1), 0));
          break;
        }
      case 'highlight':
        {
          max = q.segments.filter(s => s.ok).length;
          points = Math.max(0, (r.picks || []).reduce((s, i) => s + (q.segments[i].ok ? 1 : -1), 0));
          break;
        }
      case 'order':
        max = q.items.length;
        points = (r.order || []).filter((v, i) => v === i).length;
        break;
      case 'match':
        max = q.pairs.length;
        points = q.pairs.filter((p, i) => r.map && r.map[i] != null && layout.choices[r.map[i]] === p.r).length;
        break;
      case 'matrix':
        max = q.rows.length;
        points = q.rows.filter((row, i) => r.map && r.map[i] === row.ans).length;
        break;
      case 'cloze':
        max = q.blanks.length;
        points = q.blanks.filter((b, i) => r.map && r.map[i] === b.ans).length;
        break;
    }
    const status = points === max ? 'correct' : points > 0 ? 'partial' : 'wrong';
    return {
      points,
      max,
      status
    };
  }
  function QuestionBody({
    q,
    layout,
    response,
    onChange,
    revealed,
    wide
  }) {
    const r = response || {};
    const set = patch => onChange({
      ...r,
      ...patch
    });
    const gap = {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    };
    switch (q.type) {
      case 'single':
      case 'priority':
      case 'sata':
        {
          const multi = q.type === 'sata';
          const picks = multi ? r.picks || [] : r.pick != null ? [r.pick] : [];
          return /*#__PURE__*/React.createElement("div", {
            style: gap,
            role: multi ? 'group' : 'radiogroup'
          }, layout.opt.map(oi => {
            const o = q.options[oi];
            const picked = picks.includes(oi);
            const state = !revealed ? picked ? 'selected' : 'idle' : picked && o.ok ? 'correct' : picked ? 'wrong' : o.ok ? 'missed' : 'dim';
            return /*#__PURE__*/React.createElement(AnswerOption, {
              key: oi,
              control: multi ? 'checkbox' : 'radio',
              text: o.t,
              state: state,
              reason: o.why,
              onClick: () => multi ? set({
                picks: picked ? picks.filter(x => x !== oi) : [...picks, oi]
              }) : set({
                pick: oi
              })
            });
          }));
        }
      case 'order':
        {
          const order = r.order || layout.start;
          const move = (i, d) => {
            const o = order.slice();
            [o[i], o[i + d]] = [o[i + d], o[i]];
            set({
              order: o
            });
          };
          return /*#__PURE__*/React.createElement("div", {
            style: {
              ...gap,
              gap: 8
            }
          }, order.map((item, i) => /*#__PURE__*/React.createElement(OrderingRow, {
            key: item,
            position: i + 1,
            text: q.items[item],
            state: !revealed ? 'idle' : item === i ? 'correct' : 'wrong',
            correctPosition: item + 1,
            onMoveUp: i > 0 ? () => move(i, -1) : undefined,
            onMoveDown: i < order.length - 1 ? () => move(i, 1) : undefined
          })));
        }
      case 'match':
        return /*#__PURE__*/React.createElement("div", {
          style: gap
        }, q.pairs.map((p, i) => {
          const v = r.map ? r.map[i] : null;
          return /*#__PURE__*/React.createElement(MatchRow, {
            key: i,
            left: p.l,
            options: layout.choices,
            value: v,
            correctText: p.r,
            state: !revealed ? 'idle' : v != null && layout.choices[v] === p.r ? 'correct' : 'wrong',
            onChange: n => set({
              map: {
                ...(r.map || {}),
                [i]: n
              }
            })
          });
        }));
      case 'matrix':
        return /*#__PURE__*/React.createElement(MatrixGrid, {
          columns: q.columns,
          rows: q.rows,
          value: r.map || {},
          onChange: m => set({
            map: m
          }),
          revealed: revealed,
          layout: wide ? 'table' : 'stacked'
        });
      case 'highlight':
        {
          const picks = r.picks || [];
          return /*#__PURE__*/React.createElement("div", {
            style: {
              padding: 16,
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              boxShadow: 'inset 0 0 0 0.5px var(--separator)'
            }
          }, /*#__PURE__*/React.createElement(HighlightPassage, {
            segments: q.segments,
            selected: picks,
            revealed: revealed,
            size: wide ? 'lg' : 'md',
            onToggle: i => set({
              picks: picks.includes(i) ? picks.filter(x => x !== i) : [...picks, i]
            })
          }));
        }
      case 'cloze':
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface)',
            boxShadow: 'inset 0 0 0 0.5px var(--separator)'
          }
        }, /*#__PURE__*/React.createElement(ClozeBlank, {
          template: q.template,
          blanks: q.blanks,
          value: r.map || {},
          onChange: m => set({
            map: m
          }),
          revealed: revealed,
          size: wide ? 'lg' : 'md'
        }));
    }
    return null;
  }
  Object.assign(window, {
    QB_Q: {
      FORMAT_NAMES,
      RULES,
      makeLayout,
      initialResponse,
      isAnswered,
      score,
      shuffle
    },
    QuestionBody
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qbank-app/Question.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qbank-app/Runner.jsx
try { (() => {
(() => {
  const {
    Button,
    Icon,
    ProgressBar,
    Checkbox,
    FeedbackBanner,
    RationaleBlock,
    TermDefinition,
    CountdownTimer,
    ConfirmSheet,
    StatusMark,
    ListGroup
  } = window.QbankDesignSystem_4be789;
  const D = window.QB_DATA;
  function Runner({
    mode = 'practice',
    title,
    questions,
    wide,
    phone,
    onExit,
    onFinish,
    seconds: startSeconds
  }) {
    const Q = window.QB_Q;
    const exam = mode === 'exam';
    const layouts = React.useMemo(() => Object.fromEntries(questions.map(q => [q.id, Q.makeLayout(q)])), [questions]);
    const [idx, setIdx] = React.useState(0);
    const [resp, setResp] = React.useState(() => Object.fromEntries(questions.map(q => [q.id, Q.initialResponse(q, layouts[q.id])])));
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
    const finish = React.useCallback(reason => {
      const items = questions.map(qq => {
        const done = exam ? submitted[qq.id] : checked[qq.id];
        const s = done ? Q.score(qq, resp[qq.id], layouts[qq.id]) : {
          points: 0,
          max: Q.score(qq, {}, layouts[qq.id]).max,
          status: 'unanswered'
        };
        return {
          q: qq,
          ...s,
          guessed: !!guess[qq.id] && done,
          response: resp[qq.id],
          layout: layouts[qq.id]
        };
      });
      onFinish && onFinish({
        mode,
        title,
        items,
        minutes: Math.max(1, Math.round((Date.now() - t0.current) / 60000)),
        reason
      });
    }, [questions, submitted, checked, resp, guess, layouts]);
    React.useEffect(() => {
      if (!exam) return;
      const t = setInterval(() => setSecs(s => s - 1), 1000);
      return () => clearInterval(t);
    }, [exam]);
    React.useEffect(() => {
      if (exam && secs <= 0 && startSeconds) finish('timeout');
    }, [secs]);
    React.useEffect(() => {
      if (scroller.current) scroller.current.scrollTop = 0;
      setNotice(null);
    }, [idx]);
    const go = i => setIdx(i);
    const check = () => {
      setChecked({
        ...checked,
        [q.id]: true
      });
      setTimeout(() => {
        if (scroller.current && feedbackRef.current) scroller.current.scrollTo({
          top: feedbackRef.current.offsetTop - 12,
          behavior: 'smooth'
        });
      }, 60);
    };
    const next = () => idx < questions.length - 1 ? go(idx + 1) : finish('done');
    const examAdvance = (sub, skp) => {
      const remaining = skp.filter(id => !sub[id]);
      let n = idx + 1;
      if (n < questions.length) return go(n);
      if (remaining.length) {
        const first = questions.findIndex(qq => qq.id === remaining[0]);
        go(first);
        setTimeout(() => setNotice(`${remaining.length} skipped ${remaining.length === 1 ? 'question' : 'questions'} left. This is the first one.`), 0);
        return;
      }
      finish('done');
    };
    const submit = () => {
      const sub = {
        ...submitted,
        [q.id]: true
      };
      setSubmitted(sub);
      const skp = skipped.filter(id => id !== q.id);
      setSkipped(skp);
      examAdvance(sub, skp);
    };
    const skip = () => {
      const skp = skipped.includes(q.id) ? skipped : [...skipped, q.id];
      setSkipped(skp);
      examAdvance(submitted, skp);
    };
    const answeredCount = Object.keys(submitted).length;
    const allVisited = idx === questions.length - 1 || skipped.length > 0 && questions.slice(idx + 1).every(qq => submitted[qq.id] || skipped.includes(qq.id));
    const pad = wide ? 32 : 16;
    const result = revealed ? Q.score(q, resp[q.id], layouts[q.id]) : null;
    const termKeys = q.terms || [];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: phone ? 54 : 0,
        background: 'var(--material)',
        backdropFilter: 'var(--blur-material)',
        WebkitBackdropFilter: 'var(--blur-material)',
        borderBottom: '0.5px solid var(--separator)',
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 48,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement("div", null, exam ? /*#__PURE__*/React.createElement(Button, {
      variant: "plain",
      size: "sm",
      onClick: () => setConfirmEnd(true)
    }, "End exam") : /*#__PURE__*/React.createElement(Button, {
      variant: "plain",
      size: "sm",
      iconOnly: true,
      icon: "x",
      label: "Close",
      onClick: onExit,
      style: {
        color: 'var(--text-2)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-headline)',
        color: 'var(--text-1)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, idx + 1, " of ", questions.length), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-caption)',
        color: 'var(--text-3)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: wide ? 420 : 200
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: 8
      }
    }, exam && /*#__PURE__*/React.createElement(CountdownTimer, {
      seconds: secs,
      compact: !wide
    }))), /*#__PURE__*/React.createElement(ProgressBar, {
      value: (idx + (revealed || submitted[q.id] ? 1 : 0)) / questions.length,
      height: 3,
      style: {
        borderRadius: 0
      }
    })), /*#__PURE__*/React.createElement("div", {
      ref: scroller,
      style: {
        flex: 1,
        overflowY: 'auto',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        padding: `${wide ? 28 : 20}px ${pad}px 28px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, notice && /*#__PURE__*/React.createElement("div", {
      role: "status",
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '10px 14px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--tint-soft)',
        color: 'var(--text-1)',
        font: 'var(--text-subhead)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 18,
      color: "var(--tint)"
    }), notice), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px 10px',
        font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
        color: 'var(--text-3)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--tint)'
      }
    }, Q.FORMAT_NAMES[q.type]), /*#__PURE__*/React.createElement("span", null, q.topic), exam && skipped.includes(q.id) && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--partial)'
      }
    }, "Skipped earlier")), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        font: wide ? 'var(--text-reading-lg)' : 'var(--text-reading)',
        color: 'var(--text-1)',
        textWrap: 'pretty'
      }
    }, q.stem), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        font: wide ? 'var(--weight-semibold) var(--size-title-3)/var(--lh-title-3) var(--font-ui)' : 'var(--text-headline)',
        color: 'var(--text-1)',
        textWrap: 'pretty'
      }
    }, q.ask), revealed && /*#__PURE__*/React.createElement("div", {
      ref: feedbackRef
    }, /*#__PURE__*/React.createElement(FeedbackBanner, {
      status: result.status,
      points: result.points,
      max: result.max,
      rule: Q.RULES[q.type],
      guessed: guess[q.id]
    })), /*#__PURE__*/React.createElement(window.QuestionBody, {
      key: q.id,
      q: q,
      layout: layouts[q.id],
      response: resp[q.id],
      revealed: revealed,
      wide: wide,
      onChange: r => !revealed && !submitted[q.id] && setResp({
        ...resp,
        [q.id]: r
      })
    }), !revealed && /*#__PURE__*/React.createElement(Checkbox, {
      tone: "guess",
      checked: !!guess[q.id],
      onChange: v => setGuess({
        ...guess,
        [q.id]: v
      }),
      label: "I'm guessing",
      detail: "Flag for review"
    }), revealed && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        paddingTop: 4
      }
    }, /*#__PURE__*/React.createElement(RationaleBlock, null, q.rationale), /*#__PURE__*/React.createElement(RationaleBlock, {
      variant: "takeaway"
    }, q.takeaway), termKeys.length > 0 && /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        margin: '0 0 2px',
        font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
        color: 'var(--text-3)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-caps)'
      }
    }, "Terms in this question"), termKeys.map((k, i) => /*#__PURE__*/React.createElement(TermDefinition, {
      key: k,
      term: D.terms[k][0],
      meaning: D.terms[k][1],
      divider: i < termKeys.length - 1
    })))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: `12px ${pad}px ${phone ? 34 : 16}px`,
        background: 'var(--material)',
        backdropFilter: 'var(--blur-material)',
        WebkitBackdropFilter: 'var(--blur-material)',
        borderTop: '0.5px solid var(--separator)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        display: 'flex',
        gap: 10
      }
    }, exam ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "quiet",
      size: "lg",
      onClick: skip,
      style: {
        flex: '0 0 auto'
      }
    }, "Skip for now"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      disabled: !answered,
      onClick: submit
    }, allVisited && skipped.filter(id => id !== q.id).length === 0 ? 'Finish exam' : 'Submit and continue')) : revealed ? /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      iconRight: idx < questions.length - 1 ? 'arrow-right' : undefined,
      onClick: next
    }, idx < questions.length - 1 ? 'Next question' : 'See results') : /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      disabled: !answered,
      onClick: check
    }, "Check answer"))), /*#__PURE__*/React.createElement(ConfirmSheet, {
      contained: true,
      open: confirmEnd,
      centered: wide,
      onDismiss: () => setConfirmEnd(false),
      title: "End the exam now?",
      message: `The ${answeredCount} ${answeredCount === 1 ? 'question' : 'questions'} you answered will be scored. Skipped and unreached questions score 0 and stay out of Review.`,
      actions: [{
        label: 'End exam',
        variant: 'destructive',
        onClick: () => {
          setConfirmEnd(false);
          finish('left');
        }
      }, {
        label: 'Keep going',
        onClick: () => setConfirmEnd(false)
      }]
    }));
  }
  function BreakdownRows({
    rows
  }) {
    return /*#__PURE__*/React.createElement(ListGroup, null, rows.map(r => /*#__PURE__*/React.createElement("div", {
      key: r.label,
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 90px 64px',
        gap: 12,
        alignItems: 'center',
        padding: '12px 16px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-subhead)',
        color: 'var(--text-1)'
      }
    }, r.label), /*#__PURE__*/React.createElement(ProgressBar, {
      value: r.total ? r.right / r.total : 0,
      tone: r.right === r.total ? 'correct' : 'tint',
      height: 6
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--size-subhead)/1 var(--font-ui)',
        color: 'var(--text-1)',
        fontVariantNumeric: 'tabular-nums',
        textAlign: 'right'
      }
    }, r.right, " of ", r.total))));
  }
  function ResultRow({
    item,
    n,
    wide
  }) {
    const [open, setOpen] = React.useState(false);
    const st = item.status === 'unanswered' ? 'unanswered' : item.guessed ? 'guessed' : item.status;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(!open),
      "aria-expanded": open,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        font: 'var(--weight-semibold) var(--size-footnote)/1 var(--font-mono)',
        color: 'var(--text-3)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-body)',
        color: 'var(--text-1)'
      }
    }, item.q.topic), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-footnote)',
        color: 'var(--text-3)'
      }
    }, window.QB_Q.FORMAT_NAMES[item.q.type], " \xB7 ", item.points, " of ", item.max)), /*#__PURE__*/React.createElement(StatusMark, {
      status: st,
      size: "sm",
      label: st === 'guessed' ? `Guessed · ${item.status === 'correct' ? 'right' : 'not right'}` : undefined
    }), /*#__PURE__*/React.createElement(Icon, {
      name: open ? 'chevron-up' : 'chevron-down',
      size: 18,
      color: "var(--text-4)",
      strokeWidth: 2
    })), open && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 16px 18px 50px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        font: 'var(--text-reading-sm)',
        color: 'var(--text-1)'
      }
    }, item.q.stem, " ", /*#__PURE__*/React.createElement("strong", {
      style: {
        fontFamily: 'var(--font-ui)'
      }
    }, item.q.ask)), /*#__PURE__*/React.createElement(window.QuestionBody, {
      q: item.q,
      layout: item.layout,
      response: item.response,
      revealed: true,
      wide: wide,
      onChange: () => {}
    }), /*#__PURE__*/React.createElement(RationaleBlock, null, item.q.rationale), /*#__PURE__*/React.createElement(RationaleBlock, {
      variant: "takeaway"
    }, item.q.takeaway)));
  }
  function Results({
    result,
    wide,
    phone,
    onDone,
    onReview
  }) {
    const exam = result.mode === 'exam';
    const it = result.items;
    const right = it.filter(i => i.status === 'correct').length;
    const pts = it.reduce((s, i) => s + i.points, 0),
      max = it.reduce((s, i) => s + i.max, 0);
    const count = k => it.filter(i => i.status === k).length;
    const guessed = it.filter(i => i.guessed).length;
    const toReview = it.filter(i => i.status !== 'unanswered' && (i.status !== 'correct' || i.guessed)).length;
    const cjs = [...new Set(it.map(i => i.q.cj))].map(cj => ({
      label: cj,
      right: it.filter(i => i.q.cj === cj && i.status === 'correct').length,
      total: it.filter(i => i.q.cj === cj).length
    }));
    const pad = wide ? 32 : 16;
    const stat = (label, value, st) => /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 90,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: 12,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface)',
        boxShadow: 'inset 0 0 0 0.5px var(--separator)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-bold) var(--size-title-3)/var(--lh-title-3) var(--font-display)',
        color: 'var(--text-1)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value), st ? /*#__PURE__*/React.createElement(StatusMark, {
      status: st,
      size: "sm",
      label: label
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-footnote)',
        color: 'var(--text-3)'
      }
    }, label));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        overflowY: 'auto',
        background: 'var(--bg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        padding: `${phone ? 58 : 32}px ${pad}px 48px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: phone ? '0 -8px -4px 0' : '-20px -8px 0 0'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "plain",
      size: "sm",
      onClick: onDone
    }, "Done")), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
        color: 'var(--text-3)'
      }
    }, exam ? 'Exam result' : 'Set finished', " \xB7 ", result.title), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        font: 'var(--text-large-title)',
        letterSpacing: 'var(--tracking-tight)',
        color: 'var(--text-1)'
      }
    }, right, " of ", it.length, " fully right"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-callout)',
        color: 'var(--text-2)'
      }
    }, pts, " of ", max, " points \xB7 ", result.minutes, " min", result.reason === 'timeout' ? ' · Time ran out' : result.reason === 'left' ? ' · Ended early' : '')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, stat('Partly right', count('partial'), 'partial'), stat('Missed', count('wrong'), 'wrong'), stat('Guessed', guessed, 'guessed'), exam && stat('Not answered', count('unanswered'), 'unanswered')), exam && toReview > 0 && /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      icon: "inbox",
      onClick: onReview
    }, "Open Review \xB7 ", toReview, " from this exam"), exam && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        font: 'var(--text-headline)'
      }
    }, "By week"), /*#__PURE__*/React.createElement(BreakdownRows, {
      rows: [{
        label: 'Week 4',
        right,
        total: it.length
      }]
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        font: 'var(--text-headline)'
      }
    }, "By clinical judgment step"), /*#__PURE__*/React.createElement(BreakdownRows, {
      rows: cjs
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        font: 'var(--text-headline)'
      }
    }, "Questions"), /*#__PURE__*/React.createElement(ListGroup, null, it.map((item, i) => /*#__PURE__*/React.createElement(ResultRow, {
      key: item.q.id,
      item: item,
      n: i + 1,
      wide: wide
    })))), /*#__PURE__*/React.createElement(Button, {
      variant: exam ? 'quiet' : 'primary',
      size: "lg",
      fullWidth: true,
      onClick: onDone
    }, "Back to course")));
  }
  Object.assign(window, {
    Runner,
    Results
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qbank-app/Runner.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qbank-app/Screens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    NavBar,
    Button,
    Icon,
    TextField,
    CourseCard,
    SetRow,
    Tile,
    FilterChip,
    ListGroup,
    ListRow,
    StatusMark,
    TermDefinition,
    EmptyState,
    ConfirmSheet
  } = window.QbankDesignSystem_4be789;
  const D = window.QB_DATA;
  function ReadOnlyBanner() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-sunken)',
        color: 'var(--text-2)',
        font: 'var(--text-footnote)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "eye",
      size: 16
    }), "Her progress, read-only. Answers, scores and Review can\u2019t be changed here.");
  }
  function Page({
    title,
    subtitle,
    large = true,
    onBack,
    backLabel,
    trailing,
    phone,
    wide,
    admin,
    children,
    maxWidth
  }) {
    const pad = wide ? 'var(--gutter-tablet)' : 'var(--gutter-phone)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)'
      }
    }, phone && /*#__PURE__*/React.createElement("div", {
      style: {
        height: 54,
        flexShrink: 0,
        background: 'var(--material)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(NavBar, {
      large: false,
      onBack: onBack,
      backLabel: backLabel,
      trailing: trailing
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: maxWidth || (wide ? 'var(--content-max-wide)' : 'none'),
        margin: '0 auto',
        padding: `2px ${pad} ${phone ? 110 : 48}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gap-section)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginBottom: -12
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        font: 'var(--text-large-title)',
        letterSpacing: 'var(--tracking-tight)',
        color: 'var(--text-1)',
        textWrap: 'balance'
      }
    }, title), subtitle && /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--text-subhead)',
        color: 'var(--text-2)'
      }
    }, subtitle)), admin && /*#__PURE__*/React.createElement(ReadOnlyBanner, null), children)));
  }
  function SignIn({
    onSignedIn,
    phone
  }) {
    const [forgot, setForgot] = React.useState(false);
    const [sent, setSent] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        overflowY: 'auto',
        background: 'var(--bg)',
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: 380,
        padding: `${phone ? 110 : 80}px 24px 40px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement(window.AppIconMark, {
      size: 76
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        font: 'var(--text-title-1)',
        color: 'var(--text-1)'
      }
    }, forgot ? 'Reset your password' : 'Qbank'), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0',
        font: 'var(--text-subhead)',
        color: 'var(--text-2)'
      }
    }, forgot ? 'We’ll email you a link to set a new one.' : 'NCLEX practice, synced across your devices.'))), sent ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "mail",
      size: 28,
      color: "var(--tint)"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        font: 'var(--text-callout)',
        color: 'var(--text-2)',
        textWrap: 'pretty'
      }
    }, "If that address has an account, a reset link is on its way. It works for one hour."), /*#__PURE__*/React.createElement(Button, {
      variant: "plain",
      onClick: () => {
        setForgot(false);
        setSent(false);
      }
    }, "Back to sign in")) : forgot ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Email",
      type: "email",
      defaultValue: "maya@example.com"
    }), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      onClick: () => setSent(true)
    }, "Send reset link"), /*#__PURE__*/React.createElement(Button, {
      variant: "plain",
      onClick: () => setForgot(false)
    }, "Cancel")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(TextField, {
      label: "Email",
      type: "email",
      defaultValue: "maya@example.com"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Password",
      type: "password",
      defaultValue: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    }), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      onClick: () => onSignedIn(true)
    }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      fullWidth: true,
      icon: "scan-face",
      onClick: () => onSignedIn(false)
    }, "Sign in with a passkey"), /*#__PURE__*/React.createElement(Button, {
      variant: "plain",
      onClick: () => setForgot(true)
    }, "Forgot password?"))));
  }
  function Home({
    nav,
    phone,
    wide,
    admin
  }) {
    return /*#__PURE__*/React.createElement(Page, {
      title: "Home",
      phone: phone,
      wide: wide,
      admin: admin,
      trailing: !admin || true ? /*#__PURE__*/React.createElement(Button, {
        variant: "plain",
        size: "sm",
        iconOnly: true,
        icon: "plus",
        label: "Import a file",
        onClick: () => nav.tab('import')
      }) : null
    }, D.semesters.map(s => /*#__PURE__*/React.createElement("section", {
      key: s.id,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '0 4px'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        font: 'var(--text-title-3)',
        color: 'var(--text-1)'
      }
    }, s.label), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-footnote)',
        color: 'var(--text-3)'
      }
    }, s.dates)), s.courses.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--separator-strong)'
      }
    }, /*#__PURE__*/React.createElement(EmptyState, {
      compact: true,
      icon: "layers",
      message: "A course appears here when its first question file is imported.",
      actionLabel: "Import a file",
      actionIcon: "file-input",
      onAction: () => nav.tab('import')
    })) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: wide ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
        gap: 'var(--gap-stack)'
      }
    }, s.courses.map(c => /*#__PURE__*/React.createElement(CourseCard, _extends({
      key: c.id
    }, c, {
      onClick: () => nav.push('course', {
        course: c
      })
    })))))));
  }
  function Course({
    nav,
    course,
    phone,
    wide,
    admin
  }) {
    const c = course || D.semesters[1].courses[0];
    const [weeks, setWeeks] = React.useState(D.weeks);
    const [restore, setRestore] = React.useState(null);
    const doRestore = () => {
      setWeeks(weeks.map(w => ({
        ...w,
        sets: w.sets.map(s => s.id === restore.id ? {
          ...s,
          status: 'done',
          detail: 'Restored just now · 12 questions'
        } : s)
      })));
      setRestore(null);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(Page, {
      title: c.title,
      subtitle: `${c.code} · Semester 2`,
      onBack: wide ? undefined : nav.back,
      backLabel: "Home",
      phone: phone,
      wide: wide,
      admin: admin
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Tile, {
      icon: "timer",
      label: "Exam",
      detail: wide ? '40 questions in 60 min' : '40 in 60 min',
      emphasis: !admin,
      onClick: () => nav.push('examSetup', {
        course: c
      })
    }), /*#__PURE__*/React.createElement(Tile, {
      icon: "inbox",
      value: c.toReview,
      label: "to review",
      onClick: () => nav.push('review', {
        course: c
      })
    }), /*#__PURE__*/React.createElement(Tile, {
      icon: "book-open",
      value: c.terms || 41,
      label: "terms",
      onClick: () => nav.push('terms', {
        course: c
      })
    })), !admin && /*#__PURE__*/React.createElement(ListGroup, {
      header: "Pick up where you left off"
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "clock",
      title: "Week 3 \xB7 Set 2: Dysrhythmias",
      detail: "7 of 12 answered",
      chevron: true,
      onClick: () => nav.runSet('Week 3 · Set 2: Dysrhythmias')
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: wide ? 'repeat(2, minmax(0, 1fr))' : '1fr',
        gap: 'var(--gap-section) 20px'
      }
    }, weeks.map(w => /*#__PURE__*/React.createElement(ListGroup, {
      key: w.id,
      header: `${w.label} · ${w.count} questions`
    }, w.sets.map(s => /*#__PURE__*/React.createElement(SetRow, _extends({
      key: s.id
    }, s, {
      readOnly: false,
      onClick: admin ? undefined : () => nav.runSet(`${w.label} · ${s.title}`),
      onRestore: () => setRestore(s)
    }))))))), /*#__PURE__*/React.createElement(ConfirmSheet, {
      contained: true,
      centered: wide,
      open: !!restore,
      onDismiss: () => setRestore(null),
      title: `Restore the previous “${restore ? restore.title.replace(/^Set \d+: /, '') : ''}”?`,
      message: "The corrected file you imported today is kept, so you can switch back. Answers on questions that didn\u2019t change are kept either way.",
      actions: [{
        label: 'Restore',
        variant: 'primary',
        onClick: doRestore
      }, {
        label: 'Cancel',
        onClick: () => setRestore(null)
      }]
    }));
  }
  function Terms({
    nav,
    course,
    phone,
    wide,
    admin
  }) {
    const [q, setQ] = React.useState('');
    const list = Object.entries(D.terms).map(([k, [t, m]]) => ({
      k,
      t,
      m
    })).sort((a, b) => a.t.localeCompare(b.t)).filter(x => (x.t + x.m).toLowerCase().includes(q.toLowerCase()));
    return /*#__PURE__*/React.createElement(Page, {
      title: "Terms",
      subtitle: `${(course || {}).code || 'NURS 214'} · ${list.length} terms`,
      onBack: nav.back,
      backLabel: "Course",
      phone: phone,
      wide: wide,
      admin: admin,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement(TextField, {
      placeholder: "Search terms",
      value: q,
      onChange: setQ
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        padding: '0 16px',
        boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)'
      }
    }, list.length ? list.map((x, i) => /*#__PURE__*/React.createElement(TermDefinition, {
      key: x.k,
      term: x.t,
      meaning: x.m,
      source: i % 3 === 0 ? 'Week 4 · Set 2' : i % 3 === 1 ? 'Week 3 · Set 1' : 'Week 2 · Set 1',
      divider: i < list.length - 1
    })) : /*#__PURE__*/React.createElement(EmptyState, {
      compact: true,
      icon: "search",
      title: "No matching terms",
      message: "Try a shorter word."
    })));
  }
  function Review({
    nav,
    course,
    phone,
    wide,
    admin
  }) {
    const [f, setF] = React.useState('all');
    const [confirm, setConfirm] = React.useState(false);
    const [cleared, setCleared] = React.useState(false);
    const counts = D.reviewCounts;
    const rows = cleared ? [] : D.review.filter(r => f === 'all' || r.status === f);
    const n = cleared ? 0 : counts[f];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(Page, {
      title: "Review",
      subtitle: `${(course || {}).code || 'NURS 214'} · what you missed or guessed`,
      onBack: nav.back,
      backLabel: "Course",
      phone: phone,
      wide: wide,
      admin: admin,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        margin: '0 -4px',
        padding: '0 4px'
      }
    }, [['all', 'All'], ['wrong', 'Missed'], ['partial', 'Partly right'], ['guessed', 'Guessed']].map(([id, l]) => /*#__PURE__*/React.createElement(FilterChip, {
      key: id,
      label: l,
      count: cleared ? 0 : counts[id],
      selected: f === id,
      onClick: () => setF(id)
    }))), !admin && n > 0 && /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      icon: "shuffle",
      onClick: () => nav.runSet(`Review · ${n} questions`)
    }, "Practice these ", n, " (shuffled)")), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: "inbox",
      title: "Nothing to review",
      message: "Questions you miss or flag as a guess show up here. They leave when you answer them fully right without guessing."
    })) : /*#__PURE__*/React.createElement(ListGroup, {
      footer: f === 'all' ? `Showing ${rows.length} of ${n}.` : undefined
    }, rows.map((r, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: admin ? undefined : () => nav.runSet(r.topic),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 16px',
        border: 'none',
        background: 'transparent',
        textAlign: 'left',
        cursor: admin ? 'default' : 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-body)',
        color: 'var(--text-1)'
      }
    }, r.topic), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-footnote)',
        color: 'var(--text-3)'
      }
    }, r.week, " \xB7 ", r.format), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-footnote)',
        color: 'var(--text-3)'
      }
    }, r.where)), /*#__PURE__*/React.createElement(StatusMark, {
      status: r.status,
      size: "sm"
    }), !admin && /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--text-4)",
      strokeWidth: 2
    })))), !admin && !cleared && /*#__PURE__*/React.createElement(Button, {
      variant: "plain",
      onClick: () => setConfirm(true),
      style: {
        color: 'var(--wrong)',
        alignSelf: 'center'
      }
    }, "Clear the review list")), /*#__PURE__*/React.createElement(ConfirmSheet, {
      contained: true,
      centered: wide,
      open: confirm,
      onDismiss: () => setConfirm(false),
      title: `Clear all ${counts.all} questions from this course’s Review list?`,
      message: "Your answers and scores are kept. Only the list is emptied.",
      actions: [{
        label: 'Clear',
        variant: 'destructive',
        onClick: () => {
          setCleared(true);
          setConfirm(false);
        }
      }, {
        label: 'Cancel',
        onClick: () => setConfirm(false)
      }]
    }));
  }
  Object.assign(window, {
    Page,
    SignIn,
    Home,
    Course,
    Terms,
    Review,
    ReadOnlyBanner
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qbank-app/Screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qbank-app/Screens2.jsx
try { (() => {
(() => {
  const {
    Button,
    Icon,
    TextField,
    SegmentedControl,
    ListGroup,
    ListRow,
    WeekCheckboxRow,
    IssueList,
    ConfirmSheet,
    PickerSelect,
    StatusMark
  } = window.QbankDesignSystem_4be789;
  const D = window.QB_DATA;

  // App icon mark (option A, "Q on accent") — follows data-palette. See assets/app-icons for the full set.
  function AppIconMark({
    size = 60
  }) {
    return /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: size,
        height: size,
        borderRadius: size * 0.2237,
        background: 'linear-gradient(180deg, var(--icon-top) 0%, var(--icon-bottom) 100%)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,.12), inset 0 0 0 0.5px rgba(255,255,255,.12)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: `700 ${size * 0.66}px/1 var(--font-display)`,
        letterSpacing: -size * 0.03,
        color: 'var(--icon-fg)',
        marginTop: -size * 0.04
      }
    }, "Q"));
  }
  function draw(weeks) {
    const total = weeks.reduce((s, w) => s + w.count, 0);
    if (total <= 40) return {
      n: total,
      minutes: Math.round(total * 1.5),
      per: Object.fromEntries(weeks.map(w => [w.id, w.count]))
    };
    const raw = weeks.map(w => ({
      id: w.id,
      x: w.count / total * 40
    }));
    const per = Object.fromEntries(raw.map(r => [r.id, Math.floor(r.x)]));
    let left = 40 - Object.values(per).reduce((a, b) => a + b, 0);
    raw.sort((a, b) => b.x % 1 - a.x % 1).forEach(r => {
      if (left > 0) {
        per[r.id]++;
        left--;
      }
    });
    return {
      n: 40,
      minutes: 60,
      per
    };
  }
  function ExamSetup({
    nav,
    phone,
    wide,
    admin
  }) {
    const [on, setOn] = React.useState({
      w1: true,
      w2: true,
      w3: true,
      w4: false
    });
    const picked = D.examWeeks.filter(w => on[w.id]);
    const d = draw(picked);
    const Page = window.Page;
    return /*#__PURE__*/React.createElement(Page, {
      title: "Exam",
      subtitle: "NURS 214 \xB7 Adult Health I",
      onBack: nav.back,
      backLabel: "Course",
      phone: phone,
      wide: wide,
      admin: admin,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement(ListGroup, {
      header: "Weeks this exam covers",
      footer: "Questions are drawn only from the weeks you tick, in proportion to each week\u2019s size."
    }, D.examWeeks.map(w => /*#__PURE__*/React.createElement(WeekCheckboxRow, {
      key: w.id,
      label: w.label,
      count: w.count,
      drawn: d.per[w.id],
      checked: !!on[w.id],
      onChange: v => setOn({
        ...on,
        [w.id]: v
      })
    }))), !admin && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: 16,
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-card), inset 0 0 0 0.5px var(--separator)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-title-2)',
        color: 'var(--text-1)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, d.n, " questions"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-callout)',
        color: 'var(--text-2)'
      }
    }, "in ", d.minutes, " minutes")), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-footnote)',
        color: 'var(--text-3)',
        textWrap: 'pretty'
      }
    }, picked.length ? picked.map(w => `${d.per[w.id]} from ${w.label}`).join(' · ') : 'Tick at least one week.', picked.length > 0 && d.n < 40 ? ' · Fewer than 40, so it’s all of them at 1.5 minutes each.' : ''), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-footnote)',
        color: 'var(--text-2)'
      }
    }, "Feedback comes at the end. Leaving midway ends the exam and scores what you answered."), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      disabled: !picked.length,
      onClick: () => nav.runExam(picked.map(w => w.label).join(', '))
    }, "Start exam")), /*#__PURE__*/React.createElement(ListGroup, {
      header: "Past exams"
    }, D.pastExams.map(e => /*#__PURE__*/React.createElement(ListRow, {
      key: e.id,
      title: `${e.weeks} · ${e.date}`,
      detail: `${e.minutes} min`,
      value: `${e.right} of ${e.total}`,
      chevron: true,
      onClick: () => {}
    }))));
  }
  const COURSE_OPTS = ['NURS 214 · Adult Health I', 'NURS 220 · Pharmacology', 'NURS 110 · Health Assessment', 'NURS 101 · Foundations', '+ New course'];
  const WEEK_OPTS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5 (new)', 'Weeks 1–3 (mixed)'];
  function Import({
    nav,
    phone,
    wide,
    admin
  }) {
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
    const load = k => {
      setSample(k);
      setChecked(null);
      setName(k === 'new' ? 'Set 2: Shock and perfusion' : 'Set 1: Anticoagulants');
    };
    const text = sample === 'bad' ? D.badJSON : D.sampleJSON;
    const clash = name.trim() === 'Set 1: Anticoagulants' && week === 3 && course === 0;
    const doImport = () => clash ? setSheet(true) : setDone('Imported');
    const lbl = {
      font: 'var(--weight-semibold) var(--size-footnote)/var(--lh-footnote) var(--font-mono)',
      color: 'var(--text-2)'
    };
    if (done) return /*#__PURE__*/React.createElement(Page, {
      title: "Import",
      phone: phone,
      wide: wide,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        textAlign: 'center',
        padding: '32px 0 8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'var(--correct-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: done === 'Imported' ? 'check' : 'rotate-ccw',
      size: 30,
      color: "var(--correct)",
      strokeWidth: 2.25
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        font: 'var(--text-title-1)',
        color: 'var(--text-1)'
      }
    }, done), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        font: 'var(--text-callout)',
        color: 'var(--text-2)',
        maxWidth: 340,
        textWrap: 'pretty'
      }
    }, "\u201C", name, "\u201D \xB7 ", sample === 'new' ? 8 : 12, " questions in ", COURSE_OPTS[course].split(' · ')[0], ", ", WEEK_OPTS[week], ".", done === 'Replaced' ? ' The previous version can be restored from the week’s page.' : '')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, !admin && /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      onClick: () => nav.runSet(`${WEEK_OPTS[week]} · ${name}`)
    }, "Practice the new set now"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      fullWidth: true,
      onClick: () => nav.openCourse()
    }, "Open the course"), /*#__PURE__*/React.createElement(Button, {
      variant: "plain",
      onClick: () => {
        setDone(null);
        setChecked(null);
      }
    }, "Import another file")));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(Page, {
      title: "Import",
      subtitle: admin ? 'Files go into her courses.' : undefined,
      phone: phone,
      wide: wide,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(SegmentedControl, {
      value: src,
      onChange: setSrc,
      options: [{
        value: 'paste',
        label: 'Paste JSON',
        icon: 'clipboard-paste'
      }, {
        value: 'file',
        label: 'Choose file',
        icon: 'file-json'
      }]
    }), src === 'paste' ? /*#__PURE__*/React.createElement(TextField, {
      multiline: true,
      mono: true,
      rows: 7,
      value: text,
      onChange: () => setChecked(null),
      placeholder: "Paste the JSON from your Firstmate"
    }) : /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 'var(--radius-sm)',
        border: '1px dashed var(--separator-strong)',
        background: 'var(--surface)',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "file-json",
      size: 24,
      color: "var(--tint)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-body)',
        color: 'var(--text-1)'
      }
    }, "week4-set2.json"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--text-footnote)',
        color: 'var(--text-3)'
      }
    }, "14 KB \xB7 from iCloud Drive"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        flexWrap: 'wrap',
        font: 'var(--text-caption)',
        color: 'var(--text-3)'
      }
    }, "Demo files:", [['new', 'New set'], ['bad', 'With errors'], ['fixed', 'Corrected set (replaces)']].map(([k, l]) => /*#__PURE__*/React.createElement(Button, {
      key: k,
      variant: sample === k ? 'secondary' : 'plain',
      size: "sm",
      onClick: () => load(k),
      style: {
        height: 26,
        padding: '0 8px',
        font: 'var(--weight-medium) var(--size-caption-1)/1 var(--font-ui)'
      }
    }, l)))), /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'grid',
        gridTemplateColumns: wide ? '1fr 1fr' : '1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl
    }, "Course"), /*#__PURE__*/React.createElement(PickerSelect, {
      options: COURSE_OPTS,
      value: course,
      onChange: setCourse
    })), /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lbl
    }, "Week"), /*#__PURE__*/React.createElement(PickerSelect, {
      options: WEEK_OPTS,
      value: week,
      onChange: setWeek
    })), course === COURSE_OPTS.length - 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextField, {
      label: "Course code",
      placeholder: "NURS 230"
    }), /*#__PURE__*/React.createElement(TextField, {
      label: "Course name",
      placeholder: "Maternal and Newborn Health"
    })), /*#__PURE__*/React.createElement(TextField, {
      label: "Set name",
      value: name,
      onChange: v => {
        setName(v);
      },
      hint: "Filled from the file\u2019s title. You can change it.",
      style: {
        gridColumn: '1 / -1'
      }
    })), /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, checked === 'ok' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        borderRadius: 'var(--radius-md)',
        background: 'var(--correct-soft)',
        boxShadow: 'inset 0 0 0 1px var(--correct-border)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        font: 'var(--text-headline)',
        color: 'var(--text-1)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check",
      size: 20,
      color: "var(--correct)",
      strokeWidth: 2
    }), "Ready: ", sample === 'new' ? '8 questions, 8 terms' : '12 questions, 9 terms'), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }
    }, (sample === 'new' ? ['1 single', '1 priority', '1 select all', '1 ordering', '1 matching', '1 matrix', '1 highlight', '1 drop-down'] : ['6 single', '3 select all', '2 matrix', '1 drop-down']).map(t => /*#__PURE__*/React.createElement("span", {
      key: t,
      style: {
        padding: '3px 8px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-raised)',
        font: 'var(--weight-medium) var(--size-caption-1)/var(--lh-caption-1) var(--font-mono)',
        color: 'var(--text-2)'
      }
    }, t)))), checked === 'error' && /*#__PURE__*/React.createElement(IssueList, {
      kind: "error",
      items: ['Question 4 (X04): missing takeaway', 'Question 9 (X09): select-all needs some but not all options marked ok'],
      onCopy: () => setCopied(true),
      copied: copied
    }), checked && sample !== 'bad' && /*#__PURE__*/React.createElement(IssueList, {
      kind: "warning",
      items: ['Question 6 (Q6): no src citation']
    }), checked === 'ok' ? /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      icon: "download",
      onClick: doImport
    }, "Import") : /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      onClick: () => {
        setCopied(false);
        setChecked(sample === 'bad' ? 'error' : 'ok');
      }
    }, "Check file"))), /*#__PURE__*/React.createElement(ConfirmSheet, {
      contained: true,
      centered: wide,
      open: sheet,
      onDismiss: () => setSheet(false),
      title: "Replace \u201CSet 1: Anticoagulants\u201D?",
      message: "NURS 214, Week 4 already has a set with this name. Replacing swaps its 12 questions for the 12 in this file. Answers on unchanged questions are kept, and the old version stays restorable.",
      actions: [{
        label: 'Replace',
        variant: 'primary',
        onClick: () => {
          setSheet(false);
          setDone('Replaced');
        }
      }, {
        label: 'Import as a separate set',
        variant: 'secondary',
        onClick: () => {
          setSheet(false);
          setDone('Imported');
        }
      }, {
        label: 'Cancel',
        onClick: () => setSheet(false)
      }]
    }));
  }
  function Settings({
    nav,
    phone,
    wide,
    admin,
    look,
    setLook
  }) {
    const Page = window.Page;
    const [confirmOut, setConfirmOut] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(Page, {
      title: "Settings",
      phone: phone,
      wide: wide,
      maxWidth: "var(--content-max)"
    }, /*#__PURE__*/React.createElement(ListGroup, {
      header: "Account"
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "user",
      title: admin ? 'daniel@example.com' : 'maya@example.com',
      detail: admin ? 'Admin' : 'Student'
    }), /*#__PURE__*/React.createElement(ListRow, {
      icon: "lock",
      title: "Change password",
      chevron: true,
      onClick: () => {}
    })), /*#__PURE__*/React.createElement(ListGroup, {
      header: "Passkeys",
      footer: "Passkeys let you sign in with Face ID or Touch ID."
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "key-round",
      title: "iPhone",
      detail: "Added Aug 30",
      accessory: /*#__PURE__*/React.createElement(Button, {
        variant: "plain",
        size: "sm"
      }, "Remove")
    }), /*#__PURE__*/React.createElement(ListRow, {
      icon: "key-round",
      title: "MacBook Air",
      detail: "Added Sep 2",
      accessory: /*#__PURE__*/React.createElement(Button, {
        variant: "plain",
        size: "sm"
      }, "Remove")
    }), /*#__PURE__*/React.createElement(ListRow, {
      icon: "plus",
      title: "Add a passkey",
      onClick: () => {}
    })), !admin && /*#__PURE__*/React.createElement(ListGroup, {
      header: "Semesters and courses",
      footer: "Rename, move between semesters, archive or unarchive a course. Courses can also be made from Import."
    }, D.semesters.map(s => /*#__PURE__*/React.createElement(ListRow, {
      key: s.id,
      icon: "graduation-cap",
      title: s.label,
      value: `${s.courses.length} ${s.courses.length === 1 ? 'course' : 'courses'}`,
      chevron: true,
      onClick: () => {}
    })), /*#__PURE__*/React.createElement(ListRow, {
      icon: "plus",
      title: "Add a semester",
      onClick: () => {}
    }), /*#__PURE__*/React.createElement(ListRow, {
      icon: "plus",
      title: "Add a course",
      onClick: () => {}
    })), /*#__PURE__*/React.createElement(ListGroup, {
      header: "Look"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12
      }
    }, /*#__PURE__*/React.createElement(SegmentedControl, {
      value: look,
      onChange: setLook,
      options: [{
        value: 'auto',
        label: 'Match device'
      }, {
        value: 'light',
        label: 'Light'
      }, {
        value: 'dark',
        label: 'Dark'
      }]
    }))), !admin && /*#__PURE__*/React.createElement(ListGroup, {
      footer: "Downloads your answers and progress as a JSON file."
    }, /*#__PURE__*/React.createElement(ListRow, {
      icon: "download",
      title: "Export my progress",
      onClick: () => {}
    })), /*#__PURE__*/React.createElement(ListGroup, null, /*#__PURE__*/React.createElement(ListRow, {
      icon: "log-out",
      title: "Sign out",
      destructive: true,
      onClick: () => setConfirmOut(true)
    }))), /*#__PURE__*/React.createElement(ConfirmSheet, {
      contained: true,
      centered: wide,
      open: confirmOut,
      onDismiss: () => setConfirmOut(false),
      title: "Sign out on this device?",
      message: "Your progress is saved on the server. You\u2019ll need your password or a passkey to sign back in.",
      actions: [{
        label: 'Sign out',
        variant: 'destructive',
        onClick: () => {
          setConfirmOut(false);
          nav.signOut();
        }
      }, {
        label: 'Cancel',
        onClick: () => setConfirmOut(false)
      }]
    }));
  }
  Object.assign(window, {
    AppIconMark,
    ExamSetup,
    Import,
    Settings
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qbank-app/Screens2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qbank-app/Shell.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
(() => {
  const {
    TabBar,
    Sidebar,
    SegmentedControl,
    ConfirmSheet,
    Icon
  } = window.QbankDesignSystem_4be789;
  const D = window.QB_DATA;
  const FRAMES = {
    iphone: {
      w: 402,
      h: 874
    },
    ipad: {
      w: 1180,
      h: 820
    },
    mac: {
      w: 1280,
      h: 800
    }
  };
  function useFit(frame, reserved = 64) {
    const [s, setS] = React.useState(1);
    React.useEffect(() => {
      const f = () => setS(Math.min((window.innerWidth - 32) / (frame.w + 28), (window.innerHeight - reserved - 24) / (frame.h + 28), 1));
      f();
      window.addEventListener('resize', f);
      return () => window.removeEventListener('resize', f);
    }, [frame.w, frame.h]);
    return s;
  }
  function IPadFrame({
    children,
    dark
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1180 + 28,
        height: 820 + 28,
        padding: 14,
        boxSizing: 'border-box',
        borderRadius: 42,
        background: '#1b1b1d',
        boxShadow: '0 30px 80px rgba(0,0,0,.25)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1180,
        height: 820,
        borderRadius: 26,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 24,
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 22px',
        font: '600 13px/1 -apple-system, system-ui',
        color: dark ? '#fff' : '#000',
        background: 'var(--bg-sidebar)',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 30,
        pointerEvents: 'none',
        backgroundColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement("span", null, "9:41 Mon Sep 28"), /*#__PURE__*/React.createElement("span", null, "100%")), children));
  }
  function MacFrame({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1280,
        height: 800,
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 0 0.5px rgba(0,0,0,.35), 0 30px 80px rgba(0,0,0,.28)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 38,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 14px',
        background: 'var(--bg-sidebar)',
        borderBottom: '0.5px solid var(--separator-strong)',
        position: 'relative'
      }
    }, ['#FF5F57', '#FEBC2E', '#28C840'].map(c => /*#__PURE__*/React.createElement("span", {
      key: c,
      style: {
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: c,
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,.15)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        font: 'var(--weight-semibold) 13px/1 var(--font-ui)',
        color: 'var(--text-2)',
        pointerEvents: 'none'
      }
    }, "Qbank")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }
    }, children));
  }
  function App() {
    const role = window.QB_ROLE || 'student';
    const admin = role === 'admin';
    const [device, setDevice] = React.useState(() => localStorage.getItem('qb-kit-device') || 'iphone');
    const [look, setLook] = React.useState(() => localStorage.getItem('qb-kit-look') || 'light');
    const [palette, setPalette] = React.useState(() => localStorage.getItem('qb-kit-palette') || 'dusk');
    React.useEffect(() => {
      localStorage.setItem('qb-kit-palette', palette);
      document.documentElement.setAttribute('data-palette', palette);
    }, [palette]);
    const [signedIn, setSignedIn] = React.useState(admin || localStorage.getItem('qb-kit-signed') === '1');
    const [offer, setOffer] = React.useState(false);
    const [tab, setTab] = React.useState('home');
    const home = D.semesters[1].courses[0];
    const [stacks, setStacks] = React.useState({
      home: [{
        name: 'home'
      }, {
        name: 'course',
        course: home
      }],
      import: [{
        name: 'import'
      }],
      settings: [{
        name: 'settings'
      }],
      admin: [{
        name: 'admin'
      }]
    });
    const [overlay, setOverlay] = React.useState(null);
    React.useEffect(() => localStorage.setItem('qb-kit-device', device), [device]);
    React.useEffect(() => localStorage.setItem('qb-kit-look', look), [look]);
    React.useEffect(() => localStorage.setItem('qb-kit-signed', signedIn ? '1' : '0'), [signedIn]);
    const osDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = look === 'auto' ? osDark ? 'dark' : 'light' : look; // kit resolves 'auto' itself; real app sets data-theme="auto"
    const phone = device === 'iphone',
      wide = !phone;
    const frame = FRAMES[device];
    const scale = useFit(frame);
    const stack = stacks[tab];
    const top = stack[stack.length - 1];
    const setStack = (t, s) => setStacks(all => ({
      ...all,
      [t]: s
    }));
    const nav = {
      push: (name, params) => setStack(tab, [...stack, {
        name,
        ...params
      }]),
      back: () => setStack(tab, stack.length > 1 ? stack.slice(0, -1) : stack),
      tab: t => {
        setTab(t);
      },
      openCourse: c => {
        setTab('home');
        setStack('home', [{
          name: 'home'
        }, {
          name: 'course',
          course: c || home
        }]);
      },
      runSet: title => setOverlay({
        kind: 'runner',
        mode: 'practice',
        title,
        questions: D.questions
      }),
      runExam: weeks => setOverlay({
        kind: 'runner',
        mode: 'exam',
        title: `Exam · ${weeks}`,
        questions: D.questions,
        seconds: Math.round(D.questions.length * 1.5 * 60)
      }),
      signOut: () => {
        setSignedIn(false);
        setTab('home');
      }
    };
    const selectSidebar = id => {
      const c = D.semesters.flatMap(s => s.courses).find(x => x.id === id);
      if (c) return nav.openCourse(c);
      setTab(id);
      if (id === 'home') setStack('home', [{
        name: 'home'
      }]);
    };
    const props = {
      nav,
      phone,
      wide,
      admin,
      look,
      setLook
    };
    const screens = {
      home: window.Home,
      course: window.Course,
      terms: window.Terms,
      review: window.Review,
      examSetup: window.ExamSetup,
      import: window.Import,
      settings: window.Settings,
      admin: window.AdminHome,
      adminWeeks: window.AdminWeeks,
      adminAccount: window.AdminAccount
    };
    const Screen = screens[top.name] || window.Home;
    const tabs = [{
      id: 'home',
      label: 'Home',
      icon: 'house'
    }, {
      id: 'import',
      label: 'Import',
      icon: 'file-input'
    }, ...(admin ? [{
      id: 'admin',
      label: 'Admin',
      icon: 'shield'
    }] : []), {
      id: 'settings',
      label: 'Settings',
      icon: 'settings'
    }];
    let content;
    if (!signedIn) {
      content = /*#__PURE__*/React.createElement(window.SignIn, {
        phone: phone,
        onSignedIn: first => {
          setSignedIn(true);
          if (first) setOffer(true);
        }
      });
    } else if (overlay && overlay.kind === 'runner') {
      content = /*#__PURE__*/React.createElement(window.Runner, _extends({
        key: overlay.title + overlay.mode
      }, overlay, {
        phone: phone,
        wide: wide,
        onExit: () => setOverlay(null),
        onFinish: result => setOverlay({
          kind: 'results',
          result
        })
      }));
    } else if (overlay && overlay.kind === 'results') {
      content = /*#__PURE__*/React.createElement(window.Results, {
        result: overlay.result,
        phone: phone,
        wide: wide,
        onDone: () => setOverlay(null),
        onReview: () => {
          setOverlay(null);
          nav.openCourse();
          setStack('home', [{
            name: 'home'
          }, {
            name: 'course',
            course: home
          }, {
            name: 'review',
            course: home
          }]);
        }
      });
    } else {
      const body = /*#__PURE__*/React.createElement(Screen, _extends({
        key: tab + stack.length + top.name
      }, props, top));
      content = phone ? /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          height: '100%'
        }
      }, body, /*#__PURE__*/React.createElement(TabBar, {
        contained: true,
        items: tabs,
        active: tab,
        onChange: t => t === tab ? setStack(t, stack.slice(0, 1)) : setTab(t)
      })) : /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          height: '100%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: '100%',
          boxSizing: 'border-box',
          paddingTop: device === 'ipad' ? 24 : 0,
          background: 'var(--bg-sidebar)'
        }
      }, /*#__PURE__*/React.createElement(Sidebar, {
        active: top.name === 'home' || tab !== 'home' ? tab : (stack.find(s => s.course) || {}).course?.id,
        onSelect: selectSidebar,
        nav: tabs,
        semesters: D.semesters.map(s => ({
          ...s,
          courses: s.courses.map(c => ({
            ...c
          }))
        })),
        footer: /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '8px 10px',
            font: 'var(--text-caption)',
            color: 'var(--text-3)'
          }
        }, admin ? 'Signed in as admin' : 'Synced · just now')
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0,
          position: 'relative',
          paddingTop: device === 'ipad' ? 24 : 0,
          background: 'var(--bg)'
        }
      }, body));
    }
    const screen = /*#__PURE__*/React.createElement("div", {
      "data-theme": theme,
      style: {
        height: '100%',
        background: 'var(--bg)',
        color: 'var(--text-1)',
        position: 'relative',
        font: 'var(--text-body)',
        paddingTop: device === 'ipad' && (!signedIn || overlay) ? 24 : 0,
        boxSizing: 'border-box'
      }
    }, content, /*#__PURE__*/React.createElement(ConfirmSheet, {
      contained: true,
      centered: wide,
      open: offer,
      onDismiss: () => setOffer(false),
      title: "Save a passkey for this device?",
      message: "Next time, sign in with Face ID instead of your password. You can remove it in Settings.",
      actions: [{
        label: 'Save a passkey',
        variant: 'primary',
        onClick: () => setOffer(false)
      }, {
        label: 'Not now',
        onClick: () => setOffer(false)
      }]
    }));
    const framed = device === 'iphone' ? /*#__PURE__*/React.createElement(window.IOSDevice, {
      dark: theme === 'dark'
    }, screen) : device === 'ipad' ? /*#__PURE__*/React.createElement(IPadFrame, {
      dark: theme === 'dark'
    }, screen) : /*#__PURE__*/React.createElement("div", {
      "data-theme": theme
    }, /*#__PURE__*/React.createElement(MacFrame, null, screen));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: theme === 'dark' ? '#0c0c0b' : '#E7E3DA'
      }
    }, /*#__PURE__*/React.createElement("div", {
      "data-theme": theme,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: '12px 16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: false,
      value: device,
      onChange: setDevice,
      options: [{
        value: 'iphone',
        label: 'iPhone'
      }, {
        value: 'ipad',
        label: 'iPad'
      }, {
        value: 'mac',
        label: 'Mac'
      }]
    }), /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: false,
      value: theme,
      onChange: setLook,
      options: [{
        value: 'light',
        label: 'Light',
        icon: 'sun'
      }, {
        value: 'dark',
        label: 'Dark',
        icon: 'moon'
      }]
    }), /*#__PURE__*/React.createElement(SegmentedControl, {
      fullWidth: false,
      value: palette,
      onChange: setPalette,
      options: [{
        value: 'pink',
        label: 'Pink'
      }, {
        value: 'ink',
        label: 'Ink'
      }, {
        value: 'earth',
        label: 'Earth'
      }, {
        value: 'dusk',
        label: 'Dusk'
      }]
    }), !admin && signedIn && /*#__PURE__*/React.createElement("button", {
      onClick: () => setSignedIn(false),
      style: {
        border: 'none',
        background: 'transparent',
        color: 'var(--text-3)',
        font: 'var(--text-footnote)',
        cursor: 'pointer'
      }
    }, "Show sign in")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: (frame.w + 28) * scale,
        height: (frame.h + 28) * scale,
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        padding: 14
      }
    }, framed)));
  }
  window.QbankApp = App;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qbank-app/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/qbank-app/data.js
try { (() => {
// Invented fixtures for the UI kit (per the PRD: no real course content). Not clinical advice.
window.QB_DATA = (() => {
  const semesters = [{
    id: 's1',
    num: 1,
    label: 'Semester 1',
    dates: 'May – Aug 2026',
    courses: [{
      id: 'n101',
      code: 'NURS 101',
      title: 'Foundations of Nursing Practice',
      questions: 61,
      weeks: 5,
      toReview: 4,
      progress: 1
    }, {
      id: 'n110',
      code: 'NURS 110',
      title: 'Health Assessment',
      questions: 86,
      weeks: 6,
      toReview: 9,
      progress: 0.92
    }]
  }, {
    id: 's2',
    num: 2,
    label: 'Semester 2',
    dates: 'Aug – Dec 2026',
    courses: [{
      id: 'n214',
      code: 'NURS 214',
      title: 'Adult Health I',
      questions: 68,
      weeks: 4,
      toReview: 19,
      progress: 0.62,
      terms: 41
    }, {
      id: 'n220',
      code: 'NURS 220',
      title: 'Pharmacology',
      questions: 29,
      weeks: 2,
      toReview: 3,
      progress: 0.34
    }]
  }, {
    id: 's3',
    num: 3,
    label: 'Semester 3',
    dates: 'Jan – Apr 2027',
    courses: []
  }];
  const weeks = [{
    id: 'w4',
    label: 'Week 4',
    count: 12,
    sets: [{
      id: 'set-shock',
      title: 'Set 2: Shock and perfusion',
      status: 'imported',
      count: 8
    }, {
      id: 'set-anticoag',
      title: 'Set 1: Anticoagulants',
      status: 'replaced',
      count: 12
    }]
  }, {
    id: 'w3',
    label: 'Week 3',
    count: 29,
    sets: [{
      id: 'set-hf',
      title: 'Set 1: Heart failure',
      status: 'done',
      detail: 'Done Sep 17 · 13 of 17 fully right'
    }, {
      id: 'set-dys',
      title: 'Set 2: Dysrhythmias',
      status: 'progress',
      detail: '7 of 12 answered'
    }]
  }, {
    id: 'w2',
    label: 'Week 2',
    count: 13,
    sets: [{
      id: 'set-ab',
      title: 'Set 1: Acid–base balance',
      status: 'done',
      detail: 'Done Sep 10 · 9 of 13 fully right'
    }]
  }, {
    id: 'w1',
    label: 'Week 1',
    count: 14,
    sets: [{
      id: 'set-fe',
      title: 'Set 1: Fluids and electrolytes',
      status: 'done',
      detail: 'Done Sep 3 · 11 of 14 fully right'
    }]
  }];
  const terms = {
    svr: ['Systemic vascular resistance (SVR)', 'How hard the blood vessels push back against the heart. Vasoconstriction raises it.'],
    lactate: ['Lactate', 'A by-product of cells working without enough oxygen. A rising level means tissues are under-perfused.'],
    pp: ['Pulse pressure', 'Systolic minus diastolic pressure. It narrows early in hypovolemic shock.'],
    preload: ['Preload', 'How much the ventricle is stretched by blood returning to the heart before it contracts.'],
    distributive: ['Distributive shock', 'Shock from widespread vasodilation, as in sepsis or anaphylaxis, rather than from fluid loss or pump failure.'],
    urticaria: ['Urticaria', 'Raised, itchy welts (hives) on the skin.'],
    stridor: ['Stridor', 'A high-pitched sound on breathing in, caused by a narrowed upper airway.'],
    oliguria: ['Oliguria', 'Low urine output, usually under 0.5 mL/kg per hour in adults.']
  };
  const questions = [{
    id: 'Q1',
    type: 'single',
    topic: 'Septic shock',
    cj: 'Take action',
    need: 'Physiological Adaptation',
    diff: 4,
    wk: 'Week 4',
    stem: 'A client admitted with pneumonia now has a blood pressure of 84/50 mm Hg, heart rate 124/min, temperature 39.2 °C, and a serum lactate of 4.2 mmol/L. New orders have just been entered.',
    ask: 'Which order should the nurse implement first?',
    options: [{
      t: 'Infuse 30 mL/kg of IV crystalloid',
      ok: true,
      why: 'Restoring circulating volume comes first; it is the first step of the sepsis bundle for hypotension or lactate ≥ 4.'
    }, {
      t: 'Start a norepinephrine infusion',
      why: 'A vasopressor follows if pressure stays low after fluids; it is not the first step.'
    }, {
      t: 'Collect a urine specimen for culture',
      why: 'Cultures matter, but blood cultures before antibiotics come ahead of urine, and none of these outrank perfusion.'
    }, {
      t: 'Give acetaminophen for the fever',
      why: 'Comfort measure; it does not address hypoperfusion.'
    }],
    rationale: 'Hypotension with a lactate of 4.2 signals tissue hypoperfusion. Fluid resuscitation restores preload and is the first action; vasopressors are added only if the mean arterial pressure stays under 65 mm Hg after fluids.',
    takeaway: 'Septic shock: fluids first, then pressors if the MAP stays under 65.',
    terms: ['lactate', 'preload']
  }, {
    id: 'Q2',
    type: 'sata',
    topic: 'Hypovolemic shock',
    cj: 'Recognize cues',
    need: 'Physiological Adaptation',
    diff: 4,
    wk: 'Week 4',
    stem: 'A client is 6 hours post-op after a bowel resection. The nurse suspects early hypovolemic shock.',
    ask: 'Which findings support this? Select all that apply.',
    options: [{
      t: 'Heart rate rising from 88 to 112/min',
      ok: true,
      why: 'Tachycardia is an early compensation for falling stroke volume.'
    }, {
      t: 'Cool, clammy skin',
      ok: true,
      why: 'Sympathetic vasoconstriction shunts blood away from the skin.'
    }, {
      t: 'Pulse pressure narrowing from 40 to 22 mm Hg',
      ok: true,
      why: 'Diastolic rises with vasoconstriction while systolic falls, so the gap narrows.'
    }, {
      t: 'Heart rate of 52/min',
      why: 'Bradycardia is a late, pre-arrest finding, not an early one.'
    }, {
      t: 'Urine output of 120 mL/hr',
      why: 'Output falls in shock as the kidneys conserve fluid.'
    }],
    rationale: 'Early shock is compensated: the heart speeds up and vessels constrict to hold blood pressure. Watch the trend in heart rate, skin, and pulse pressure before the blood pressure drops.',
    takeaway: 'Rising HR + narrowing pulse pressure = early shock, even with a normal BP.',
    terms: ['pp']
  }, {
    id: 'Q3',
    type: 'priority',
    topic: 'Prioritization',
    cj: 'Prioritize hypotheses',
    need: 'Management of Care',
    diff: 5,
    wk: 'Week 4',
    stem: 'The nurse receives report on four clients.',
    ask: 'Which client should the nurse see first?',
    options: [{
      t: 'A client who received IV cefazolin 10 minutes ago and now has hoarseness and stridor',
      ok: true,
      why: 'Stridor is an airway threat from possible anaphylaxis: airway first.'
    }, {
      t: 'A client with septic shock whose MAP is 66 mm Hg on norepinephrine',
      why: 'At goal and on treatment; stable for now.'
    }, {
      t: 'A client with heart failure who gained 1 kg overnight',
      why: 'Needs follow-up today, but not an emergency.'
    }, {
      t: 'A client 2 days post-op reporting incision pain of 6/10',
      why: 'Important, but pain does not outrank an airway.'
    }],
    rationale: 'New hoarseness and stridor minutes after an antibiotic point to anaphylaxis with airway swelling. Airway problems come before circulation problems that are already being treated.',
    takeaway: 'Stridor after a new drug = anaphylaxis until proven otherwise. Go now.',
    terms: ['stridor']
  }, {
    id: 'Q4',
    type: 'order',
    topic: 'Anaphylaxis',
    cj: 'Take action',
    need: 'Reduction of Risk Potential',
    diff: 4,
    wk: 'Week 4',
    stem: 'A client develops wheezing, urticaria, and a blood pressure of 86/48 mm Hg during an IV antibiotic infusion.',
    ask: 'Put the nurse’s actions in order, first to last.',
    items: ['Stop the antibiotic infusion', 'Assess airway and breathing', 'Give IM epinephrine as ordered', 'Reassess vital signs and response'],
    rationale: 'Remove the trigger first, then check the airway, then treat with epinephrine, then evaluate. Epinephrine should not wait on anything that is not the airway.',
    takeaway: 'Anaphylaxis: stop it, airway, epi, reassess.',
    terms: ['urticaria']
  }, {
    id: 'Q5',
    type: 'match',
    topic: 'Vasoactive drugs',
    cj: 'Analyze cues',
    need: 'Pharmacological Therapies',
    diff: 3,
    wk: 'Week 4',
    stem: 'The ICU nurse is reviewing the infusions for clients in shock.',
    ask: 'Match each drug to its main effect.',
    pairs: [{
      l: 'Norepinephrine',
      r: 'Raises SVR through vasoconstriction'
    }, {
      l: 'Dobutamine',
      r: 'Increases the heart’s contractility'
    }, {
      l: 'Nitroglycerin',
      r: 'Lowers preload through venous dilation'
    }],
    extra: ['Slows conduction through the AV node'],
    rationale: 'Norepinephrine acts mostly on alpha-1 receptors to tighten vessels. Dobutamine acts on beta-1 receptors to strengthen contraction. Nitroglycerin dilates veins so less blood returns to the heart.',
    takeaway: 'Squeeze vessels: norepinephrine. Squeeze the heart: dobutamine. Unload the heart: nitroglycerin.',
    terms: ['svr', 'preload']
  }, {
    id: 'Q6',
    type: 'matrix',
    topic: 'Cardiogenic shock',
    cj: 'Generate solutions',
    need: 'Physiological Adaptation',
    diff: 5,
    wk: 'Week 4',
    stem: 'A client with an anterior MI is in cardiogenic shock: BP 82/56 mm Hg, crackles to mid-lung fields, JVD, and cool extremities.',
    ask: 'For each intervention, choose whether it is indicated or contraindicated.',
    columns: ['Indicated', 'Contraindicated'],
    rows: [{
      label: '2 L normal saline bolus',
      ans: 1
    }, {
      label: 'Dobutamine infusion',
      ans: 0
    }, {
      label: 'Strict intake and output',
      ans: 0
    }, {
      label: 'Trendelenburg position',
      ans: 1
    }],
    rationale: 'The pump is failing and the lungs are already wet, so a large fluid bolus worsens congestion and Trendelenburg increases the work of breathing. Supporting contractility and tracking fluid balance help.',
    takeaway: 'Cardiogenic shock with crackles: support the pump, don’t flood it.',
    terms: []
  }, {
    id: 'Q7',
    type: 'highlight',
    topic: 'Perfusion',
    cj: 'Recognize cues',
    need: 'Reduction of Risk Potential',
    diff: 4,
    wk: 'Week 4',
    stem: 'Nurse’s note, 0400:',
    ask: 'Highlight the findings that need follow-up.',
    segments: [{
      t: 'Client alert and oriented ×4.'
    }, {
      t: 'BP 88/52 mm Hg,',
      ok: true
    }, {
      t: 'down from 118/74 at midnight.',
      plain: true
    }, {
      t: 'HR 118/min.',
      ok: true
    }, {
      t: 'Skin warm and dry.'
    }, {
      t: 'Urine output 20 mL over the last 2 hours.',
      ok: true
    }, {
      t: 'Reports mild thirst.'
    }],
    rationale: 'A falling blood pressure, a climbing heart rate, and oliguria together point to worsening perfusion. Mild thirst and warm, dry skin are not the concerning findings here.',
    takeaway: 'Trend matters: a BP that drops 30 points overnight needs a call, even if the client feels fine.',
    terms: ['oliguria']
  }, {
    id: 'Q8',
    type: 'cloze',
    topic: 'Shock types',
    cj: 'Analyze cues',
    need: 'Physiological Adaptation',
    diff: 3,
    wk: 'Week 4',
    stem: 'Minutes after a bee sting, a client has flushed skin, wheezing, and a blood pressure of 80/40 mm Hg.',
    ask: 'Complete the sentence.',
    template: 'The client is most likely in {0} shock, as shown by {1}.',
    blanks: [{
      opts: ['hypovolemic', 'cardiogenic', 'distributive'],
      ans: 2
    }, {
      opts: ['widespread vasodilation and bronchospasm', 'jugular vein distention and crackles', 'flat neck veins after bleeding'],
      ans: 0
    }],
    rationale: 'Anaphylaxis is a form of distributive shock: histamine dilates vessels everywhere and tightens the airways.',
    takeaway: 'Anaphylactic shock is distributive shock.',
    terms: ['distributive']
  }];
  const review = [{
    qid: 'Q3',
    topic: 'Prioritization',
    week: 'Week 4',
    format: 'Priority',
    status: 'wrong',
    where: 'Exam · Sep 20'
  }, {
    qid: 'Q2',
    topic: 'Hypovolemic shock',
    week: 'Week 4',
    format: 'Select all',
    status: 'partial',
    where: 'Set 2: Shock and perfusion · Today'
  }, {
    qid: 'Q6',
    topic: 'Cardiogenic shock',
    week: 'Week 4',
    format: 'Matrix',
    status: 'guessed',
    where: 'Set 2: Shock and perfusion · Today'
  }, {
    qid: 'Q1',
    topic: 'Heart failure diuretics',
    week: 'Week 3',
    format: 'Single answer',
    status: 'wrong',
    where: 'Set 1: Heart failure · Sep 17'
  }, {
    qid: 'Q4',
    topic: 'Digoxin toxicity',
    week: 'Week 3',
    format: 'Ordering',
    status: 'partial',
    where: 'Set 1: Heart failure · Sep 17'
  }, {
    qid: 'Q7',
    topic: 'Atrial fibrillation',
    week: 'Week 3',
    format: 'Highlight',
    status: 'guessed',
    where: 'Set 2: Dysrhythmias · Sep 19'
  }, {
    qid: 'Q5',
    topic: 'Metabolic acidosis',
    week: 'Week 2',
    format: 'Matching',
    status: 'wrong',
    where: 'Exam · Sep 20'
  }, {
    qid: 'Q8',
    topic: 'Hyperkalemia',
    week: 'Week 1',
    format: 'Drop-down',
    status: 'partial',
    where: 'Set 1: Fluids and electrolytes · Sep 3'
  }];
  const reviewCounts = {
    all: 19,
    wrong: 7,
    partial: 5,
    guessed: 7
  };
  const examWeeks = [{
    id: 'w1',
    label: 'Week 1',
    count: 14
  }, {
    id: 'w2',
    label: 'Week 2',
    count: 13
  }, {
    id: 'w3',
    label: 'Week 3',
    count: 29
  }, {
    id: 'w4',
    label: 'Week 4',
    count: 20
  }];
  const pastExams = [{
    id: 'e2',
    date: 'Sep 20',
    weeks: 'Weeks 1–3',
    right: 31,
    total: 40,
    minutes: 52
  }, {
    id: 'e1',
    date: 'Sep 12',
    weeks: 'Weeks 1–2',
    right: 20,
    total: 27,
    minutes: 38
  }];
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
  return {
    semesters,
    weeks,
    terms,
    questions,
    review,
    reviewCounts,
    examWeeks,
    pastExams,
    sampleJSON,
    badJSON
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qbank-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/qbank-app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return (
    /*#__PURE__*/
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    React.createElement("div", {
      "data-om-starter": "ios-frame",
      style: {
        width,
        height,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: dark ? '#000' : '#F2F2F7',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        fontFamily: '-apple-system, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 11,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 126,
        height: 37,
        borderRadius: 24,
        background: '#000',
        zIndex: 50
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }
    }, /*#__PURE__*/React.createElement(IOSStatusBar, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
      title: title,
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto'
      }
    }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 34,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 8,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 139,
        height: 5,
        borderRadius: 100,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
      }
    })))
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/qbank-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AnswerOption = __ds_scope.AnswerOption;

__ds_ns.ClozeBlank = __ds_scope.ClozeBlank;

__ds_ns.HighlightPassage = __ds_scope.HighlightPassage;

__ds_ns.PickerSelect = __ds_scope.PickerSelect;

__ds_ns.MatchRow = __ds_scope.MatchRow;

__ds_ns.MatrixGrid = __ds_scope.MatrixGrid;

__ds_ns.OrderingRow = __ds_scope.OrderingRow;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CheckboxBox = __ds_scope.CheckboxBox;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ListGroup = __ds_scope.ListGroup;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.StatusMark = __ds_scope.StatusMark;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.ConfirmSheet = __ds_scope.ConfirmSheet;

__ds_ns.CountdownTimer = __ds_scope.CountdownTimer;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.FeedbackBanner = __ds_scope.FeedbackBanner;

__ds_ns.IssueList = __ds_scope.IssueList;

__ds_ns.RationaleBlock = __ds_scope.RationaleBlock;

__ds_ns.TermDefinition = __ds_scope.TermDefinition;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.CourseCard = __ds_scope.CourseCard;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.SetRow = __ds_scope.SetRow;

__ds_ns.Tile = __ds_scope.Tile;

__ds_ns.WeekCheckboxRow = __ds_scope.WeekCheckboxRow;

})();
