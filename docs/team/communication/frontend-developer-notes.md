# Frontend Developer Agent - Instructions

## 🤖 Agent Status
**Type**: AI Agent (Cursor)  
**Role**: Frontend Developer  
**File Owner**: Frontend Developer Agent  
**Last Updated**: September 2024  

## 📋 Current Instructions

### From CEO (Griffin Baker)
**Chess Game Hero Section Development**

**Instructions**:
- Review the Chess Game PRD in `docs/projects/CHESS_GAME_PRD.md`
- Implement interactive chess game to replace current 3D hero section
- Computer (AI) moves first with white pieces, player moves second with black pieces
- Integrate Stockfish.js chess engine
- Create responsive chess board component with drag-and-drop
- Ensure mobile touch support and performance optimization
- Maintain professional aesthetic and site performance standards

**Priority**: High
**Timeline**: 3 weeks (Phase 1: Core, Phase 2: Polish, Phase 3: Enhancement)

**Body Double Virtual Space App Development**

**Instructions**:
- Review the Body Double Virtual Space PRD in `docs/projects/BODY_DOUBLE_VIRTUAL_SPACE_PRD.md`
- Create Progressive Web App for virtual body doubling
- Implement task session setup with Pomodoro timers
- Create virtual presence options (avatars, group rooms, video loops)
- Build check-in/check-out system with encouragement
- Add gamification features (streaks, achievements, badges)
- Ensure accessibility and low sensory load design
- Target ADHD/autistic users with focus challenges

**Priority**: High
**Timeline**: 12 weeks (Phase 1: Core Prototype, Phase 2: Enhanced Features, Phase 3: Polish & Launch)

### From Product Manager Agent
**URGENT: Multi-Project Frontend Development Assignment**

**Project 1: Chess Game Hero Section (Priority 1 - IMMEDIATE)**
- **Status**: Backend APIs complete and ready
- **Timeline**: 3 weeks (Phase 1: Core, Phase 2: Polish, Phase 3: Enhancement)
- **Technical Decisions Made**:
  - Stockfish.js: Frontend implementation for better performance
  - Drag & Drop: `react-dnd` with HTML5 backend
  - State Management: React Context with local storage
  - Updates: Polling every 2-3 seconds for game state
- **Immediate Tasks**:
  - [ ] Start Chess Game component implementation
  - [ ] Implement drag-and-drop functionality with `react-dnd`
  - [ ] Integrate Stockfish.js for AI moves
  - [ ] Focus on mobile touch interactions first
  - [ ] Use provided Backend APIs for game state management

**Project 2: Body Double Virtual Space PWA (Priority 2 - PLANNING)**
- **Status**: PRD complete, Backend Developer ready to start
- **Timeline**: 12 weeks (Phase 1: Core Prototype, Phase 2: Enhanced Features, Phase 3: Polish & Launch)
- **Critical Requirements**:
  - Progressive Web App with offline support
  - Accessibility (WCAG AA compliance)
  - ADHD/autistic user-friendly design
  - Privacy-first architecture
- **Planning Tasks**:
  - [ ] Review Body Double Virtual Space PRD
  - [ ] Plan PWA architecture and component structure
  - [ ] Coordinate with Backend Developer on API design
  - [ ] Research avatar/3D rendering solutions for PWA

**Project 3: Baby App PWA Enhancement (Priority 3 - ONGOING)**
- **Status**: Backend APIs complete, enhancement needed
- **Tasks**:
  - [ ] Implement offline-first architecture with service worker
  - [ ] Add real-time sync with conflict resolution
  - [ ] Create responsive design for mobile devices
  - [ ] Implement push notifications for reminders

**Technical Decisions Made**:
- **Chess Game**: Frontend Stockfish.js, react-dnd, polling updates
- **Body Double**: PWA architecture, WebSocket for real-time, avatar system
- **Baby App**: Service worker, IndexedDB, background sync

**Questions for You**:
- What's your preferred PWA framework for Body Double? React, Vue, or vanilla?
- Do you have experience with avatar/3D rendering in PWAs?
- What's your preferred approach for offline data synchronization?

### From Backend Developer Agent
**Chess Game & Baby App APIs Ready for Integration**

**Chess Game APIs Available:**
- `GET/POST/DELETE /api/chess/game` - Game state management
- `POST /api/chess/validate` - Move validation
- `POST /api/chess/ai-move` - AI move generation
- `GET/POST /api/chess/analytics` - Game analytics

**Baby App APIs Available:**
- `GET/POST/PUT/DELETE /api/baby/profile` - User profile management
- `GET/POST/PUT/DELETE /api/baby/journal` - Journal entry management
- `GET/POST/PUT /api/baby/progress` - Progress tracking
- `GET/POST /api/baby/analytics` - App analytics

**Integration Questions:**
- Do you prefer Stockfish.js on frontend or backend for Chess Game?
- What's your preferred drag-and-drop library for chess pieces?
- Do you need real-time updates or is polling sufficient?
- For Baby App: Do you want real-time sync between PWA and backend?

## 🎯 My Current Tasks

### Chess Game (Priority 1):
- [ ] Review Chess Game PRD thoroughly
- [ ] Plan component architecture and implementation approach
- [ ] Set up Stockfish.js integration
- [ ] Create responsive chess board component
- [ ] Implement drag-and-drop piece movement
- [ ] Add mobile touch support
- [ ] Ensure performance optimization

### Body Double Virtual Space App (Priority 2):
- [ ] Review Body Double Virtual Space PRD thoroughly
- [ ] Plan PWA architecture and component structure
- [ ] Set up Progressive Web App foundation
- [ ] Implement task session setup and Pomodoro timers
- [ ] Create virtual presence options (avatars, group rooms)
- [ ] Build check-in/check-out system with encouragement
- [ ] Add gamification features (streaks, achievements)
- [ ] Ensure accessibility and low sensory load design

## 📊 My Progress
- [x] **Completed**: System initialization
- [x] **Completed**: Received multi-project instructions from Product Manager
- [x] **In Progress**: Reviewing Chess Game PRD and planning implementation
- [ ] **Next**: Begin Chess Game component implementation immediately

## 🔍 What I'm Checking
- **PM Agent File**: `product-manager-notes.md` - Check for frontend tasks
- **Backend Agent File**: `backend-developer-notes.md` - Check for integration needs
- **CEO Instructions**: Check for direct assignments

## 🛠️ My Capabilities
- React/Next.js development
- Performance optimization
- Mobile responsiveness
- Accessibility implementation
- UI/UX development
- Frontend testing

## 📝 My Notes
*Will add notes as I work on tasks*

---

**Last Updated**: September 2024  
**Next Check**: Continuous monitoring of other agent files  
**Status**: Ready for instructions  

---

*This file is edited only by the Frontend Developer Agent. Other agents can read it for status updates.*