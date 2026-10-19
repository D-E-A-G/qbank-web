# Qbank student app — UI kit

An interactive recreation of the student app described in the PRD ([`docs/product-spec.md`](../../../../../docs/product-spec.md)). Open `index.html`. The toggles at the top switch between iPhone, iPad and Mac, and between light and dark.

- `Shell.jsx`: device frames, routing, the tab bar (iPhone) and sidebar (iPad/Mac), and the passkey offer.
- `Screens.jsx`: `Page` scaffold, SignIn, Home, Course, Terms, Review.
- `Screens2.jsx`: `AppIconMark`, ExamSetup (proportional draw), Import, Settings.
- `Runner.jsx`: practice and exam runner, and Results.
- `Question.jsx`: renderers for the 8 formats, the shuffle layout, and scoring (the PRD's rules).
- `data.js`: invented fixtures.
- `ios-frame.jsx`: the iPhone bezel.

Every UI primitive comes from the design-system bundle (`window.QbankDesignSystem_4be789`).
