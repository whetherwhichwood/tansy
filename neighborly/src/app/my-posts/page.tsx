import { getCurrentResident } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { MyPostsContent } from '@/components/posts/MyPostsContent'

export default async function MyPostsPage() {
  const resident = await getCurrentResident()
  
  if (!resident) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MyPostsContent resident={resident} />
    </div>
  )
}








