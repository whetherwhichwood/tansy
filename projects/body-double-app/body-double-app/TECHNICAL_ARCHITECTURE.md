# Body Double Virtual Space - Technical Architecture

## System Overview

The Body Double Virtual Space is a real-time, anonymous body-doubling platform built as a Progressive Web App (PWA) with WebRTC for real-time communication and WebSocket for presence management.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Real-time**: Socket.io client for WebSocket communication
- **Video/Audio**: WebRTC for peer-to-peer communication
- **Animations**: Framer Motion for smooth transitions
- **PWA**: Next.js PWA plugin for offline functionality

### Backend
- **Framework**: Next.js 14 API routes
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for WebSocket server
- **Authentication**: NextAuth.js with anonymous sessions
- **File Storage**: AWS S3 for user avatars and assets
- **Caching**: Redis for session management and real-time data
- **Queue**: Bull Queue for background tasks

### Infrastructure
- **Hosting**: Vercel for frontend and API
- **Database**: Supabase PostgreSQL
- **Redis**: Upstash Redis
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry for error tracking
- **Analytics**: Vercel Analytics
- **Security**: Cloudflare for DDoS protection

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP DEFAULT NOW(),
  is_online BOOLEAN DEFAULT FALSE
);
```

### Rooms Table
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  max_capacity INTEGER DEFAULT 8,
  current_capacity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Room Participants Table
```sql
CREATE TABLE room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(room_id, user_id)
);
```

### Focus Sessions Table
```sql
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration_minutes INTEGER,
  goals TEXT[],
  achievements TEXT[],
  is_completed BOOLEAN DEFAULT FALSE
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  work_style VARCHAR(50), -- 'quiet', 'music', 'check-ins'
  preferred_room_categories TEXT[],
  notification_settings JSONB DEFAULT '{}',
  accessibility_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Real-time Architecture

### WebSocket Events

#### Client to Server
```typescript
// Room events
'join-room': { roomId: string, userPreferences: UserPreferences }
'leave-room': { roomId: string }
'update-presence': { roomId: string, status: 'working' | 'break' | 'away' }

// Focus session events
'start-focus-session': { roomId: string, goals: string[] }
'update-progress': { sessionId: string, progress: number }
'complete-session': { sessionId: string, achievements: string[] }

// Timer events
'start-timer': { roomId: string, duration: number, type: 'work' | 'break' }
'pause-timer': { roomId: string }
'reset-timer': { roomId: string }
```

#### Server to Client
```typescript
// Room events
'room-joined': { room: Room, participants: Participant[] }
'room-left': { roomId: string }
'participant-joined': { participant: Participant }
'participant-left': { participantId: string }

// Focus session events
'focus-session-started': { session: FocusSession }
'focus-session-updated': { session: FocusSession }
'focus-session-completed': { session: FocusSession }

// Timer events
'timer-started': { roomId: string, duration: number, type: string }
'timer-updated': { roomId: string, remaining: number }
'timer-completed': { roomId: string, type: string }
```

## API Endpoints

### Authentication
```typescript
POST /api/auth/anonymous
GET /api/auth/session
POST /api/auth/logout
```

### Rooms
```typescript
GET /api/rooms - List available rooms
POST /api/rooms - Create new room
GET /api/rooms/[id] - Get room details
POST /api/rooms/[id]/join - Join room
POST /api/rooms/[id]/leave - Leave room
```

### Users
```typescript
GET /api/users/profile - Get user profile
PUT /api/users/profile - Update user profile
GET /api/users/preferences - Get user preferences
PUT /api/users/preferences - Update user preferences
```

### Focus Sessions
```typescript
POST /api/sessions - Start new focus session
GET /api/sessions/[id] - Get session details
PUT /api/sessions/[id] - Update session
POST /api/sessions/[id]/complete - Complete session
GET /api/sessions/history - Get user's session history
```

## Security Architecture

### Data Privacy
- **Anonymous IDs**: No personal information stored
- **Data Encryption**: All data encrypted in transit and at rest
- **GDPR Compliance**: Full compliance with privacy regulations
- **Data Retention**: Automatic deletion of old data
- **Audit Logging**: All actions logged for security monitoring

### Authentication & Authorization
- **Anonymous Sessions**: JWT tokens for anonymous users
- **Session Management**: Redis-based session storage
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Zod schemas for all API inputs
- **CORS Configuration**: Proper CORS settings for security

### Real-time Security
- **Room Validation**: Verify user permissions before room access
- **Message Filtering**: Filter inappropriate content
- **Connection Limits**: Limit concurrent connections per user
- **IP Blocking**: Block malicious IP addresses

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component with WebP
- **Bundle Analysis**: Regular bundle size monitoring
- **Lazy Loading**: Intersection Observer for animations
- **Service Worker**: Offline functionality and caching

### Backend Optimization
- **Database Indexing**: Optimized indexes for common queries
- **Query Optimization**: Efficient database queries
- **Caching Strategy**: Redis caching for frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Background Jobs**: Queue system for heavy tasks

### Real-time Optimization
- **Room Management**: Efficient room state management
- **Message Batching**: Batch WebSocket messages when possible
- **Connection Pooling**: Efficient WebSocket connections
- **Memory Management**: Proper cleanup of disconnected users
- **Load Balancing**: Distribute load across multiple instances

## Monitoring & Analytics

### Error Tracking
- **Sentry Integration**: Real-time error tracking
- **Error Boundaries**: React error boundaries for graceful failures
- **Log Aggregation**: Centralized logging system
- **Alert System**: Automated alerts for critical errors

### Performance Monitoring
- **Web Vitals**: Core Web Vitals monitoring
- **Real-time Metrics**: WebSocket connection metrics
- **Database Performance**: Query performance monitoring
- **User Analytics**: Anonymous usage analytics

### Business Metrics
- **User Engagement**: Daily/monthly active users
- **Session Metrics**: Average session duration, completion rates
- **Room Metrics**: Room utilization, user satisfaction
- **Revenue Metrics**: Subscription rates, churn analysis

## Deployment Architecture

### Development Environment
- **Local Development**: Docker Compose for local services
- **Database**: Local PostgreSQL instance
- **Redis**: Local Redis instance
- **Hot Reload**: Next.js development server

### Staging Environment
- **Vercel Preview**: Automatic deployments from feature branches
- **Database**: Supabase staging database
- **Redis**: Upstash staging instance
- **Testing**: Automated testing pipeline

### Production Environment
- **Vercel Production**: Main production deployment
- **Database**: Supabase production database
- **Redis**: Upstash production instance
- **CDN**: Vercel Edge Network
- **Monitoring**: Full monitoring and alerting

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: No server-side state storage
- **Load Balancing**: Distribute load across multiple instances
- **Database Scaling**: Read replicas for database queries
- **Redis Clustering**: Redis cluster for session management

### Vertical Scaling
- **Resource Optimization**: Efficient memory and CPU usage
- **Database Optimization**: Query optimization and indexing
- **Caching Strategy**: Multi-layer caching system
- **Background Processing**: Queue system for heavy tasks

## Disaster Recovery

### Backup Strategy
- **Database Backups**: Daily automated backups
- **Code Backups**: Git repository with multiple remotes
- **Configuration Backups**: Infrastructure as code
- **User Data**: Encrypted backups with retention policies

### Recovery Procedures
- **Database Recovery**: Point-in-time recovery procedures
- **Service Recovery**: Automated service restart procedures
- **Data Recovery**: Data restoration from backups
- **Communication**: User notification procedures

## Security Considerations

### Data Protection
- **Encryption**: AES-256 encryption for sensitive data
- **Key Management**: Secure key rotation and management
- **Access Control**: Role-based access control
- **Audit Trails**: Comprehensive audit logging

### Network Security
- **HTTPS**: SSL/TLS encryption for all communications
- **WAF**: Web Application Firewall for protection
- **DDoS Protection**: Cloudflare DDoS protection
- **Rate Limiting**: API rate limiting and throttling

---

**Document Version**: 1.0  
**Last Updated**: September 2024  
**Next Review**: October 2024  
**Owner**: Product Manager  
**Stakeholders**: Frontend Developer, Backend Developer, CEO
