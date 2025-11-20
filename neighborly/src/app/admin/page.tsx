import { getCurrentResident } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const resident = await getCurrentResident()
  
  if (!resident) {
    redirect('/')
  }

  // For demo purposes, allow any resident to access admin
  // In production, you'd check for admin role
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard resident={resident} />
    </div>
  )
}








