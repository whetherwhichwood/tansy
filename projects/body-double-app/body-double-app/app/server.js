const { Server } = require('socket.io')
const http = require('http')

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3002',
    methods: ['GET', 'POST'],
  },
})

// Store room data in memory (in production, use Redis or database)
const rooms = new Map()
const users = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join room
  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId)
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        participants: new Map(),
        timer: null,
        sessions: new Map(),
      })
    }

    const room = rooms.get(roomId)
    const userData = {
      id: socket.id,
      ...user,
      joinedAt: new Date(),
      status: 'working',
    }

    room.participants.set(socket.id, userData)
    users.set(socket.id, { roomId, ...userData })

    // Notify room about new participant
    socket.to(roomId).emit('participant-joined', userData)
    
    // Send current room state to new participant
    socket.emit('room-joined', {
      room: {
        id: roomId,
        participants: Array.from(room.participants.values()),
        timer: room.timer,
      },
    })

    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  // Leave room
  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId)
    
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId)
      room.participants.delete(socket.id)
      
      // Notify room about participant leaving
      socket.to(roomId).emit('participant-left', { participantId: socket.id })
      
      // Clean up empty rooms
      if (room.participants.size === 0) {
        rooms.delete(roomId)
      }
    }

    users.delete(socket.id)
    console.log(`User ${socket.id} left room ${roomId}`)
  })

  // Update presence
  socket.on('update-presence', ({ roomId, status }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId)
      const participant = room.participants.get(socket.id)
      
      if (participant) {
        participant.status = status
        participant.lastSeen = new Date()
        
        // Notify room about status update
        socket.to(roomId).emit('participant-updated', {
          participantId: socket.id,
          status,
        })
      }
    }
  })

  // Focus session events
  socket.on('start-focus-session', ({ roomId, goals }) => {
    const sessionId = `session_${Date.now()}_${socket.id}`
    const session = {
      id: sessionId,
      roomId,
      userId: socket.id,
      goals,
      startedAt: new Date(),
      isCompleted: false,
    }

    if (rooms.has(roomId)) {
      const room = rooms.get(roomId)
      room.sessions.set(sessionId, session)
      
      // Notify room about new session
      io.to(roomId).emit('focus-session-started', session)
    }
  })

  socket.on('update-progress', ({ sessionId, progress }) => {
    // Find session in any room
    for (const room of rooms.values()) {
      if (room.sessions.has(sessionId)) {
        const session = room.sessions.get(sessionId)
        session.progress = progress
        
        // Notify room about progress update
        io.to(room.id).emit('focus-session-updated', session)
        break
      }
    }
  })

  socket.on('complete-session', ({ sessionId, achievements }) => {
    // Find session in any room
    for (const room of rooms.values()) {
      if (room.sessions.has(sessionId)) {
        const session = room.sessions.get(sessionId)
        session.endedAt = new Date()
        session.achievements = achievements
        session.isCompleted = true
        
        // Notify room about completed session
        io.to(room.id).emit('focus-session-completed', session)
        break
      }
    }
  })

  // Timer events
  socket.on('start-timer', ({ roomId, duration, type }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId)
      room.timer = {
        id: `timer_${Date.now()}`,
        roomId,
        duration,
        remaining: duration,
        type,
        isRunning: true,
        startedAt: new Date(),
      }

      // Notify room about timer start
      io.to(roomId).emit('timer-started', room.timer)

      // Start countdown
      const interval = setInterval(() => {
        if (room.timer && room.timer.isRunning) {
          room.timer.remaining -= 1
          
          // Notify room about timer update
          io.to(roomId).emit('timer-updated', {
            roomId,
            remaining: room.timer.remaining,
          })

          if (room.timer.remaining <= 0) {
            // Timer completed
            room.timer.isRunning = false
            io.to(roomId).emit('timer-completed', {
              roomId,
              type: room.timer.type,
            })
            clearInterval(interval)
          }
        } else {
          clearInterval(interval)
        }
      }, 1000)
    }
  })

  socket.on('pause-timer', ({ roomId }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId)
      if (room.timer) {
        room.timer.isRunning = false
        io.to(roomId).emit('timer-paused', { roomId })
      }
    }
  })

  socket.on('reset-timer', ({ roomId }) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId)
      room.timer = null
      io.to(roomId).emit('timer-reset', { roomId })
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id)
    if (user) {
      const { roomId } = user
      
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId)
        room.participants.delete(socket.id)
        
        // Notify room about disconnection
        socket.to(roomId).emit('participant-left', { participantId: socket.id })
        
        // Clean up empty rooms
        if (room.participants.size === 0) {
          rooms.delete(roomId)
        }
      }
      
      users.delete(socket.id)
    }
    
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 4002
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`)
})
