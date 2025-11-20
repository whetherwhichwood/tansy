// Analytics System - Tracks user engagement and productivity metrics
// Privacy-first design with local storage and optional cloud sync

class Analytics {
    constructor() {
        this.events = this.loadEvents();
        this.sessionData = this.loadSessionData();
        this.userMetrics = this.loadUserMetrics();
        this.observers = [];
        
        // Privacy settings
        this.privacySettings = {
            trackSessions: true,
            trackInteractions: true,
            trackPerformance: true,
            allowCloudSync: false,
            anonymizeData: true
        };
        
        this.init();
    }

    init() {
        // Set up automatic event tracking
        this.setupAutomaticTracking();
        
        // Load privacy settings
        this.loadPrivacySettings();
        
        // Start periodic data processing
        this.startPeriodicProcessing();
    }

    // Track a custom event
    track(eventName, eventData = {}) {
        if (!this.privacySettings.trackInteractions) return;

        const event = {
            id: this.generateEventId(),
            name: eventName,
            timestamp: new Date(),
            data: this.anonymizeData ? this.anonymizeEventData(eventData) : eventData,
            sessionId: this.getCurrentSessionId(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.events.push(event);
        this.saveEvents();
        this.notifyObservers('eventTracked', event);
        
        return event;
    }

    // Track session start
    trackSessionStart(sessionData) {
        if (!this.privacySettings.trackSessions) return;

        const event = this.track('session_start', {
            sessionType: sessionData.type,
            duration: sessionData.duration,
            task: sessionData.task,
            avatar: sessionData.avatar
        });

        // Update session data
        this.sessionData.push({
            id: sessionData.id,
            startTime: new Date(),
            type: sessionData.type,
            duration: sessionData.duration,
            task: sessionData.task,
            avatar: sessionData.avatar,
            events: [event.id]
        });

        this.saveSessionData();
        this.updateUserMetrics('sessionStarted');
        
        return event;
    }

    // Track session completion
    trackSessionComplete(sessionData) {
        if (!this.privacySettings.trackSessions) return;

        const event = this.track('session_complete', {
            sessionId: sessionData.id,
            actualDuration: sessionData.actualDuration,
            focusLevel: sessionData.focusLevel,
            completionRate: sessionData.actualDuration / (sessionData.duration * 60)
        });

        // Update session data
        const session = this.sessionData.find(s => s.id === sessionData.id);
        if (session) {
            session.endTime = new Date();
            session.actualDuration = sessionData.actualDuration;
            session.focusLevel = sessionData.focusLevel;
            session.completionRate = sessionData.actualDuration / (sessionData.duration * 60);
            session.events.push(event.id);
        }

        this.saveSessionData();
        this.updateUserMetrics('sessionCompleted', sessionData);
        
        return event;
    }

    // Track session pause
    trackSessionPause(sessionId) {
        return this.track('session_pause', { sessionId });
    }

    // Track session resume
    trackSessionResume(sessionId) {
        return this.track('session_resume', { sessionId });
    }

    // Track session stop
    trackSessionStop(sessionData) {
        return this.track('session_stop', {
            sessionId: sessionData.id,
            actualDuration: sessionData.actualDuration,
            reason: 'user_stopped'
        });
    }

    // Track avatar selection
    trackAvatarSelection(avatarId, avatarName) {
        return this.track('avatar_selected', { avatarId, avatarName });
    }

    // Track timer interactions
    trackTimerAction(action, data = {}) {
        return this.track('timer_action', { action, ...data });
    }

    // Track user engagement
    trackEngagement(engagementType, data = {}) {
        return this.track('engagement', { type: engagementType, ...data });
    }

    // Track performance metrics
    trackPerformance(metricName, value, unit = 'ms') {
        if (!this.privacySettings.trackPerformance) return;

        return this.track('performance', {
            metric: metricName,
            value,
            unit,
            timestamp: performance.now()
        });
    }

    // Track error
    trackError(error, context = {}) {
        return this.track('error', {
            message: error.message,
            stack: error.stack,
            context
        });
    }

    // Get analytics summary
    getSummary(timeframe = 'all') {
        const filteredEvents = this.filterEventsByTimeframe(this.events, timeframe);
        const filteredSessions = this.filterSessionsByTimeframe(this.sessionData, timeframe);

        return {
            timeframe,
            totalEvents: filteredEvents.length,
            totalSessions: filteredSessions.length,
            completedSessions: filteredSessions.filter(s => s.endTime).length,
            averageSessionDuration: this.calculateAverageSessionDuration(filteredSessions),
            mostUsedAvatar: this.getMostUsedAvatar(filteredSessions),
            focusLevelDistribution: this.getFocusLevelDistribution(filteredSessions),
            sessionCompletionRate: this.calculateSessionCompletionRate(filteredSessions),
            userEngagement: this.calculateUserEngagement(filteredEvents),
            productivityScore: this.calculateProductivityScore(filteredSessions, filteredEvents)
        };
    }

    // Get detailed session analytics
    getSessionAnalytics(sessionId) {
        const session = this.sessionData.find(s => s.id === sessionId);
        if (!session) return null;

        const sessionEvents = this.events.filter(e => session.events.includes(e.id));
        
        return {
            session,
            events: sessionEvents,
            duration: session.actualDuration || session.duration,
            focusLevel: session.focusLevel,
            completionRate: session.completionRate,
            engagement: this.calculateSessionEngagement(sessionEvents),
            productivity: this.calculateSessionProductivity(session, sessionEvents)
        };
    }

    // Get user progress over time
    getProgressOverTime(timeframe = '30d') {
        const days = this.getDaysInTimeframe(timeframe);
        const progress = [];

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            date.setHours(0, 0, 0, 0);
            
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const daySessions = this.sessionData.filter(s => {
                const sessionDate = new Date(s.startTime);
                return sessionDate >= date && sessionDate < nextDate;
            });

            progress.push({
                date: date.toISOString().split('T')[0],
                sessions: daySessions.length,
                totalDuration: daySessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0),
                completedSessions: daySessions.filter(s => s.endTime).length,
                averageFocusLevel: this.calculateAverageFocusLevel(daySessions)
            });
        }

        return progress;
    }

    // Get insights and recommendations
    getInsights() {
        const summary = this.getSummary('30d');
        const insights = [];

        // Session frequency insights
        if (summary.totalSessions < 5) {
            insights.push({
                type: 'frequency',
                message: 'Try to maintain a consistent session schedule for better results',
                priority: 'medium'
            });
        } else if (summary.totalSessions > 20) {
            insights.push({
                type: 'frequency',
                message: 'Great job maintaining regular sessions!',
                priority: 'low'
            });
        }

        // Duration insights
        if (summary.averageSessionDuration < 900) { // 15 minutes
            insights.push({
                type: 'duration',
                message: 'Consider longer sessions for deeper focus',
                priority: 'medium'
            });
        }

        // Focus level insights
        const lowFocusSessions = summary.focusLevelDistribution['Needs Improvement'] || 0;
        if (lowFocusSessions > summary.totalSessions * 0.3) {
            insights.push({
                type: 'focus',
                message: 'Try different avatars or session types to improve focus',
                priority: 'high'
            });
        }

        // Completion rate insights
        if (summary.sessionCompletionRate < 0.7) {
            insights.push({
                type: 'completion',
                message: 'Consider shorter sessions or different timing',
                priority: 'medium'
            });
        }

        return insights;
    }

    // Export analytics data
    exportData() {
        return {
            events: this.events,
            sessions: this.sessionData,
            metrics: this.userMetrics,
            summary: this.getSummary(),
            exportedAt: new Date(),
            version: '1.0.0'
        };
    }

    // Clear all analytics data
    clearData() {
        this.events = [];
        this.sessionData = [];
        this.userMetrics = this.getDefaultUserMetrics();
        
        this.saveEvents();
        this.saveSessionData();
        this.saveUserMetrics();
        
        this.notifyObservers('dataCleared');
    }

    // Setup automatic tracking
    setupAutomaticTracking() {
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.track('page_visibility_change', {
                hidden: document.hidden,
                timestamp: new Date()
            });
        });

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.track('page_unload', {
                timestamp: new Date()
            });
        });

        // Track performance metrics
        if (this.privacySettings.trackPerformance) {
            this.trackPerformanceMetrics();
        }
    }

    // Track performance metrics
    trackPerformanceMetrics() {
        // Track page load time
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                this.trackPerformance('page_load_time', loadTime);
            }, 0);
        });

        // Track memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                this.trackPerformance('memory_usage', performance.memory.usedJSHeapSize, 'bytes');
            }, 30000); // Every 30 seconds
        }
    }

    // Helper methods
    filterEventsByTimeframe(events, timeframe) {
        if (timeframe === 'all') return events;
        
        const now = new Date();
        const cutoff = new Date();
        
        switch (timeframe) {
            case '1d':
                cutoff.setDate(now.getDate() - 1);
                break;
            case '7d':
                cutoff.setDate(now.getDate() - 7);
                break;
            case '30d':
                cutoff.setDate(now.getDate() - 30);
                break;
            case '90d':
                cutoff.setDate(now.getDate() - 90);
                break;
            default:
                return events;
        }
        
        return events.filter(event => new Date(event.timestamp) >= cutoff);
    }

    filterSessionsByTimeframe(sessions, timeframe) {
        if (timeframe === 'all') return sessions;
        
        const now = new Date();
        const cutoff = new Date();
        
        switch (timeframe) {
            case '1d':
                cutoff.setDate(now.getDate() - 1);
                break;
            case '7d':
                cutoff.setDate(now.getDate() - 7);
                break;
            case '30d':
                cutoff.setDate(now.getDate() - 30);
                break;
            case '90d':
                cutoff.setDate(now.getDate() - 90);
                break;
            default:
                return sessions;
        }
        
        return sessions.filter(session => new Date(session.startTime) >= cutoff);
    }

    calculateAverageSessionDuration(sessions) {
        if (sessions.length === 0) return 0;
        
        const totalDuration = sessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);
        return totalDuration / sessions.length;
    }

    getMostUsedAvatar(sessions) {
        const avatarCounts = {};
        sessions.forEach(session => {
            avatarCounts[session.avatar] = (avatarCounts[session.avatar] || 0) + 1;
        });
        
        return Object.keys(avatarCounts).reduce((a, b) => 
            avatarCounts[a] > avatarCounts[b] ? a : b, 'none'
        );
    }

    getFocusLevelDistribution(sessions) {
        const distribution = {};
        sessions.forEach(session => {
            const level = session.focusLevel || 'unknown';
            distribution[level] = (distribution[level] || 0) + 1;
        });
        return distribution;
    }

    calculateSessionCompletionRate(sessions) {
        if (sessions.length === 0) return 0;
        
        const completedSessions = sessions.filter(s => s.endTime).length;
        return completedSessions / sessions.length;
    }

    calculateUserEngagement(events) {
        const engagementEvents = events.filter(e => e.name === 'engagement');
        return engagementEvents.length;
    }

    calculateProductivityScore(sessions, events) {
        // Simple productivity score based on session completion and focus
        const completedSessions = sessions.filter(s => s.endTime).length;
        const totalSessions = sessions.length;
        const completionRate = totalSessions > 0 ? completedSessions / totalSessions : 0;
        
        const focusScores = {
            'Excellent': 1.0,
            'Good': 0.8,
            'Fair': 0.6,
            'Needs Improvement': 0.3
        };
        
        const averageFocusScore = sessions.reduce((sum, s) => {
            return sum + (focusScores[s.focusLevel] || 0.5);
        }, 0) / Math.max(sessions.length, 1);
        
        return (completionRate * 0.6 + averageFocusScore * 0.4) * 100;
    }

    calculateSessionEngagement(events) {
        return events.filter(e => e.name.includes('interaction')).length;
    }

    calculateSessionProductivity(session, events) {
        const duration = session.actualDuration || session.duration;
        const engagement = this.calculateSessionEngagement(events);
        return (engagement / duration) * 100; // Engagement per minute
    }

    calculateAverageFocusLevel(sessions) {
        const focusScores = {
            'Excellent': 4,
            'Good': 3,
            'Fair': 2,
            'Needs Improvement': 1
        };
        
        const totalScore = sessions.reduce((sum, s) => {
            return sum + (focusScores[s.focusLevel] || 2);
        }, 0);
        
        return totalScore / Math.max(sessions.length, 1);
    }

    getDaysInTimeframe(timeframe) {
        switch (timeframe) {
            case '1d': return 1;
            case '7d': return 7;
            case '30d': return 30;
            case '90d': return 90;
            default: return 30;
        }
    }

    anonymizeEventData(data) {
        // Simple anonymization - remove or hash sensitive data
        const anonymized = { ...data };
        
        if (anonymized.task) {
            anonymized.task = anonymized.task.length > 10 ? 
                anonymized.task.substring(0, 10) + '...' : anonymized.task;
        }
        
        return anonymized;
    }

    getCurrentSessionId() {
        // This would be set by the main app
        return window.currentSessionId || null;
    }

    updateUserMetrics(action, data = {}) {
        const today = new Date().toDateString();
        
        if (!this.userMetrics.daily[today]) {
            this.userMetrics.daily[today] = {
                sessions: 0,
                totalDuration: 0,
                events: 0
            };
        }
        
        switch (action) {
            case 'sessionStarted':
                this.userMetrics.daily[today].sessions++;
                break;
            case 'sessionCompleted':
                this.userMetrics.daily[today].totalDuration += data.actualDuration || 0;
                break;
            default:
                this.userMetrics.daily[today].events++;
        }
        
        this.saveUserMetrics();
    }

    getDefaultUserMetrics() {
        return {
            totalSessions: 0,
            totalDuration: 0,
            currentStreak: 0,
            longestStreak: 0,
            daily: {}
        };
    }

    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Persistence methods
    loadEvents() {
        try {
            const saved = localStorage.getItem('bodyDoubleAnalyticsEvents');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Analytics: Failed to load events', error);
            return [];
        }
    }

    saveEvents() {
        try {
            localStorage.setItem('bodyDoubleAnalyticsEvents', JSON.stringify(this.events));
        } catch (error) {
            console.error('Analytics: Failed to save events', error);
        }
    }

    loadSessionData() {
        try {
            const saved = localStorage.getItem('bodyDoubleAnalyticsSessions');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Analytics: Failed to load session data', error);
            return [];
        }
    }

    saveSessionData() {
        try {
            localStorage.setItem('bodyDoubleAnalyticsSessions', JSON.stringify(this.sessionData));
        } catch (error) {
            console.error('Analytics: Failed to save session data', error);
        }
    }

    loadUserMetrics() {
        try {
            const saved = localStorage.getItem('bodyDoubleAnalyticsMetrics');
            return saved ? JSON.parse(saved) : this.getDefaultUserMetrics();
        } catch (error) {
            console.error('Analytics: Failed to load user metrics', error);
            return this.getDefaultUserMetrics();
        }
    }

    saveUserMetrics() {
        try {
            localStorage.setItem('bodyDoubleAnalyticsMetrics', JSON.stringify(this.userMetrics));
        } catch (error) {
            console.error('Analytics: Failed to save user metrics', error);
        }
    }

    loadPrivacySettings() {
        try {
            const saved = localStorage.getItem('bodyDoubleAnalyticsPrivacy');
            if (saved) {
                Object.assign(this.privacySettings, JSON.parse(saved));
            }
        } catch (error) {
            console.error('Analytics: Failed to load privacy settings', error);
        }
    }

    savePrivacySettings() {
        try {
            localStorage.setItem('bodyDoubleAnalyticsPrivacy', JSON.stringify(this.privacySettings));
        } catch (error) {
            console.error('Analytics: Failed to save privacy settings', error);
        }
    }

    startPeriodicProcessing() {
        // Process data every 5 minutes
        setInterval(() => {
            this.processData();
        }, 5 * 60 * 1000);
    }

    processData() {
        // Clean up old events (keep last 90 days)
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 90);
        
        this.events = this.events.filter(event => new Date(event.timestamp) > cutoff);
        this.sessionData = this.sessionData.filter(session => new Date(session.startTime) > cutoff);
        
        this.saveEvents();
        this.saveSessionData();
    }

    // Observer pattern
    addObserver(callback) {
        this.observers.push(callback);
    }

    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(event, data) {
        this.observers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Analytics: Observer error', error);
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
