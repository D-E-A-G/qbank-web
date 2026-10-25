# Qbank design system

Design system for **Qbank**, a small private NCLEX practice-question bank for one nursing student in an accelerated BSN program, plus a read-only-ish admin view for the owner, who built it. It is an installable web app (PWA) on iPhone, iPad and Mac today, and this system is shaped so a SwiftUI app could follow without a redesign.

**Source:** the PRD, now the product spec at [`docs/product-spec.md`](../../../docs/product-spec.md) in this repository. The repo has no app code yet, so the PRD was the only input. There were no Figma files, brand assets or logos. Read the PRD again before designing a new screen: it spells out every state, the copy, and the scoring rules.

The display name **"Qbank"** and the app icon are working choices made here. The PRD leaves them open, so change them freely.

---

## Products and surfaces

| Surface | Who | Layout |
|---|---|---|
| Student app | The student | iPhone: one column with bottom tabs (Home, Import, Settings). iPad and Mac: a sidebar with the nav plus the Semester › Course tree, and content sized to the screen. |
| Owner admin | The owner | The same app with an Admin tab. Her screens are shown read-only with a banner. Admin covers Semesters and courses, Weeks, Her password, and Repair. |

Core screens: Sign in (with a passkey offer), Home, Course, Practice runner (8 question formats), Set results, Review, Terms, Exam setup, Exam (timed), Exam result, Import (check, errors, replace, done), Settings, and Admin.

### UX notes on the PRD (changes I made or suggest)
1. **Feedback banner sits above the answers.** After "Check answer", the verdict appears right under the ask, so she sees it without scrolling. Each option's reason appears on that option, and the rationale, takeaway and terms follow below. The primary button stays pinned to the bottom of the screen.
2. **"I'm guessing" sits next to the commit action** as a plum checkbox under the answers, and hides once checked. The banner then repeats "Flagged as a guess — it stays in Review".
3. **Ending an exam uses a confirmation sheet**, not the runner's "second tap". A second tap is easy to trigger by accident with a thumb, and iOS swipe-back could end an exam. The sheet says how many answers will be scored. The swipe-back gesture should also be disabled in exam mode.
4. **Course page puts the newest week first** and adds a "Pick up where you left off" row for an in-progress set. This is a suggestion; drop it if it feels like study planning.
5. **Ordering uses up/down buttons plus a drag grip.** Drag-only sorting is unreliable on touch and for VoiceOver.
6. **Matrix is stacked on iPhone** (a row card with pill choices) and **shown as a table on iPad/Mac**. A 3-column table at 390pt wide crushes the row labels.
7. **The runner goes full-screen on iPad/Mac too.** The sidebar hides while she answers, and the reading column is capped at 720px.
8. Import on iPhone keeps a primary tab as the PRD says. The Home screen also has a `+` shortcut, so the tab could later be demoted.

---

## CONTENT FUNDAMENTALS

The voice is **plain, calm and honest**, like a good clinical instructor writing on a sticky note.

- **Second person, present tense.** "You'll need your password or a passkey to sign back in." Admin copy says **"her"** ("Her progress, read-only", "Reset her password"), because the owner is acting for someone else.
- **Sentence case everywhere**: buttons, titles, sheet titles. Title Case is never used. Small uppercase appears only in list-group headers and option state tags ("YOUR ANSWER · CORRECT"), and only through CSS.
- **Verbs first on buttons:** Check answer, Submit and continue, Skip for now, Practice these 19 (shuffled), Copy these for your agent, Restore, Import as a separate set.
- **State scores as numbers, without judgement:** "13 of 17 fully right", "2 of 4 points", "7 of 12 answered". No "Great job!", no "Oops". Misses are "Not correct" or "Missed", never "Wrong!".
- **Confirmations name exactly what changes and what doesn't:** "Clear all 12 questions from this course's Review list?" followed by "Your answers and scores are kept. Only the list is emptied." Cancel is always last and always changes nothing.
- **Errors are written so she can paste them back to your agent:** `Question 4 (X04): missing takeaway`. They name the question's position and its id.
- **Review is a to-do list, not a penalty:** "Questions you miss or flag as a guess show up here. They leave when you answer them fully right without guessing."
- **No emoji, no exclamation marks, no streaks, badges or confetti.** Unicode is limited to typographic marks (· – — ’ ×) and the minus sign in "−1 for each wrong one".
- **Clinical content** (stems, rationales) keeps its units and abbreviations exactly: "BP 88/52 mm Hg", "30 mL/kg", "MAP under 65". Terms get a plain-language definition in one sentence.
- Dates are short: "Sep 24", "Today", "Imported today".

---

## VISUAL FOUNDATIONS

**Mood:** warm paper with one accent. Four palettes ship: **Pink** (bubblegum — friendly, happy), **Ink** (ink blue — quieter, bookish) **Earth** (salmon/peach with lavender, from the "Palette Earth" sunset — soft, warm) and **Dusk** (default — mauve with peach, from "Violet Dusk"; moody, plush). Pick with `data-palette="pink"|"ink"|"earth"|"dusk"` on `<html>`; everything else stays identical. It should feel like a friendly study desk, not a textbook or a hospital portal. Low contrast between surfaces, full contrast for text.

- **Color.** Warm paper neutrals (`--paper-*`, #0C0C0B → #FFFFFF) with a single accent read through `--tint`. Pink palette: `#C93D74` light / `#F07AA6` dark. Ink palette: `#36598A` light / `#9DB6D6` dark. Earth palette: `#C2573F` light / `#F0977E` dark. Dusk palette: `#7C3F60` light / `#C994AE` dark. Never reference `--pink-*` or `--ink-*` directly — use `--tint`, `--tint-soft`, `--accent-*` so both palettes work. Answer states are shared: **sage** (correct), **amber** (partly right), **brick** (not correct); **guessed** is periwinkle in Pink, plum in Ink, lavender in Earth and peach in Dusk so it never collides with the accent. Each state has a text/icon color, a `-border` and a `-soft` fill. **A state is never shown by color alone** — always an icon + a word; missed-correct also gets a dashed border.
- **Dark mode** is a full second palette, not inverted colors: canvas `#0C0C0B`, cards `#151412`, raised `#1C1B18`, text `#F3EFE8`, muted `#B8B2A8`. Surfaces get lighter as they rise instead of casting shadows. Light: canvas `#F7F4EE`, cards `#FFFFFF`, secondary `#EDE8DF`, text `#1C1B18`, muted `#5C5750`. Light is the default; `[data-theme="dark"]` forces dark on any element, `data-theme="auto"` follows the OS.
- **Type.** **SF Pro** (the system font) for all text, sized to **Apple Dynamic Type (Large)**: 34/28/22/20/17/16/15/13/12/11 — so every style maps 1:1 to a SwiftUI `Font.TextStyle`. Stems, rationales and terms use the reading styles (same face, 18/28 on phone and 20/31 on iPad/Mac); that generous leading is for long reading sessions. **SF Mono** for small labels and numbers: footnote (13), caption (12/11), badges, timers, scores, JSON and import errors. Off Apple platforms the fallbacks are Inter and JetBrains Mono from Google Fonts.
- **Spacing** is on a 4-pt grid. Gutters are 16 on phone and 24 on tablet, with 12 between options or cards and 32 between sections. The minimum hit target is 44.
- **Corner radii** are 6 (checkbox), 10 (buttons, inputs, answer options), 14 (cards, grouped lists, tiles), 20 (sheet tops) and pill (chips, timer). Use `.continuous` corners in SwiftUI.
- **Cards** have a `--surface` fill, a 0.5px inset hairline (`--separator`) and a very faint two-layer shadow in light mode. In dark mode there is no shadow. There are no colored left borders and no gradients inside the UI. The one exception is the app icon's subtle vertical sky gradient.
- **Lists** follow the iOS inset-grouped pattern: an uppercase footnote header, rows with hairline separators inset 16 from the left, and a footnote below.
- **Backgrounds** are flat paper. There are no images, textures, patterns or illustrations. It is a study tool, and the content is the only imagery.
- **Transparency and blur** appear only on bars: the tab bar, nav bar and runner header/footer use `--material` with `saturate(180%) blur(20px)`. Sheets sit on a 32% (light) or 50% (dark) scrim.
- **Motion** is calm with no bounce: 100ms for press, 180ms for select or check, 260ms for the feedback reveal, and 420ms for sheets (`--ease-sheet`, iOS-like). There is nothing celebratory. Respect Reduce Motion.
- **Press states:** fills darken one step (`--tint-pressed`, `--surface-pressed`) and buttons scale to 0.98. **Hover** (Mac only) shows sidebar rows as `--surface-pressed`. **Focus** uses a 2px `--focus-ring` outline, and inputs add a 3px soft tint ring.
- **Selection** uses a `--tint-soft` fill plus a 1.5px tint border. Revealed states use the matching `-soft` fill plus a 1.5px state border, and "missed" uses a 1.5px dashed sage border.
- **Layout by device:** iPhone uses bottom tabs and a full-screen runner. iPad and Mac use a 280px sidebar with the content max width at 1040 for grids and 720 for reading. The runner hides the sidebar. Sheets become centered dialogs on wide screens.
- **Timer** is a pill with a timer icon. At 5 minutes or less it switches to a triangle-alert icon, brick text and a brick-soft fill, and the word "left" is always shown.

### SwiftUI carry-over
Every color token is a hex value with light and dark counterparts, ready for an asset catalog (`bg`, `surface`, `text1`, `tint`, `correct`, …). Type tokens map 1:1 to `Font.TextStyle` (the comments in `tokens/typography.css`), and the reading styles are `.body` with `.fontDesign(.serif)` and custom line spacing. Components map to native controls: ListGroup → `List(.insetGrouped)`, SegmentedControl → `Picker(.segmented)`, PickerSelect → `Menu`/`Picker`, ConfirmSheet → `.confirmationDialog`/`.sheet(detents:)`, Sidebar → `NavigationSplitView`, TabBar → `TabView`.

---

## ICONOGRAPHY

- **Set:** [Lucide](https://lucide.dev) v0.460.0 (ISC). The PRD specifies no icon system. Lucide was chosen because its 24-grid outline style is the closest open match to **SF Symbols**, which the native app would use. The 65 glyphs in use were copied into `assets/icons/*.svg` and compiled into the `Icon` component (`components/core/Icon.jsx`), so nothing loads from a CDN.
- **Style:** outline, round caps and joins, 1.75 stroke by default and 2 for small or state icons, `currentColor`. Sizes are 16 (captions), 18–20 (rows), 22–26 (tiles, tabs, banners). The PRD asks for no filled icons except the radio dot.
- **No emoji, no icon font, no PNG icons.** Unicode appears only as punctuation.
- **Meaning is fixed:** circle-check = correct, circle-minus = partly right, circle-x = not correct, flag = guessed, circle = not answered or not started, inbox = Review, book-open = Terms, timer = Exam, file-input = Import, rotate-ccw = Restore or replaced, shield = Admin, eye = read-only, key-round = passkey, wrench = Repair.
- **SF Symbols mapping for native:** house, square.and.arrow.down, gearshape, shield, checkmark.circle, minus.circle, xmark.circle, flag, tray, book, timer, arrow.counterclockwise, key, faceid, wrench.adjustable, eye.
- **Logo:** none was provided. "Qbank" is set in type, and five **app icon options** are in `assets/app-icons/app-icons.html`. Option A (SF Pro Q on the accent, shown in all four palettes) is used in the kits and follows `data-palette`.

---

## Index

| Path | What |
|---|---|
| `styles.css` | Entry point; `@import`s only |
| `tokens/colors.css` | Palette + semantic light/dark tokens |
| `tokens/typography.css` | Font stacks, Dynamic Type scale, reading styles |
| `tokens/spacing.css` | Spacing, radii, borders, elevation, motion, layout |
| `tokens/fonts.css` | Inter + JetBrains Mono web fallbacks (Google Fonts import) |
| `tokens/base.css` | Body, link, focus, selection defaults |
| `guidelines/*.html` | Foundation specimen cards (Colors, Type, Spacing, Brand) |
| `components/` | React primitives (below) |
| `ui_kits/qbank-app/` | Interactive student app: iPhone / iPad / Mac, light / dark |
| `ui_kits/qbank-admin/` | Interactive owner admin, the same shell with role=admin |
| `assets/icons/` | Lucide SVGs |
| `assets/fonts/` | (empty — drop self-hosted woff2 here) |
| `assets/app-icons/` | App icon options |
| `SKILL.md` | Agent-skill entry |
| `github.md` | Source repo association |

### Components
- **core/**: `Icon`, `Button`, `TextField`, `Checkbox` (+ `CheckboxBox`), `SegmentedControl`, `ProgressBar`, `ListGroup` (+ `ListRow`), `StatusMark`
- **study/**: `CourseCard`, `SetRow`, `Tile`, `FilterChip`, `WeekCheckboxRow`
- **answers/**: `AnswerOption`, `OrderingRow`, `MatchRow` (+ `PickerSelect`), `MatrixGrid`, `HighlightPassage`, `ClozeBlank`
- **feedback/**: `FeedbackBanner`, `RationaleBlock`, `TermDefinition`, `CountdownTimer`, `ConfirmSheet`, `IssueList`, `EmptyState`
- **navigation/**: `TabBar`, `Sidebar`, `NavBar`

The PRD's "shared building blocks" list defines the domain set (course card through empty states), and all of it is built.

### Intentional additions
These are not in the PRD's list, but the screens need them:
- `Icon`: wrapper for the copied Lucide glyphs.
- `Button`, `TextField`, `Checkbox`, `SegmentedControl`, `ProgressBar`: basic controls that every screen uses.
- `ListGroup`/`ListRow`: the iOS grouped list used in Settings, Admin and the week groups.
- `StatusMark`: the icon + word status, so states never rely on color alone.
- `PickerSelect`: the native picker shared by Matching, Drop-down and Import.
- `TabBar`, `Sidebar`, `NavBar`: the navigation described in "Platforms and layouts".

### UI kits
- `ui_kits/qbank-app/index.html`: sign in → passkey offer → lands on the last course. From there: Home, Course (tiles, week sets, Restore), the runner with all 8 formats, Results, Review (filters, Clear), Terms, Exam setup (proportional draw), timed Exam (skip, End exam), Exam result, Import (check, errors, Copy for your agent, replace warning, done) and Settings (Look control switches the theme). Use the device and theme toggles at the top.
- `ui_kits/qbank-admin/index.html`: the owner's view. Her screens carry a read-only banner. Admin has Semesters and courses, Fix a week, Her password, and Repair with a confirmation.

All question content in the kits is invented fixture data, per the PRD. It is not clinical advice.
