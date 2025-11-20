import { io, Socket } from 'socket.io-client'

class SocketManager {
  private socket: Socket | null = null
  private isConnected = false

  connect() {
    if (this.socket?.connected) return

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4002', {
      transports: ['websocket'],
      autoConnect: true,
    })

    this.socket.on('connect', () => {
      this.isConnected = true
      console.log('Connected to server')
    })

    this.socket.on('disconnect', () => {
      this.isConnected = false
      console.log('Disconnected from server')
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  joinRoom(roomId: string, user: any) {
    if (this.socket) {
      this.socket.emit('join-room', { roomId, user })
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave-room', { roomId })
    }
  }

  updatePresence(roomId: string, status: 'working' | 'break' | 'away') {
    if (this.socket) {
      this.socket.emit('update-presence', { roomId, status })
    }
  }

  startFocusSession(roomId: string, goals: string[]) {
    if (this.socket) {
      this.socket.emit('start-focus-session', { roomId, goals })
    }
  }

  updateProgress(sessionId: string, progress: number) {
    if (this.socket) {
      this.socket.emit('update-progress', { sessionId, progress })
    }
  }

  completeSession(sessionId: string, achievements: string[]) {
    if (this.socket) {
      this.socket.emit('complete-session', { sessionId, achievements })
    }
  }

  startTimer(roomId: string, duration: number, type: 'work' | 'break') {
    if (this.socket) {
      this.socket.emit('start-timer', { roomId, duration, type })
    }
  }

  pauseTimer(roomId: string) {
    if (this.socket) {
      this.socket.emit('pause-timer', { roomId })
    }
  }

  resetTimer(roomId: string) {
    if (this.socket) {
      this.socket.emit('reset-timer', { roomId })
    }
  }

  // Event listeners
  onRoomJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('room-joined', callback)
    }
  }

  onRoomLeft(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('room-left', callback)
    }
  }

  onParticipantJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('participant-joined', callback)
    }
  }

  onParticipantLeft(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('participant-left', callback)
    }
  }

  onFocusSessionStarted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('focus-session-started', callback)
    }
  }

  onFocusSessionUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('focus-session-updated', callback)
    }
  }

  onFocusSessionCompleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('focus-session-completed', callback)
    }
  }

  onTimerStarted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('timer-started', callback)
    }
  }

  onTimerUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('timer-updated', callback)
    }
  }

  onTimerCompleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('timer-completed', callback)
    }
  }

  get connected() {
    return this.isConnected
  }

  get socketInstance() {
    return this.socket
  }
}

export const socketManager = new SocketManager()
