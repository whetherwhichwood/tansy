'use client'

import { motion } from 'framer-motion'
import { Users, Clock, Target } from 'lucide-react'
import { Room } from '@/store/appStore'

interface RoomCardProps {
  room: Room
  onJoin: () => void
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'study':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'creative':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'cleaning':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work':
        return '💼'
      case 'study':
        return '📚'
      case 'creative':
        return '🎨'
      case 'cleaning':
        return '🧹'
      default:
        return '💡'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(room.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
            <p className="text-sm text-gray-600">{room.description}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(room.category)}`}>
          {room.category}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{room.currentCapacity}/{room.maxCapacity}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Active now</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Participants */}
        {room.participants.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {room.participants.slice(0, 3).map((participant, index) => (
                <div
                  key={participant.id}
                  className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-700 border-2 border-white"
                  style={{ zIndex: 10 - index }}
                >
                  {participant.displayName.charAt(0).toUpperCase()}
                </div>
              ))}
              {room.participants.length > 3 && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                  +{room.participants.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {room.participants.length} {room.participants.length === 1 ? 'person' : 'people'} working
            </span>
          </div>
        )}

        {/* Join Button */}
        <button
          onClick={onJoin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Target className="w-4 h-4" />
          <span>Join Room</span>
        </button>
      </div>
    </motion.div>
  )
}
