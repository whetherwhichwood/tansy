import { useEffect } from 'react'
import { useAppStore } from './appStore'
import { mockRooms, mockUsers } from '@/data/mockData'

export function useMockData() {
  const { setRooms, setUser } = useAppStore()

  useEffect(() => {
    // Initialize with mock data
    setRooms(mockRooms)
    
    // Create a mock user for the current session
    const mockUser: typeof mockUsers[0] = {
      id: 'current_user',
      anonymousId: 'anon_current',
      displayName: 'You',
      avatarUrl: undefined,
      isOnline: true,
      lastSeen: new Date(),
    }
    setUser(mockUser)
  }, [setRooms, setUser])

  return null
}
