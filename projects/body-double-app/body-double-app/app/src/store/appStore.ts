import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  anonymousId: string
  displayName: string
  avatarUrl?: string
  isOnline: boolean
  lastSeen: Date
}

export interface Room {
  id: string
  name: string
  description: string
  category: 'work' | 'study' | 'creative' | 'cleaning' | 'other'
  maxCapacity: number
  currentCapacity: number
  isActive: boolean
  participants: User[]
}

export interface FocusSession {
  id: string
  roomId: string
  userId: string
  startedAt: Date
  endedAt?: Date
  durationMinutes?: number
  goals: string[]
  achievements: string[]
  isCompleted: boolean
}

export interface Timer {
  id: string
  roomId: string
  duration: number
  remaining: number
  type: 'work' | 'break'
  isRunning: boolean
  isPaused: boolean
}

export interface UserPreferences {
  workStyle: 'quiet' | 'music' | 'check-ins'
  preferredRoomCategories: string[]
  notificationSettings: {
    breakReminders: boolean
    goalReminders: boolean
    achievementCelebrations: boolean
  }
  accessibilitySettings: {
    highContrast: boolean
    largeText: boolean
    reducedMotion: boolean
    screenReader: boolean
  }
}

interface AppState {
  // User state
  user: User | null
  preferences: UserPreferences | null
  
  // Room state
  rooms: Room[]
  currentRoom: Room | null
  
  // Focus session state
  currentSession: FocusSession | null
  sessionHistory: FocusSession[]
  
  // Timer state
  timer: Timer | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User) => void
  setPreferences: (preferences: UserPreferences) => void
  setRooms: (rooms: Room[]) => void
  setCurrentRoom: (room: Room | null) => void
  joinRoom: (roomId: string) => void
  leaveRoom: () => void
  startFocusSession: (goals: string[]) => void
  endFocusSession: (achievements: string[]) => void
  startTimer: (duration: number, type: 'work' | 'break') => void
  pauseTimer: () => void
  resetTimer: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const defaultPreferences: UserPreferences = {
  workStyle: 'quiet',
  preferredRoomCategories: ['work', 'study'],
  notificationSettings: {
    breakReminders: true,
    goalReminders: true,
    achievementCelebrations: true,
  },
  accessibilitySettings: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      preferences: defaultPreferences,
      rooms: [],
      currentRoom: null,
      currentSession: null,
      sessionHistory: [],
      timer: null,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),
      setPreferences: (preferences) => set({ preferences }),
      setRooms: (rooms) => set({ rooms }),
      setCurrentRoom: (room) => set({ currentRoom: room }),
      
      joinRoom: (roomId) => {
        const { rooms, user } = get()
        const room = rooms.find(r => r.id === roomId)
        if (room && user) {
          set({ currentRoom: room })
          // Emit WebSocket event to join room
          if (typeof window !== 'undefined') {
            const { socketManager } = require('@/lib/socket')
            socketManager.joinRoom(roomId, user)
          }
        }
      },
      
      leaveRoom: () => {
        const { currentRoom } = get()
        if (currentRoom) {
          // Emit WebSocket event to leave room
          if (typeof window !== 'undefined') {
            const { socketManager } = require('@/lib/socket')
            socketManager.leaveRoom(currentRoom.id)
          }
        }
        set({ currentRoom: null, currentSession: null, timer: null })
      },
      
      startFocusSession: (goals) => {
        const { currentRoom, user } = get()
        if (currentRoom && user) {
          const session: FocusSession = {
            id: `session_${Date.now()}`,
            roomId: currentRoom.id,
            userId: user.id,
            startedAt: new Date(),
            goals,
            achievements: [],
            isCompleted: false,
          }
          set({ currentSession: session })
        }
      },
      
      endFocusSession: (achievements) => {
        const { currentSession } = get()
        if (currentSession) {
          const completedSession: FocusSession = {
            ...currentSession,
            endedAt: new Date(),
            durationMinutes: Math.floor((Date.now() - currentSession.startedAt.getTime()) / 60000),
            achievements,
            isCompleted: true,
          }
          set({
            currentSession: null,
            sessionHistory: [...get().sessionHistory, completedSession],
          })
        }
      },
      
      startTimer: (duration, type) => {
        const { currentRoom } = get()
        if (currentRoom) {
          const timer: Timer = {
            id: `timer_${Date.now()}`,
            roomId: currentRoom.id,
            duration,
            remaining: duration,
            type,
            isRunning: true,
            isPaused: false,
          }
          set({ timer })
        }
      },
      
      pauseTimer: () => {
        const { timer } = get()
        if (timer) {
          set({
            timer: {
              ...timer,
              isRunning: false,
              isPaused: true,
            },
          })
        }
      },
      
      resetTimer: () => {
        set({ timer: null })
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'body-double-storage',
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
        sessionHistory: state.sessionHistory,
      }),
    }
  )
)
