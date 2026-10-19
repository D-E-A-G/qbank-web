---
name: qbank-design
description: Use this skill to generate well-branded interfaces and assets for Qbank (a private NCLEX practice-question bank for one nursing student, plus an owner admin view), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the readme.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key files: `styles.css` (tokens entry), `tokens/*.css`, `components/**` (React primitives with `.d.ts` + `.prompt.md`), `ui_kits/qbank-app` and `ui_kits/qbank-admin` (full interactive screens), `assets/icons` (Lucide SVGs), `assets/app-icons`. The product spec lives at `docs/product-spec.md` in this repository (this skill's notes call it the PRD in README.md, where it lived when they were written).
