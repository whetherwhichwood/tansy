import { SignupForm } from '@/components/auth/SignupForm'
import { getCurrentResident } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Users, Heart, Shield, Clock } from 'lucide-react'

export default async function HomePage() {
  const resident = await getCurrentResident()
  
  if (resident) {
    redirect('/feed')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-emerald-600">Neighborly</h1>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Neighbors helping neighbors
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Skip the HOA Facebook chaos
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A private micro-errand and favor-exchange network designed specifically for HOAs and residential communities. 
            Connect with verified neighbors for quick help, tool borrowing, and small exchanges.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Neighbors</h3>
            <p className="text-gray-600">Only residents from your HOA can join. No strangers, no spam.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Help</h3>
            <p className="text-gray-600">Post small errands, borrow tools, or offer assistance in seconds.</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Safe & Secure</h3>
            <p className="text-gray-600">Private messaging, reputation system, and HOA oversight.</p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800">Demo Mode</h3>
          </div>
          <p className="text-yellow-700">
            This is a demonstration of Neighborly. Use invite code <strong>DEMO2025</strong> to join the Sunset Ridge HOA demo community.
          </p>
        </div>

        {/* Signup Form */}
        <div className="max-w-md mx-auto">
          <SignupForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 Neighborly. Built for better communities.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}