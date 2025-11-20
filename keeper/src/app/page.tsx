import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import SignupForm from '@/components/auth/SignupForm'

export default async function Home() {
  const user = await getCurrentUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Keeper
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Never forget what needs fixing, renewing, or replacing again.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6 text-center">
            Get Started
          </h2>
          <SignupForm />
        </div>
        
        <div className="text-center text-sm text-neutral-500">
          <p>Track warranties, maintenance tasks, and document renewals</p>
          <p className="mt-1">All in one simple dashboard</p>
        </div>
      </div>
    </div>
  )
}