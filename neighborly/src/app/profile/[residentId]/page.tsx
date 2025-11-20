import { getCurrentResident } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ProfileContent } from '@/components/profile/ProfileContent'

interface ProfilePageProps {
  params: { residentId: string }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const currentResident = await getCurrentResident()
  
  if (!currentResident) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileContent residentId={params.residentId} currentResident={currentResident} />
    </div>
  )
}








