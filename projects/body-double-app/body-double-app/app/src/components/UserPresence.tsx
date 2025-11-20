'use client'

import { motion } from 'framer-motion'
import { Users, User, Clock, Target } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

export function UserPresence() {
  const { currentRoom } = useAppStore()

  if (!currentRoom) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-green-100 text-green-800'
      case 'break':
        return 'bg-yellow-100 text-yellow-800'
      case 'away':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return '💻'
      case 'break':
        return '☕'
      case 'away':
        return '⏸️'
      default:
        return '👤'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Roommates ({currentRoom.participants.length})
        </h3>
      </div>

      {currentRoom.participants.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            You're the first one here! Others will join soon.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentRoom.participants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700">
                  {participant.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {participant.displayName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {participant.isOnline ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {getStatusIcon('working')}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor('working')}`}>
                  Working
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Room Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {currentRoom.participants.length}
            </div>
            <div className="text-xs text-gray-500">Active Now</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.floor(Math.random() * 120) + 30}
            </div>
            <div className="text-xs text-gray-500">Avg Focus (min)</div>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <p className="text-sm text-indigo-800">
            You're not alone! {currentRoom.participants.length} {currentRoom.participants.length === 1 ? 'person is' : 'people are'} working alongside you.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
