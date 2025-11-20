// Session Manager - Handles session persistence and management
// Designed for ADHD/autistic users with clear, predictable behavior

class SessionManager {
    constructor() {
        this.sessions = this.loadSessions();
        this.currentSession = null;
        this.observers = [];
    }

    // Create a new session
    createSession(sessionData) {
        const session = {
            id: this.generateSessionId(),
            ...sessionData,
            createdAt: new Date(),
            status: 'active',
            events: []
        };

        this.sessions.push(session);
        this.currentSession = session;
        this.saveSessions();
        this.notifyObservers('sessionCreated', session);
        
        return session;
    }

    // Update session data
    updateSession(sessionId, updates) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return false;

        Object.assign(session, updates);
        session.updatedAt = new Date();
        this.saveSessions();
        this.notifyObservers('sessionUpdated', session);
        
        return true;
    }

    // Complete a session
    completeSession(sessionId, completionData = {}) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return false;

        session.status = 'completed';
        session.completedAt = new Date();
        session.actualDuration = completionData.actualDuration || session.duration;
        session.focusLevel = completionData.focusLevel || 'unknown';
        session.notes = completionData.notes || '';

        this.saveSessions();
        this.notifyObservers('sessionCompleted', session);
        
        return true;
    }

    // Pause a session
    pauseSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return false;

        session.status = 'paused';
        session.pausedAt = new Date();
        this.addSessionEvent(sessionId, 'paused', { timestamp: new Date() });
        
        this.saveSessions();
        this.notifyObservers('sessionPaused', session);
        
        return true;
    }

    // Resume a session
    resumeSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return false;

        session.status = 'active';
        session.resumedAt = new Date();
        this.addSessionEvent(sessionId, 'resumed', { timestamp: new Date() });
        
        this.saveSessions();
        this.notifyObservers('sessionResumed', session);
        
        return true;
    }

    // Add an event to a session
    addSessionEvent(sessionId, eventType, eventData = {}) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return false;

        const event = {
            type: eventType,
            timestamp: new Date(),
            data: eventData
        };

        session.events.push(event);
        this.saveSessions();
        
        return true;
    }

    // Get session by ID
    getSession(sessionId) {
        return this.sessions.find(s => s.id === sessionId);
    }

    // Get all sessions
    getAllSessions() {
        return [...this.sessions];
    }

    // Get sessions by date range
    getSessionsByDateRange(startDate, endDate) {
        return this.sessions.filter(session => {
            const sessionDate = new Date(session.createdAt);
            return sessionDate >= startDate && sessionDate <= endDate;
        });
    }

    // Get today's sessions
    getTodaysSessions() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return this.getSessionsByDateRange(today, tomorrow);
    }

    // Get this week's sessions
    getThisWeeksSessions() {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        
        return this.getSessionsByDateRange(startOfWeek, endOfWeek);
    }

    // Get session statistics
    getSessionStats() {
        const completedSessions = this.sessions.filter(s => s.status === 'completed');
        const totalSessions = completedSessions.length;
        const totalDuration = completedSessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);
        const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
        
        // Calculate streak
        const streak = this.calculateStreak();
        
        // Calculate focus level distribution
        const focusLevels = completedSessions.reduce((acc, s) => {
            const level = s.focusLevel || 'unknown';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {});

        return {
            totalSessions,
            totalDuration,
            averageDuration,
            streak,
            focusLevels,
            todaysSessions: this.getTodaysSessions().length,
            thisWeeksSessions: this.getThisWeeksSessions().length
        };
    }

    // Calculate current streak
    calculateStreak() {
        const completedSessions = this.sessions
            .filter(s => s.status === 'completed')
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

        if (completedSessions.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < completedSessions.length; i++) {
            const sessionDate = new Date(completedSessions[i].completedAt);
            sessionDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
            
            if (i === 0) {
                if (daysDiff === 0) {
                    streak = 1;
                } else if (daysDiff === 1) {
                    streak = 1;
                } else {
                    break;
                }
            } else {
                const prevSessionDate = new Date(completedSessions[i - 1].completedAt);
                prevSessionDate.setHours(0, 0, 0, 0);
                const prevDaysDiff = Math.floor((today - prevSessionDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff === prevDaysDiff + 1) {
                    streak++;
                } else {
                    break;
                }
            }
        }

        return streak;
    }

    // Export sessions data
    exportSessions() {
        return {
            sessions: this.sessions,
            exportedAt: new Date(),
            version: '1.0.0'
        };
    }

    // Import sessions data
    importSessions(data) {
        if (!data || !data.sessions || !Array.isArray(data.sessions)) {
            throw new Error('Invalid sessions data format');
        }

        // Merge with existing sessions (avoid duplicates)
        const existingIds = new Set(this.sessions.map(s => s.id));
        const newSessions = data.sessions.filter(s => !existingIds.has(s.id));
        
        this.sessions.push(...newSessions);
        this.saveSessions();
        this.notifyObservers('sessionsImported', { count: newSessions.length });
        
        return newSessions.length;
    }

    // Clear all sessions (with confirmation)
    clearAllSessions() {
        this.sessions = [];
        this.currentSession = null;
        this.saveSessions();
        this.notifyObservers('sessionsCleared');
    }

    // Observer pattern for real-time updates
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
                console.error('SessionManager: Observer error', error);
            }
        });
    }

    // Persistence methods
    loadSessions() {
        try {
            const saved = localStorage.getItem('bodyDoubleSessions');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('SessionManager: Failed to load sessions', error);
            return [];
        }
    }

    saveSessions() {
        try {
            localStorage.setItem('bodyDoubleSessions', JSON.stringify(this.sessions));
        } catch (error) {
            console.error('SessionManager: Failed to save sessions', error);
        }
    }

    // Utility methods
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionManager;
}
