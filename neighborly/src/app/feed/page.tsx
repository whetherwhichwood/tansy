import { getCurrentResident } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { FeedContent } from '@/components/feed/FeedContent'

export default async function FeedPage() {
  const resident = await getCurrentResident()
  
  if (!resident) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FeedContent resident={resident} />
    </div>
  )
}








