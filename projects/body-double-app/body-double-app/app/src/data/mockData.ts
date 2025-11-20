import { Room, User } from '@/store/appStore'

export const mockUsers: User[] = [
  {
    id: 'user_1',
    anonymousId: 'anon_1',
    displayName: 'FocusFriend',
    avatarUrl: undefined,
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: 'user_2',
    anonymousId: 'anon_2',
    displayName: 'StudyBuddy',
    avatarUrl: undefined,
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: 'user_3',
    anonymousId: 'anon_3',
    displayName: 'WorkMate',
    avatarUrl: undefined,
    isOnline: false,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
]

export const mockRooms: Room[] = [
  {
    id: 'room_1',
    name: 'Deep Work Focus',
    description: 'Quiet space for intense concentration and deep work sessions',
    category: 'work',
    maxCapacity: 6,
    currentCapacity: 3,
    isActive: true,
    participants: [mockUsers[0], mockUsers[1]],
  },
  {
    id: 'room_2',
    name: 'Study Session',
    description: 'Academic study room for students and learners',
    category: 'study',
    maxCapacity: 8,
    currentCapacity: 5,
    isActive: true,
    participants: [mockUsers[1], mockUsers[2]],
  },
  {
    id: 'room_3',
    name: 'Creative Flow',
    description: 'Inspiration space for artists, writers, and creatives',
    category: 'creative',
    maxCapacity: 4,
    currentCapacity: 2,
    isActive: true,
    participants: [mockUsers[0]],
  },
  {
    id: 'room_4',
    name: 'Home Reset',
    description: 'Body doubling for cleaning, organizing, and household tasks',
    category: 'cleaning',
    maxCapacity: 6,
    currentCapacity: 1,
    isActive: true,
    participants: [],
  },
  {
    id: 'room_5',
    name: 'Morning Routine',
    description: 'Start your day with gentle accountability and structure',
    category: 'other',
    maxCapacity: 8,
    currentCapacity: 4,
    isActive: true,
    participants: [mockUsers[0], mockUsers[1], mockUsers[2]],
  },
  {
    id: 'room_6',
    name: 'Evening Wind-down',
    description: 'Peaceful space for evening tasks and gentle productivity',
    category: 'other',
    maxCapacity: 6,
    currentCapacity: 0,
    isActive: true,
    participants: [],
  },
]

export const roomCategories = [
  { value: 'work', label: 'Work', icon: '💼', color: 'blue' },
  { value: 'study', label: 'Study', icon: '📚', color: 'green' },
  { value: 'creative', label: 'Creative', icon: '🎨', color: 'purple' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹', color: 'orange' },
  { value: 'other', label: 'Other', icon: '💡', color: 'gray' },
]

export const workStyles = [
  { value: 'quiet', label: 'Quiet', description: 'Silent focus, no music or sounds' },
  { value: 'music', label: 'Music', description: 'Ambient music and gentle sounds' },
  { value: 'check-ins', label: 'Check-ins', description: 'Regular gentle check-ins and encouragement' },
]

export const timerPresets = [
  { duration: 25 * 60, label: 'Pomodoro (25min)', type: 'work' as const },
  { duration: 50 * 60, label: 'Deep Focus (50min)', type: 'work' as const },
  { duration: 90 * 60, label: 'Long Session (90min)', type: 'work' as const },
  { duration: 5 * 60, label: 'Short Break (5min)', type: 'break' as const },
  { duration: 15 * 60, label: 'Long Break (15min)', type: 'break' as const },
]

export const encouragementMessages = [
  "You're doing great! Keep going! 🌟",
  "Every step counts. You've got this! 💪",
  "Focus is a muscle. You're strengthening it! 🧠",
  "You're not alone in this journey! 🤝",
  "Small progress is still progress! 🎯",
  "Your future self will thank you! 🙏",
  "You're building something amazing! 🏗️",
  "Consistency is key. You're showing up! ⭐",
  "Every moment of focus is a victory! 🏆",
  "You're creating positive momentum! 🚀",
]

export const accessibilityFeatures = [
  {
    id: 'high-contrast',
    name: 'High Contrast Mode',
    description: 'Increases contrast for better visibility',
    enabled: false,
  },
  {
    id: 'large-text',
    name: 'Large Text',
    description: 'Increases text size for better readability',
    enabled: false,
  },
  {
    id: 'reduced-motion',
    name: 'Reduced Motion',
    description: 'Reduces animations and transitions',
    enabled: false,
  },
  {
    id: 'screen-reader',
    name: 'Screen Reader Support',
    description: 'Optimizes for screen reader compatibility',
    enabled: false,
  },
]
