<!-- docs/PRD.md -->
<!-- DeepseekR1 approach to be used here -->

# Product Requirements Document (keep-typing)

## 1. Overview
- **Purpose**: Distraction-free typing tests with real-time feedback  
- **Scope & Non-Goals**: 
  - V1 MVP: Core typing experience
  - V2 Enhancements: Social features & personalization
- **Success Metrics**:  
  - ≥ 80% accuracy within 2s post-test  
  - 200 WAU by week 12

---

## 2. UI Version Strategy
- **V1 (MVP)**: Core screens (Home, Auth, Summary, Leaderboard)
- **V2 (Enhanced)**: Adds Profile screen + V1/V2 toggle
- **Toggle Implementation**:
  - Visible during V2 development phase
  - Removed after V2 launch completion
- **Screen Progression**:
  ```mermaid
  flowchart TD
    A[Home] --> B{Auth}
    B --> C[Test]
    C --> D[Summary]
    A --> E[Leaderboard]
    A -->|V2| F[Profile]
  ```

---

## 3. Phase 1: MVP (Epics & Tickets)

### EPIC 1: Project Setup & CI  
- [x] #1 – Scaffold Next.js + TypeScript + ESLint + Tailwind  
- [x] #2 – Add `.gitignore` & `.env.example`  
- [x] #3 – Create config files  
- [x] #4 – Basic pages & global CSS  
- [x] #5 – Clean up docs  
- [x] #6 – Update `README.md`  
- [x] #7 – Bump Next.js  

### EPIC 2: Typing Engine & Real-Time Feedback  
- [x] #8 – Timer logic  
- [] #9 – WPM/accuracy calculations  
- [] #10 – TestScreen UI  
- [] #11 – Unit tests  

### EPIC 3: Authentication & Persistence  
- [ ] #12 – Supabase Auth integration  
- [ ] #13 – Results schema & API  
- [ ] #14 – Save/fetch results  
- [ ] #15 – SummaryScreen  
- [ ] #16 – E2E tests  

### EPIC 4: Core UI Implementation  
- [ ] #17 – Implement Home screen (V1)  
- [ ] #18 – Implement Auth screen  
- [ ] #19 – Implement Summary screen  
- [ ] #20 – Implement Leaderboard (V1)  

### EPIC 5: QA & Deployment  
- [ ] #21 – Final QA  
- [ ] #22 – Comprehensive tests  
- [ ] #23 – Vercel deployment  
- [ ] #24 – Monitoring setup  

---

## 4. Phase 2: Enhancements (V2)

### EPIC A: Profile & Personalization  
- [ ] #25 – User profile system  
- [ ] #26 – Achievement tracking  
- [ ] #27 – Level progression  

### EPIC B: Enhanced Social Features  
- [ ] #28 – Friends leaderboards  
- [ ] #29 – Result sharing  
- [ ] #30 – Activity feeds  

### EPIC C: UI Version Management  
- [ ] #31 – V1/V2 toggle component  
- [ ] #32 – Profile screen implementation  
- [ ] #33 – Enhanced Leaderboard (V2)  
- [ ] #34 – Toggle removal post-launch  

### EPIC D: Extended Settings  
- [ ] #35 – Theme builder  
- [ ] #36 – Preset management  
- [ ] #37 – Advanced stats  

---

## 5. Screen Specifications

### Home Screen (V1)
```ascii
╔═════════════════════════════════════════════════════════════════════════╗
║ keep-typing                                                             ║
╠═════════════════════════════════════════════════════════════════════════╣
║ [30s] [60s] [Custom]                                                    ║
║ Punctuation: [✓]  Numbers: [ ]                                          ║
╚═════════════════════════════════════════════════════════════════════════╝
```

### Home Screen (V2)
```ascii
╔═════════════════════════════════════════════════════════════════════════╗
║ keep-typing                                                             ║
╠═════════════════════════════════════════════════════════════════════════╣
║ [V1 ● ○ V2]                                                             ║
║ [30s] [60s] [Custom]                                                    ║
║ Punctuation: [✓]  Numbers: [ ]                                          ║
╚═════════════════════════════════════════════════════════════════════════╝
```

### Profile Screen (V2)
```ascii
╔═════════════════════════════════════════════════════════════════════════╗
║ rohan_patnaik | Lvl 38                                                  ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Tests: 427 | Accuracy: 90%                                              ║
║ 30s Best: 78 WPM                                                        ║
║ [██████████ 38% to next level]                                          ║
╚═════════════════════════════════════════════════════════════════════════╝
```

### Auth Screen
```ascii
╔═════════════════════════════════════════════════════════════════════════╗
║ Sign In ● ○ Sign Up                                                     ║
╠═════════════════════════════════════════════════════════════════════════╣
║ Email: [_________________]                                              ║
║ Password: [________________]                                            ║
║ [Continue]  [Google] [GitHub]                                           ║
╚═════════════════════════════════════════════════════════════════════════╝
```

### Summary Screen
```ascii
╔═════════════════════════════════════════════════════════════════════════╗
║ 72 WPM | 96% Accuracy                                                   ║
╠═════════════════════════════════════════════════════════════════════════╣
║ █▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█  (Simple chart)                                 ║
║ [Retry] [New Test]                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

### Leaderboard Screen
```ascii
╔═════════════════════════════════════════════════════════════════════════╗
║ 1. You: 72 WPM                                                          ║
║ 2. Alice: 70 WPM                                                        ║
║ 3. Bob: 68 WPM                                                          ║
╚═════════════════════════════════════════════════════════════════════════╝
```

---

## 6. Non-Functional Requirements
- **Performance**: TTFB < 200 ms  
- **Accessibility**: WCAG 2.1