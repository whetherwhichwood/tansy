# Body Double Virtual Space

A virtual body-doubling platform designed specifically for neurodivergent individuals who need external presence to maintain focus and motivation. Built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 Overview

Body doubling is a proven technique that helps individuals with ADHD, autism, and other neurodivergent conditions maintain focus and motivation by having another person present while working. This app provides a virtual, anonymous space where users can work alongside others without the pressure of social interaction.

## ✨ Features

### Core Features
- **Virtual Study Rooms**: Join anonymous rooms with other users working on similar tasks
- **Real-time Presence**: See other users working in real-time without personal information sharing
- **Focus Timers**: Synchronized Pomodoro-style timers for focused work sessions
- **Gentle Accountability**: Optional check-ins and progress sharing
- **Anonymous Interaction**: Complete privacy with no personal information required

### Neurodivergent-Friendly Design
- **Calm Interface**: Soothing colors and minimal distractions
- **Accessibility First**: WCAG 2.1 AA compliance with screen reader support
- **Customizable**: High contrast mode, large text, reduced motion options
- **Gentle Language**: Supportive, non-judgmental messaging throughout
- **Predictable Behavior**: Consistent, reliable interface patterns

### Room Categories
- **Work**: Professional tasks and deep work
- **Study**: Academic learning and research
- **Creative**: Art, writing, and creative projects
- **Cleaning**: Household tasks and organization
- **Other**: General productivity and miscellaneous tasks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser with WebRTC support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd body-double-app/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Real-time**: Socket.io for WebSocket communication
- **Animations**: Framer Motion for smooth transitions
- **UI Components**: Radix UI primitives

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── RoomCard.tsx    # Room display component
│   ├── Timer.tsx       # Focus timer component
│   └── UserPresence.tsx # User presence display
├── store/              # State management
│   ├── appStore.ts     # Main Zustand store
│   └── useMockData.ts  # Mock data hook
└── data/               # Static data
    └── mockData.ts     # Mock rooms and users
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (600) - Calm, professional
- **Success**: Green (500) - Positive feedback
- **Warning**: Yellow (500) - Gentle alerts
- **Error**: Red (500) - Critical issues
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Inter (system fallback)
- **Sizes**: Responsive scale from xs to 6xl
- **Line Heights**: Optimized for readability

### Accessibility
- **WCAG 2.1 AA Compliance**: Full accessibility support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and structure
- **High Contrast Mode**: Enhanced visibility options
- **Reduced Motion**: Respects user preferences

## 🔧 Development

### State Management
The app uses Zustand for state management with the following key stores:

- **User State**: Anonymous user information and preferences
- **Room State**: Available rooms and current room
- **Session State**: Focus sessions and progress tracking
- **Timer State**: Pomodoro timers and countdowns

### Component Architecture
- **Atomic Design**: Small, reusable components
- **Props Interface**: TypeScript interfaces for all props
- **Accessibility**: ARIA labels and keyboard support
- **Responsive**: Mobile-first design approach

### Real-time Features
- **WebSocket**: Socket.io for real-time communication
- **Presence**: User online/offline status
- **Synchronization**: Timer and session sync across users
- **Notifications**: Gentle alerts and reminders

## 🧪 Testing

### Manual Testing
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Mobile Devices**: iOS Safari, Android Chrome
- **Accessibility**: Screen reader testing
- **Performance**: Lighthouse audits

### Automated Testing
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build verification
npm run build
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://bodydouble.space
NEXT_PUBLIC_SOCKET_URL=wss://bodydouble.space
```

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

## 📱 PWA Features

### Progressive Web App
- **Offline Support**: Basic functionality without internet
- **Install Prompt**: Add to home screen
- **Push Notifications**: Gentle reminders and updates
- **Background Sync**: Sync when connection restored

### Manifest
- **App Name**: Body Double Virtual Space
- **Theme Color**: Indigo (600)
- **Icons**: Custom app icons for all sizes
- **Display**: Standalone mode

## 🔒 Privacy & Security

### Data Privacy
- **Anonymous Users**: No personal information collected
- **Local Storage**: User preferences stored locally
- **No Tracking**: No analytics or user behavior tracking
- **GDPR Compliant**: Full privacy regulation compliance

### Security Features
- **HTTPS Only**: All communications encrypted
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API protection against abuse
- **Content Moderation**: AI and human moderation

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript**: Strict typing required
- **ESLint**: Follow configured rules
- **Prettier**: Consistent code formatting
- **Accessibility**: WCAG 2.1 AA compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Neurodivergent Community**: For feedback and requirements
- **Body Doubling Research**: Based on proven therapeutic techniques
- **Accessibility Advocates**: For accessibility guidance
- **Open Source Community**: For amazing tools and libraries

## 📞 Support

For support, feature requests, or bug reports:
- **GitHub Issues**: Create an issue in the repository
- **Email**: support@bodydouble.space
- **Community**: Join our Discord server

---

**Built with ❤️ for the neurodivergent community**
