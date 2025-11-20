import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plus, History, Settings, LogOut } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const startNewSession = () => {
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ICHRA Recommendation Tool
              </h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={startNewSession}
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="card-body text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 group-hover:bg-primary-200 transition-colors">
                    <Plus className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    New Consultation
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Start a new employee consultation session
                  </p>
                </div>
              </button>

              <div className="card">
                <div className="card-body text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-gray-100">
                    <History className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Session History
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    View past consultation sessions
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-body text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-gray-100">
                    <Settings className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Settings
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Manage application settings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                <li className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        October 9, 2025 - 2:30 PM
                      </p>
                      <p className="text-sm text-gray-500">
                        Age 35, New York - Individual Coverage
                      </p>
                      <p className="text-sm text-gray-500">
                        Recommended: BCBS Silver PPO, Aetna Gold HMO
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
                <li className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        October 9, 2025 - 11:15 AM
                      </p>
                      <p className="text-sm text-gray-500">
                        Age 42, California - Family Coverage
                      </p>
                      <p className="text-sm text-gray-500">
                        Recommended: Kaiser Gold HMO, Anthem Silver PPO
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
                <li className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        October 8, 2025 - 4:45 PM
                      </p>
                      <p className="text-sm text-gray-500">
                        Age 28, Texas - Individual Coverage
                      </p>
                      <p className="text-sm text-gray-500">
                        Recommended: Cigna Bronze HDHP, UnitedHealth Silver
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}







