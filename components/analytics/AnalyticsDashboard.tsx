'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Clock, TrendingDown, Target } from 'lucide-react'
import { analytics, AnalyticsEvent } from '@/lib/analytics'

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState(analytics.getSummary())
  const [events, setEvents] = useState<AnalyticsEvent[]>([])

  useEffect(() => {
    // Load events from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tansy_analytics')
      if (stored) {
        setEvents(JSON.parse(stored))
      }
    }

    // Update summary periodically
    const interval = setInterval(() => {
      setSummary(analytics.getSummary())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-tansy-gray-light p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-tansy-gray-darker mb-2">Analytics Dashboard</h1>
          <p className="text-tansy-gray-dark">Track key metrics: onboarding completion, drop-offs, and first-value delivery</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-tansy-gray">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-tansy-teal" />
              <h3 className="text-sm font-medium text-tansy-gray-dark">Onboarding Completions</h3>
            </div>
            <div className="text-3xl font-bold text-tansy-gray-darker">{summary.onboardingCompletions}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-tansy-gray">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-tansy-pink" />
              <h3 className="text-sm font-medium text-tansy-gray-dark">Avg Onboarding Time</h3>
            </div>
            <div className="text-3xl font-bold text-tansy-gray-darker">
              {summary.averageOnboardingTimeMinutes}m
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-tansy-gray">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6 text-red-500" />
              <h3 className="text-sm font-medium text-tansy-gray-dark">Drop-off Points</h3>
            </div>
            <div className="text-3xl font-bold text-tansy-gray-darker">{summary.dropOffPoints}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-tansy-gray">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-tansy-teal-dark" />
              <h3 className="text-sm font-medium text-tansy-gray-dark">Avg First Value Time</h3>
            </div>
            <div className="text-3xl font-bold text-tansy-gray-darker">
              {summary.averageFirstValueTimeMinutes}m
            </div>
          </div>
        </div>

        {/* Drop-offs by Page */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-tansy-gray mb-8">
          <h2 className="text-xl font-semibold text-tansy-gray-darker mb-4">Drop-offs by Page</h2>
          {Object.keys(summary.dropOffsByPage).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(summary.dropOffsByPage).map(([page, count]) => (
                <div key={page} className="flex items-center justify-between">
                  <span className="text-tansy-gray-darker">{page}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-tansy-gray-light rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(count / summary.dropOffPoints) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-tansy-gray-dark w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-tansy-gray-dark">No drop-off data yet</p>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-tansy-gray">
          <h2 className="text-xl font-semibold text-tansy-gray-darker mb-4">Recent Events</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.slice(-20).reverse().map((event, idx) => (
              <div key={idx} className="p-3 bg-tansy-gray-light rounded-lg text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-tansy-gray-darker">{event.type}</span>
                  <span className="text-tansy-gray-dark">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {event.metadata && (
                  <div className="mt-1 text-tansy-gray-dark">
                    {JSON.stringify(event.metadata, null, 2)}
                  </div>
                )}
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-tansy-gray-dark">No events tracked yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

