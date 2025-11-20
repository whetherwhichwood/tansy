import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock the store
jest.mock('@/store/appStore', () => ({
  useAppStore: () => ({
    rooms: [
      {
        id: 'room_1',
        name: 'Test Room',
        description: 'A test room',
        category: 'work',
        maxCapacity: 6,
        currentCapacity: 2,
        isActive: true,
        participants: [],
      },
    ],
    currentRoom: null,
    joinRoom: jest.fn(),
    leaveRoom: jest.fn(),
  }),
}))

// Mock the mock data hook
jest.mock('@/store/useMockData', () => ({
  useMockData: () => null,
}))

// Mock the socket manager
jest.mock('@/lib/socket', () => ({
  socketManager: {
    connect: jest.fn(),
    onRoomJoined: jest.fn(),
    onParticipantJoined: jest.fn(),
    onParticipantLeft: jest.fn(),
    onTimerStarted: jest.fn(),
    onTimerUpdated: jest.fn(),
    onTimerCompleted: jest.fn(),
  },
}))

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Find Your Focus Together')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Join anonymous virtual study rooms/)).toBeInTheDocument()
  })

  it('renders available rooms', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Available Rooms')).toBeInTheDocument()
    expect(screen.getByText('Test Room')).toBeInTheDocument()
  })
})
