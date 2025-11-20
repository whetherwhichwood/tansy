'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, Target, Shield, Heart, Brain } from 'lucide-react'
import { RoomCard } from '@/components/RoomCard'
import { Timer } from '@/components/Timer'
import { UserPresence } from '@/components/UserPresence'
import { useAppStore } from '@/store/appStore'
import { useMockData } from '@/store/useMockData'
import { socketManager } from '@/lib/socket'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const { rooms, currentRoom, joinRoom, leaveRoom } = useAppStore()
  
  // Initialize mock data
  useMockData()

  useEffect(() => {
    // Initialize WebSocket connection
    socketManager.connect()
    
    // Set up event listeners
    socketManager.onRoomJoined((data) => {
      console.log('Room joined:', data)
      // Update room state with real-time data
    })
    
    socketManager.onParticipantJoined((data) => {
      console.log('Participant joined:', data)
      // Update participants list
    })
    
    socketManager.onParticipantLeft((data) => {
      console.log('Participant left:', data)
      // Remove participant from list
    })
    
    socketManager.onTimerStarted((data) => {
      console.log('Timer started:', data)
      // Update timer state
    })
    
    socketManager.onTimerUpdated((data) => {
      console.log('Timer updated:', data)
      // Update timer countdown
    })
    
    socketManager.onTimerCompleted((data) => {
      console.log('Timer completed:', data)
      // Handle timer completion
    })

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Creating your focus space...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Body Double Space</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Anonymous • Safe • Focused
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRoom ? (
          <div className="space-y-6">
            {/* Current Room Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentRoom.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {currentRoom.description}
                  </p>
                </div>
                <button
                  onClick={leaveRoom}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Leave Room
                </button>
              </div>
            </motion.div>

            {/* Focus Session */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timer and Focus Tools */}
              <div className="lg:col-span-2 space-y-6">
                <Timer />
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Focus Tools
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                      <Target className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-indigo-900">Set Goals</p>
                    </button>
                    <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <Heart className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-900">Check-in</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* User Presence */}
              <div className="lg:col-span-1">
                <UserPresence />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your Focus Together
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join anonymous virtual study rooms where you can work alongside others 
                without the pressure of social interaction. Perfect for ADHD and autistic 
                individuals who benefit from body-doubling.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Anonymous & Safe</h3>
                <p className="text-gray-600">
                  No personal information shared. Work in complete privacy with gentle accountability.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shared Focus</h3>
                <p className="text-gray-600">
                  Synchronized timers and gentle check-ins help maintain focus and motivation.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Neurodivergent-Friendly</h3>
                <p className="text-gray-600">
                  Designed specifically for ADHD and autistic individuals with accessibility in mind.
                </p>
              </div>
            </motion.div>

            {/* Available Rooms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onJoin={() => joinRoom(room.id)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}