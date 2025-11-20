'use client'

// Analytics tracking for key metrics
export interface AnalyticsEvent {
  type: 'onboarding_complete' | 'drop_off' | 'first_value' | 'page_view' | 'action_click'
  timestamp: number
  userId?: string
  metadata?: Record<string, any>
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = []
  private startTimes: Map<string, number> = new Map()

  // Track onboarding completion time
  startOnboarding(userId: string) {
    this.startTimes.set(`onboarding_${userId}`, Date.now())
  }

  completeOnboarding(userId: string) {
    const startTime = this.startTimes.get(`onboarding_${userId}`)
    if (startTime) {
      const completionTime = Date.now() - startTime
      this.track({
        type: 'onboarding_complete',
        timestamp: Date.now(),
        userId,
        metadata: { completionTimeMs: completionTime, completionTimeMinutes: Math.round(completionTime / 60000) },
      })
      this.startTimes.delete(`onboarding_${userId}`)
    }
  }

  // Track drop-off points
  trackDropOff(page: string, step?: string, userId?: string) {
    this.track({
      type: 'drop_off',
      timestamp: Date.now(),
      userId,
      metadata: { page, step },
    })
  }

  // Track first value delivery time
  startFirstValue(userId: string) {
    this.startTimes.set(`first_value_${userId}`, Date.now())
  }

  deliverFirstValue(userId: string, valueType: string) {
    const startTime = this.startTimes.get(`first_value_${userId}`)
    if (startTime) {
      const deliveryTime = Date.now() - startTime
      this.track({
        type: 'first_value',
        timestamp: Date.now(),
        userId,
        metadata: { 
          deliveryTimeMs: deliveryTime, 
          deliveryTimeMinutes: Math.round(deliveryTime / 60000),
          valueType,
        },
      })
      this.startTimes.delete(`first_value_${userId}`)
    }
  }

  // Generic tracking
  track(event: AnalyticsEvent) {
    this.events.push(event)
    // In production, this would send to analytics service (PostHog, etc.)
    console.log('Analytics Event:', event)
    
    // Store in localStorage for demo purposes
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tansy_analytics')
      const events = stored ? JSON.parse(stored) : []
      events.push(event)
      // Keep only last 100 events
      const recentEvents = events.slice(-100)
      localStorage.setItem('tansy_analytics', JSON.stringify(recentEvents))
    }
  }

  // Get analytics summary
  getSummary() {
    const onboardingEvents = this.events.filter(e => e.type === 'onboarding_complete')
    const dropOffEvents = this.events.filter(e => e.type === 'drop_off')
    const firstValueEvents = this.events.filter(e => e.type === 'first_value')

    const avgOnboardingTime = onboardingEvents.length > 0
      ? onboardingEvents.reduce((sum, e) => sum + (e.metadata?.completionTimeMinutes || 0), 0) / onboardingEvents.length
      : 0

    const avgFirstValueTime = firstValueEvents.length > 0
      ? firstValueEvents.reduce((sum, e) => sum + (e.metadata?.deliveryTimeMinutes || 0), 0) / firstValueEvents.length
      : 0

    return {
      totalEvents: this.events.length,
      onboardingCompletions: onboardingEvents.length,
      averageOnboardingTimeMinutes: Math.round(avgOnboardingTime),
      dropOffPoints: dropOffEvents.length,
      dropOffsByPage: this.groupBy(dropOffEvents, e => e.metadata?.page || 'unknown'),
      firstValueDeliveries: firstValueEvents.length,
      averageFirstValueTimeMinutes: Math.round(avgFirstValueTime),
    }
  }

  private groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = keyFn(item)
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}

export const analytics = new AnalyticsTracker()

