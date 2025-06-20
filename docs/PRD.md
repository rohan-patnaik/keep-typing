<!-- PRD.md -->

# Product Requirements Document (keep-typing)

## 1. Overview
- **Purpose**: Distraction-free typing tests with real-time feedback.  
- **Scope & Non-Goals**:  
  – V1 MVP & V2 enhancements only (no competitor features).  
- **Success Metrics**:  
  – ≥80% accuracy within 2 s post-test summary.  
  – 200 weekly active users by week 12.

## 2. Phases & Epics

### Phase 1: MVP
- [ ] Typing Engine  
  • Modes: 30 s, 60 s  
  • Word counts: 25, 50  
  • Quote mode  
  • Normal difficulty (no auto-fail)  
- [ ] Customization  
  • Toggle punctuation & numbers  
  • Upload custom word list  
- [ ] Real-time Feedback  
  • Display WPM, raw WPM, accuracy  
  • Caps-lock warning  
- [ ] Results & Persistence  
  • Post-test summary chart  
  • Supabase Auth (sign-up/in)  
  • Store & display last 10 results  
- [ ] Theming & UI  
  • Light/dark switch  
  • Font selector  
  • Keyboard shortcuts (Enter/Esc)  
  • Responsive design

### Phase 2: Enhancements
- [ ] Strict difficulties (Expert/Master)  
- [ ] Extended modes & counts (15 s, 120 s; 75, 100 words)  
- [ ] Multi-language support & file import  
- [ ] Advanced analytics (consistency score, error heatmap)  
- [ ] Social features (leaderboards, shareable links)  
- [ ] Presets & tags library  
- [ ] Discord integration  
- [ ] Custom theme builder (palettes, backgrounds, fonts)  
- [ ] Accessibility (screen-reader, keyboard-only nav)  
- [ ] Monetization UI (Patreon/Ko-fi)

## 3. Non-Functional Requirements
- Performance: TTFB < 200 ms  
- Accessibility: WCAG 2.1 AA  
- Security: OWASP Top 10  
- Privacy: GDPR/CCPA compliance

## 4. Risks & Mitigations
- Supabase rate limits → SWR caching  
- Large word-list performance → virtualization & debounce  
- …

## 5. Automation
> GitHub Actions auto-ticks `phase-1`/`phase-2` checkboxes on merged PRs.