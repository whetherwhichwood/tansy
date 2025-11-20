import { getCurrentResident } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CommunityContent } from '@/components/community/CommunityContent'

export default async function CommunityPage() {
  const resident = await getCurrentResident()
  
  if (!resident) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityContent resident={resident} />
    </div>
  )
}








