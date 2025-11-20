import { Camera } from 'lucide-react'

interface ProfileCardProps {
  name: string
  avatar: string
}

export default function ProfileCard({ name, avatar }: ProfileCardProps) {
  return (
    <div className="bg-gradient-to-r from-tansy-teal to-tansy-pink rounded-2xl p-8 flex flex-col items-center relative">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-purple-700 flex items-center justify-center">
          <span className="text-white text-4xl font-semibold">{avatar}</span>
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-tansy-pink cursor-pointer hover:bg-tansy-gray-light transition-colors">
          <Camera className="w-4 h-4 text-tansy-gray-darker" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-tansy-gray-darker mt-4">{name}</h2>
    </div>
  )
}

