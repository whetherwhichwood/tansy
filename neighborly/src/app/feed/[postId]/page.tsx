import { getCurrentResident } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PostDetail } from '@/components/posts/PostDetail'

interface PostDetailPageProps {
  params: { postId: string }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resident = await getCurrentResident()
  
  if (!resident) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PostDetail postId={params.postId} currentResident={resident} />
    </div>
  )
}








