import { render, screen, fireEvent } from '@testing-library/react'
import { Timer } from '@/components/Timer'
import { useAppStore } from '@/store/appStore'

// Mock the socket manager
jest.mock('@/lib/socket', () => ({
  socketManager: {
    startTimer: jest.fn(),
    pauseTimer: jest.fn(),
    resetTimer: jest.fn(),
  },
}))

// Mock the app store
jest.mock('@/store/appStore', () => ({
  useAppStore: jest.fn(),
}))

describe('Timer Component', () => {
  const mockStartTimer = jest.fn()
  const mockPauseTimer = jest.fn()
  const mockResetTimer = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAppStore as jest.Mock).mockReturnValue({
      timer: null,
      startTimer: mockStartTimer,
      pauseTimer: mockPauseTimer,
      resetTimer: mockResetTimer,
    })
  })

  it('renders timer interface when no timer is active', () => {
    render(<Timer />)
    
    expect(screen.getByText('Focus Timer')).toBeInTheDocument()
    expect(screen.getByText('Start 25min Focus')).toBeInTheDocument()
  })

  it('calls startTimer when start button is clicked', () => {
    render(<Timer />)
    
    const startButton = screen.getByText('Start 25min Focus')
    fireEvent.click(startButton)
    
    expect(mockStartTimer).toHaveBeenCalledWith(25 * 60, 'work')
  })

  it('renders timer display when timer is active', () => {
    const mockTimer = {
      id: 'timer_1',
      roomId: 'room_1',
      duration: 25 * 60,
      remaining: 20 * 60,
      type: 'work' as const,
      isRunning: true,
      isPaused: false,
    }

    ;(useAppStore as jest.Mock).mockReturnValue({
      timer: mockTimer,
      startTimer: mockStartTimer,
      pauseTimer: mockPauseTimer,
      resetTimer: mockResetTimer,
    })

    render(<Timer />)
    
    expect(screen.getByText('Focus Time')).toBeInTheDocument()
    expect(screen.getByText('20:00')).toBeInTheDocument()
  })

  it('calls pauseTimer when pause button is clicked', () => {
    const mockTimer = {
      id: 'timer_1',
      roomId: 'room_1',
      duration: 25 * 60,
      remaining: 20 * 60,
      type: 'work' as const,
      isRunning: true,
      isPaused: false,
    }

    ;(useAppStore as jest.Mock).mockReturnValue({
      timer: mockTimer,
      startTimer: mockStartTimer,
      pauseTimer: mockPauseTimer,
      resetTimer: mockResetTimer,
    })

    render(<Timer />)
    
    const pauseButton = screen.getByText('Pause')
    fireEvent.click(pauseButton)
    
    expect(mockPauseTimer).toHaveBeenCalled()
  })

  it('calls resetTimer when reset button is clicked', () => {
    const mockTimer = {
      id: 'timer_1',
      roomId: 'room_1',
      duration: 25 * 60,
      remaining: 20 * 60,
      type: 'work' as const,
      isRunning: true,
      isPaused: false,
    }

    ;(useAppStore as jest.Mock).mockReturnValue({
      timer: mockTimer,
      startTimer: mockStartTimer,
      pauseTimer: mockPauseTimer,
      resetTimer: mockResetTimer,
    })

    render(<Timer />)
    
    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)
    
    expect(mockResetTimer).toHaveBeenCalled()
  })
})
