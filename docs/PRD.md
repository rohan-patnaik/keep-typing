<!-- docs/PRD.md -->

# Product Requirements Document (keep-typing)

## 1. Overview
- **Purpose**: Distraction-free typing tests with real-time feedback  
- **Scope & Non-Goals**: V1 MVP & V2 enhancements (no competitor features)  
- **Success Metrics**:  
  - ≥ 80 % accuracy within 2 s post-test  
  - 200 WAU by week 12

---

## 2. Phase 1: MVP (Epics & Tickets)

### EPIC 1: Project Setup & CI  
- [x] #1 – Scaffold Next.js + TypeScript + ESLint + Tailwind  
- [x] #2 – Add `.gitignore` & `.env.example`  
- [x] #3 – Create config files (package.json, tsconfig.json, next.config.js, tailwind.config.js, postcss.config.js, .eslintrc.json, .prettierrc)  
- [x] #4 – Basic pages & global CSS (`_app.tsx`, `index.tsx`, `globals.css`)  
- [x] #5 – Clean up docs (remove `ARCHITECTURE_SETUP.md`, fix `UX_UI_Sketches.md`)  
- [x] #6 – Update `README.md` to reflect new structure  
- [x] #7 – Bump Next.js → ≥ 14.2.30 to patch critical vulnerabilities  

### EPIC 2: Typing Engine & Real-Time Feedback  
- [ ] #8 – Timer logic for 30 s & 60 s modes  
- [ ] #9 – Compute WPM, raw WPM & accuracy  
- [ ] #10 – Build TestScreen UI + keyboard events (start/pause, caps-lock warning)  
- [ ] #11 – Unit tests for engine logic (Jest)

### EPIC 3: Authentication & Persistence  
- [ ] #12 – Integrate Supabase Auth (sign-up/in)  
- [ ] #13 – Define results schema & API endpoints  
- [ ] #14 – Save & fetch last 10 results  
- [ ] #15 – Build SummaryScreen + results chart  
- [ ] #16 – End-to-end tests for full flow (Cypress)

### EPIC 4: Customization & Theming  
- [ ] #17 – Toggle punctuation & numbers  
- [ ] #18 – Upload custom word list  
- [ ] #19 – Light/dark mode & font selector  
- [ ] #20 – Keyboard shortcuts & responsive design

### EPIC 5: QA & Deployment  
- [ ] #21 – Final QA & code review  
- [ ] #22 – Comprehensive tests (unit + E2E)  
- [ ] #23 – CI/CD → Vercel deploy & custom domain  
- [ ] #24 – Monitoring → Sentry & Plausible

---

## 3. Phase 2: Enhancements (Epics broken into tickets)

### EPIC A: Expert/Master difficulty  
- [ ] #25 – Add Expert difficulty (auto-fail on mistakes threshold)  
- [ ] #26 – Add Master difficulty (stricter rules & penalties)  
- [ ] #27 – Configurable mistake thresholds

### EPIC B: Extended modes & word counts  
- [ ] #28 – Add 15 s & 120 s time modes  
- [ ] #29 – Add 75 & 100 word-count modes  
- [ ] #30 – UI to select extended modes

### EPIC C: Multi-language & file import  
- [ ] #31 – Add Spanish & French word lists  
- [ ] #32 – File import (txt, docx) for custom tests  
- [ ] #33 – Language selector UI

### EPIC D: Advanced analytics  
- [ ] #34 – Compute consistency score & display  
- [ ] #35 – Generate error heatmap  
- [ ] #36 – Analytics visualization component

### EPIC E: Social features  
- [ ] #37 – Global leaderboards  
- [ ] #38 – Friends leaderboards  
- [ ] #39 – Shareable result links

### EPIC F: Theme builder & presets  
- [ ] #40 – Custom palette builder  
- [ ] #41 – Save & load theme presets  
- [ ] #42 – GUI theme builder interface

### EPIC G: Accessibility & keyboard-only nav  
- [ ] #43 – Screen-reader support  
- [ ] #44 – Full keyboard navigation (tabindex)  
- [ ] #45 – ARIA labels & semantic markup

### EPIC H: Monetization UI  
- [ ] #46 – Patreon integration flow  
- [ ] #47 – Ko-fi integration flow  
- [ ] #48 – Donation button UI

---

## 4. Non-Functional Requirements
- Performance: TTFB < 200 ms  
- Accessibility: WCAG 2.1 AA  
- Security: OWASP Top 10  
- Privacy: GDPR/CCPA compliance

---

## 5. Automation
> A GitHub Action will scan merged PRs for ticket numbers (#1–#48) and auto-tick checkboxes in this file.