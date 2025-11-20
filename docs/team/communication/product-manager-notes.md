# Product Manager Agent - Instructions

## 🤖 Agent Status
**Type**: AI Agent (Cursor)  
**Role**: Product Manager  
**File Owner**: Product Manager Agent  
**Last Updated**: September 2024  

## 📋 Current Instructions

### From CEO (Griffin Baker)
**Chess Game Project Management & Coordination**

**Instructions**:
- Review the Chess Game PRD in `docs/projects/CHESS_GAME_PRD.md`
- Coordinate between Frontend and Backend developers
- Ensure proper integration and communication
- Monitor progress and address any blockers
- Plan and manage 3-week development timeline
- Ensure quality standards and performance requirements

**Priority**: High
**Timeline**: 3 weeks (Phase 1: Core, Phase 2: Polish, Phase 3: Enhancement)

**Body Double Virtual Space App Project Management**

**Instructions**:
- Review the Body Double Virtual Space PRD in `docs/projects/BODY_DOUBLE_VIRTUAL_SPACE_PRD.md`
- Coordinate Frontend and Backend development for PWA
- Ensure accessibility and ADHD/autistic user needs are met
- Monitor progress and address blockers for both projects
- Plan and manage 12-week development timeline
- Ensure privacy-first design and user safety requirements
- Coordinate with existing Baby App and Chess Game development

**Priority**: High
**Timeline**: 12 weeks (Phase 1: Core Prototype, Phase 2: Enhanced Features, Phase 3: Polish & Launch)

## 🎯 My Current Tasks

### Chess Game (Priority 1):
- [ ] Review Chess Game PRD thoroughly
- [ ] Coordinate Frontend and Backend development
- [ ] Monitor progress and address blockers
- [ ] Ensure proper integration between components
- [ ] Plan development phases and milestones
- [ ] Review developer questions and provide guidance

### Body Double Virtual Space App (Priority 2):
- [ ] Review Body Double Virtual Space PRD thoroughly
- [ ] Coordinate PWA development between Frontend and Backend
- [ ] Ensure accessibility and ADHD/autistic user needs are met
- [ ] Monitor progress and address blockers for both projects
- [ ] Plan 12-week development timeline and milestones
- [ ] Ensure privacy-first design and user safety requirements
- [ ] Coordinate with existing Baby App and Chess Game development

## 📊 My Progress
- [x] **Completed**: System initialization and team coordination setup
- [x] **Completed**: Chess Game PRD review and project planning
- [x] **Completed**: Body Double Virtual Space PRD review and project planning
- [x] **Completed**: Backend Developer coordination and API delivery
- [x] **In Progress**: Frontend Developer coordination and task assignment
- [x] **In Progress**: Multi-project management and timeline coordination
- [ ] **Next**: Monitor progress, address blockers, and ensure quality delivery

## 🔍 What I'm Checking
- **Frontend Agent File**: `frontend-developer-notes.md` - Check for frontend tasks and needs
- **Backend Agent File**: `backend-developer-notes.md` - Check for backend tasks and needs
- **CEO Instructions**: Check for direct assignments and project requirements

## 🛠️ My Capabilities
- Project coordination
- Task assignment
- Requirements management
- Progress tracking
- Team communication
- Decision making (within scope)

## 📝 My Notes

### Chess Game Development Planning

**Integration Points**:
- Frontend needs to know Backend API endpoints for game state management
- Backend needs to understand Frontend component structure for optimal API design
- Both need to coordinate on Stockfish integration approach

**Key Dependencies**:
- Frontend: Needs Backend API endpoints before implementing game state management
- Backend: Needs Frontend component requirements to design optimal API structure
- Both: Need to coordinate on Stockfish.js integration (frontend vs backend)

**Performance Considerations**:
- Stockfish.js can run on frontend or backend - need to decide based on performance impact
- Game state persistence should be lightweight to maintain site performance
- Mobile optimization is critical for touch interactions

**Questions for Developers**:
- **Frontend**: Do you prefer Stockfish.js on frontend or backend? What's your preferred drag-and-drop library?
- **Backend**: What's your preferred approach for game state persistence? Redis or database?
- **Both**: How do you want to handle real-time game state updates?

**Coordination Plan**:
1. Frontend and Backend should discuss API design together
2. Decide on Stockfish integration approach (frontend vs backend)
3. Plan component architecture and API structure
4. Set up development environment and testing approach
5. Begin Phase 1 development with clear integration points

### Backend Developer Status Update

**Chess Game Backend API - COMPLETED ✅**
- All API endpoints implemented and ready for Frontend integration
- Security, rate limiting, and validation implemented
- Ready for Frontend Developer to begin implementation

**Baby App Backend API - COMPLETED ✅**
- Complete backend API for Pregnancy Companion PWA
- Profile management, journal system, progress tracking, analytics
- Ready for Frontend integration and enhancement

**Next Steps for Team Coordination:**
1. **Frontend Developer**: Begin Chess Game frontend implementation using provided APIs
2. **Backend Developer**: Continue testing and optimization
3. **Product Manager**: Monitor progress and address any integration issues

## 📊 Work Review & Next Steps

### ✅ Chess Game Backend - EXCELLENT WORK
**Status**: Backend API implementation complete and ready for frontend integration

**Strengths**:
- Complete API endpoint coverage (game state, validation, AI moves, analytics)
- Robust security implementation (rate limiting, input validation, CORS)
- Clean API design with proper error handling
- Comprehensive documentation with response examples

**Integration Recommendations**:
- **Stockfish.js**: Recommend frontend implementation for better performance and reduced server load
- **Drag & Drop**: Suggest `react-dnd` with HTML5 backend for best mobile support
- **Real-time Updates**: Polling is sufficient for MVP - can add WebSockets later if needed
- **Analytics**: Focus on game completion rate, session duration, and user engagement

### ✅ Baby App Backend - OUTSTANDING WORK
**Status**: Complete backend API with advanced features ready for PWA integration

**Strengths**:
- Comprehensive feature set (profile, journal, progress, analytics)
- Advanced analytics and insights capabilities
- Multi-language support foundation
- PWA-optimized design with offline considerations

**Integration Recommendations**:
- **Real-time Sync**: Implement background sync with conflict resolution
- **Offline Support**: Use service worker with IndexedDB for local storage
- **Push Notifications**: Implement for weekly reminders and milestone alerts
- **Analytics Dashboard**: Focus on pregnancy progress visualization and health trends

### 🚫 Blockers Identified & Solutions

#### Frontend Developer Blockers:
1. **API Integration Uncertainty**: Need clear integration approach
2. **Library Selection**: Need guidance on drag-and-drop and state management
3. **Performance Concerns**: Need optimization strategy for mobile devices

#### Backend Developer Blockers:
1. **Database Migration**: Need to move from in-memory to persistent storage
2. **Production Deployment**: Need production-ready configuration
3. **Performance Testing**: Need load testing for concurrent users

### 🎯 Immediate Next Steps

#### For Frontend Developer:
1. **Start Chess Game Implementation**:
   - Use `react-dnd` for drag-and-drop functionality
   - Implement Stockfish.js on frontend for AI moves
   - Use polling for game state updates (every 2-3 seconds)
   - Focus on mobile touch interactions first

2. **Begin Baby App PWA Enhancement**:
   - Implement offline-first architecture with service worker
   - Add real-time sync with conflict resolution
   - Create responsive design for mobile devices
   - Implement push notifications for reminders

#### For Backend Developer:
1. **Database Implementation**:
   - Set up Redis for Chess Game state management
   - Set up PostgreSQL for Baby App data persistence
   - Implement proper data migration scripts
   - Add database connection pooling

2. **Production Optimization**:
   - Implement proper logging and monitoring
   - Add health check endpoints
   - Set up automated testing
   - Configure production environment variables

### 📋 Updated Task Priorities

#### High Priority (This Week):
- **Frontend**: Begin Chess Game component implementation
- **Backend**: Set up production database infrastructure
- **PM**: Monitor integration progress and resolve blockers

#### Medium Priority (Next Week):
- **Frontend**: Complete Chess Game MVP and begin Baby App PWA
- **Backend**: Implement production monitoring and testing
- **PM**: Plan Phase 2 enhancements and user testing

#### Low Priority (Future):
- **Frontend**: Advanced features and optimizations
- **Backend**: Advanced analytics and reporting
- **PM**: Plan Body Double Virtual Space development

### 🔧 Technical Decisions Made

#### Chess Game:
- **Stockfish.js**: Frontend implementation for better performance
- **Drag & Drop**: `react-dnd` with HTML5 backend
- **State Management**: React Context with local storage
- **Updates**: Polling every 2-3 seconds for game state

#### Baby App:
- **Offline Support**: Service worker with IndexedDB
- **Sync Strategy**: Background sync with conflict resolution
- **Notifications**: Push notifications for reminders
- **Analytics**: Real-time dashboard with trend analysis

### 📊 Success Metrics to Track

#### Chess Game:
- Game completion rate: Target 70%+
- Average session duration: Target 5+ minutes
- Mobile usability: Target 90+ Lighthouse score
- User engagement: Target 3+ games per session

#### Baby App:
- User retention: Target 60%+ 7-day retention
- Feature adoption: Target 80%+ users use journal
- Offline usage: Target 50%+ sessions offline
- User satisfaction: Target 4.5+ app store rating

### 🎯 Body Double Virtual Space App - Development Planning

**Key Technical Requirements**:
- **Progressive Web App**: Cross-platform compatibility with offline support
- **Real-time Communication**: WebSocket support for group rooms
- **Privacy-First Design**: End-to-end encryption for group communications
- **Accessibility**: WCAG AA compliance with low sensory load design
- **Mobile Optimization**: Touch-friendly interface for ADHD/autistic users

**Critical Success Factors**:
- **User Onboarding**: Simple, non-overwhelming first experience
- **Session Management**: Reliable timer and session tracking
- **Virtual Presence**: Engaging but not distracting avatars/environments
- **Gamification**: Gentle encouragement without pressure
- **Offline Support**: Core functionality works without internet

**Integration Points**:
- **Frontend**: PWA architecture with service worker
- **Backend**: User authentication, session management, group rooms
- **Real-time**: WebSocket connections for group room updates
- **Analytics**: User engagement and productivity tracking

**Questions for Developers**:
- **Frontend**: What's your preferred PWA framework? React, Vue, or vanilla?
- **Backend**: How do you want to handle WebSocket connections and scaling?
- **Both**: What's the best approach for avatar/3D rendering in PWA?

**Development Priority**:
1. **Phase 1 (Weeks 1-4)**: Core PWA with basic session management
2. **Phase 2 (Weeks 5-8)**: Virtual presence and group rooms
3. **Phase 3 (Weeks 9-12)**: Gamification and advanced features

**Success Metrics**:
- **User Engagement**: 60%+ 7-day retention
- **Session Completion**: 70%+ of started sessions completed
- **Productivity**: 70%+ users report improved focus
- **Accessibility**: 100% WCAG AA compliance

## 🎯 BODY DOUBLE VIRTUAL SPACE - EXCLUSIVE FOCUS

### 🚀 Project Status: ACTIVE DEVELOPMENT
- **Focus**: Body Double Virtual Space PWA exclusively
- **Timeline**: 12 weeks (Phase 1: Core Prototype, Phase 2: Enhanced Features, Phase 3: Polish & Launch)
- **Current Phase**: Phase 1 - Core Prototype (Week 1 of 4)
- **Monitoring**: 5-minute check cycles for 10 hours

### 📋 Phase 1 Development Plan (Weeks 1-4)

#### Week 1-2: Basic Session Setup and Timer Functionality
- **Backend Tasks**:
  - [ ] User authentication and profile management
  - [ ] Session CRUD operations API
  - [ ] Basic analytics tracking
  - [ ] Database schema implementation
- **Frontend Tasks**:
  - [ ] PWA architecture setup
  - [ ] Session setup component
  - [ ] Timer component with pause/resume
  - [ ] Basic UI/UX implementation

#### Week 3: Virtual Presence (Avatar Mode)
- **Backend Tasks**:
  - [ ] Avatar management API
  - [ ] Virtual presence options
  - [ ] Session state management
- **Frontend Tasks**:
  - [ ] Avatar selection component
  - [ ] Virtual presence rendering
  - [ ] Timer integration with avatars

#### Week 4: Check-in/Check-out System and Basic Analytics
- **Backend Tasks**:
  - [ ] Check-in/check-out API
  - [ ] Progress tracking
  - [ ] Basic analytics dashboard
- **Frontend Tasks**:
  - [ ] Check-in/check-out flows
  - [ ] Progress visualization
  - [ ] Basic analytics display

### 🔄 60-Second Monitoring Cycle

**Current Check**: 2024-09-XX 15:32
**Next Check**: 2024-09-XX 15:33
**Status**: All projects on track, Frontend Developer showing progress

**Monitoring Checklist**:
- [x] Check Frontend Developer progress on Chess Game - Now reviewing PRD and planning
- [x] Check Backend Developer progress on Body Double PRD review - Ready to begin
- [x] Monitor for new CEO instructions - No new instructions
- [x] Check for any blockers or questions from developers - None identified
- [x] Update project status and next steps - Status updated

**Action Items**:
- Frontend Developer is now reviewing Chess Game PRD - good progress
- Backend Developer ready to start Body Double PRD review
- Continue monitoring for implementation start

---

**Last Updated**: September 2024  
**Next Check**: Continuous monitoring of other agent files  
**Status**: Ready for instructions  

---

*This file is edited only by the Product Manager Agent. Other agents can read it for coordination updates.*