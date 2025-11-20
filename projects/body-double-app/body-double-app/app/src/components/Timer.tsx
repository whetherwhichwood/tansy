'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { socketManager } from '@/lib/socket'

export function Timer() {
  const { timer, startTimer, pauseTimer, resetTimer } = useAppStore()
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (timer && timer.isRunning) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            resetTimer()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [timer, resetTimer])

  useEffect(() => {
    if (timer) {
      setTimeLeft(timer.remaining)
    }
  }, [timer])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!timer) return 0
    return ((timer.duration - timeLeft) / timer.duration) * 100
  }

  const handleStart = () => {
    const { currentRoom } = useAppStore.getState()
    if (currentRoom) {
      if (timer) {
        if (timer.isPaused) {
          // Resume timer
          startTimer(timer.remaining, timer.type)
          socketManager.startTimer(currentRoom.id, timer.remaining, timer.type)
        } else {
          // Start new timer
          const duration = 25 * 60 // 25 minutes default
          startTimer(duration, 'work')
          socketManager.startTimer(currentRoom.id, duration, 'work')
        }
      } else {
        const duration = 25 * 60 // 25 minutes default
        startTimer(duration, 'work')
        socketManager.startTimer(currentRoom.id, duration, 'work')
      }
    }
  }

  const handlePause = () => {
    const { currentRoom } = useAppStore.getState()
    pauseTimer()
    if (currentRoom) {
      socketManager.pauseTimer(currentRoom.id)
    }
  }

  const handleReset = () => {
    const { currentRoom } = useAppStore.getState()
    resetTimer()
    setTimeLeft(0)
    if (currentRoom) {
      socketManager.resetTimer(currentRoom.id)
    }
  }

  if (!timer) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Focus Timer</h3>
          <p className="text-gray-600 mb-6">
            Start a focused work session with your roommates
          </p>
          <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            <span>Start 25min Focus</span>
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {timer.type === 'work' ? 'Focus Time' : 'Break Time'}
        </h3>
        
        {/* Timer Display */}
        <div className="mb-6">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                className={`transition-all duration-1000 ${
                  timer.type === 'work' ? 'text-indigo-600' : 'text-green-600'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {timer.isRunning ? (
            <button
              onClick={handlePause}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Status */}
        <div className="mt-4 text-sm text-gray-600">
          {timer.isRunning ? (
            <span className="text-green-600">● Active</span>
          ) : timer.isPaused ? (
            <span className="text-yellow-600">● Paused</span>
          ) : (
            <span className="text-gray-400">● Stopped</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
