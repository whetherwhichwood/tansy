import { getCurrentResident } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { MessagesContent } from '@/components/messages/MessagesContent'

export default async function MessagesPage() {
  const resident = await getCurrentResident()
  
  if (!resident) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MessagesContent resident={resident} />
    </div>
  )
}








