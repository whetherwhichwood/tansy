// Timer System - Advanced timer functionality for focus sessions
// Designed for ADHD/autistic users with clear visual feedback and gentle notifications

class Timer {
    constructor(duration, options = {}) {
        this.duration = duration; // in seconds
        this.remaining = duration;
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.interval = null;
        this.callbacks = {
            onTick: options.onTick || (() => {}),
            onComplete: options.onComplete || (() => {}),
            onPause: options.onPause || (() => {}),
            onResume: options.onResume || (() => {}),
            onStop: options.onStop || (() => {})
        };
        
        // Timer settings
        this.settings = {
            showMilliseconds: false,
            updateInterval: 1000, // milliseconds
            warningThreshold: 300, // 5 minutes
            criticalThreshold: 60, // 1 minute
            gentleNotifications: true,
            visualFeedback: true,
            soundEnabled: false,
            vibrationEnabled: false
        };

        // Merge with provided options
        Object.assign(this.settings, options.settings || {});
        
        this.observers = [];
        this.events = [];
    }

    // Start the timer
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.pausedTime = 0;
        
        this.addEvent('started', { timestamp: new Date() });
        this.notifyObservers('timerStarted', this.getState());
        
        this.interval = setInterval(() => {
            this.tick();
        }, this.settings.updateInterval);
    }

    // Pause the timer
    pause() {
        if (!this.isRunning || this.isPaused) return;

        this.isPaused = true;
        this.pausedTime = Date.now();
        clearInterval(this.interval);
        
        this.addEvent('paused', { timestamp: new Date() });
        this.notifyObservers('timerPaused', this.getState());
        this.callbacks.onPause();
    }

    // Resume the timer
    resume() {
        if (!this.isRunning || !this.isPaused) return;

        this.isPaused = false;
        this.startTime += Date.now() - this.pausedTime;
        this.pausedTime = 0;
        
        this.addEvent('resumed', { timestamp: new Date() });
        this.notifyObservers('timerResumed', this.getState());
        this.callbacks.onResume();
        
        this.interval = setInterval(() => {
            this.tick();
        }, this.settings.updateInterval);
    }

    // Stop the timer
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.interval);
        
        this.addEvent('stopped', { timestamp: new Date() });
        this.notifyObservers('timerStopped', this.getState());
        this.callbacks.onStop();
    }

    // Reset the timer
    reset() {
        this.stop();
        this.remaining = this.duration;
        this.startTime = null;
        this.pausedTime = 0;
        this.events = [];
        
        this.addEvent('reset', { timestamp: new Date() });
        this.notifyObservers('timerReset', this.getState());
    }

    // Set new duration
    setDuration(newDuration) {
        const wasRunning = this.isRunning;
        this.stop();
        this.duration = newDuration;
        this.remaining = newDuration;
        
        if (wasRunning) {
            this.start();
        }
        
        this.addEvent('durationChanged', { 
            timestamp: new Date(), 
            newDuration, 
            oldDuration: this.duration 
        });
        this.notifyObservers('timerDurationChanged', this.getState());
    }

    // Add time to the timer
    addTime(seconds) {
        this.remaining += seconds;
        this.duration += seconds;
        
        this.addEvent('timeAdded', { 
            timestamp: new Date(), 
            secondsAdded: seconds 
        });
        this.notifyObservers('timerTimeAdded', this.getState());
    }

    // Subtract time from the timer
    subtractTime(seconds) {
        this.remaining = Math.max(0, this.remaining - seconds);
        
        this.addEvent('timeSubtracted', { 
            timestamp: new Date(), 
            secondsSubtracted: seconds 
        });
        this.notifyObservers('timerTimeSubtracted', this.getState());
    }

    // Main tick function
    tick() {
        if (!this.isRunning || this.isPaused) return;

        const now = Date.now();
        const elapsed = Math.floor((now - this.startTime) / 1000);
        this.remaining = Math.max(0, this.duration - elapsed);

        // Update display
        this.updateDisplay();
        
        // Check for warnings
        this.checkWarnings();
        
        // Call tick callback
        this.callbacks.onTick(this.getState());
        this.notifyObservers('timerTick', this.getState());

        // Check if completed
        if (this.remaining <= 0) {
            this.complete();
        }
    }

    // Update the display
    updateDisplay() {
        const display = this.formatTime(this.remaining);
        
        // Update timer display element
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = display;
        }

        // Update progress bar
        const progress = ((this.duration - this.remaining) / this.duration) * 100;
        const timerBar = document.getElementById('timer-bar');
        if (timerBar) {
            timerBar.style.width = `${progress}%`;
            
            // Add visual feedback based on remaining time
            if (this.remaining <= this.settings.criticalThreshold) {
                timerBar.style.backgroundColor = '#ef4444'; // Red
            } else if (this.remaining <= this.settings.warningThreshold) {
                timerBar.style.backgroundColor = '#f59e0b'; // Orange
            } else {
                timerBar.style.backgroundColor = '#6366f1'; // Blue
            }
        }

        // Update page title
        document.title = `${display} - Body Double Virtual Space`;
    }

    // Check for warnings and notifications
    checkWarnings() {
        if (this.remaining === this.settings.warningThreshold) {
            this.showNotification('5 minutes remaining!', 'warning');
            this.triggerGentleNotification('warning');
        } else if (this.remaining === this.settings.criticalThreshold) {
            this.showNotification('1 minute remaining!', 'critical');
            this.triggerGentleNotification('critical');
        }
    }

    // Show gentle notification
    triggerGentleNotification(type) {
        if (!this.settings.gentleNotifications) return;

        const notification = document.createElement('div');
        notification.className = `timer-notification timer-notification-${type}`;
        
        const message = type === 'warning' ? '5 minutes left' : '1 minute left';
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--surface);
            color: var(--text-primary);
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            border: 2px solid ${type === 'warning' ? '#f59e0b' : '#ef4444'};
            z-index: 1000;
            font-size: 1.2rem;
            font-weight: 600;
            animation: gentlePulse 2s ease-in-out;
        `;

        document.body.appendChild(notification);

        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 2000);

        // Trigger vibration if enabled
        if (this.settings.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(type === 'warning' ? [200, 100, 200] : [300, 100, 300]);
        }
    }

    // Complete the timer
    complete() {
        this.stop();
        this.remaining = 0;
        
        this.addEvent('completed', { timestamp: new Date() });
        this.notifyObservers('timerCompleted', this.getState());
        
        // Show completion notification
        this.showNotification('Session complete! Great job!', 'success');
        this.triggerGentleNotification('complete');
        
        // Call completion callback
        this.callbacks.onComplete(this.getState());
    }

    // Format time for display
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        
        if (this.settings.showMilliseconds) {
            const ms = Math.floor((seconds % 1) * 1000);
            return `${minutes}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
        }
        
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Get current timer state
    getState() {
        return {
            duration: this.duration,
            remaining: this.remaining,
            elapsed: this.duration - this.remaining,
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            progress: ((this.duration - this.remaining) / this.duration) * 100,
            startTime: this.startTime,
            pausedTime: this.pausedTime,
            events: [...this.events]
        };
    }

    // Get elapsed time
    getElapsedTime() {
        if (!this.startTime) return 0;
        
        const now = Date.now();
        const totalElapsed = Math.floor((now - this.startTime) / 1000);
        return totalElapsed - this.pausedTime;
    }

    // Get remaining time
    getRemainingTime() {
        return this.remaining;
    }

    // Get progress percentage
    getProgress() {
        return ((this.duration - this.remaining) / this.duration) * 100;
    }

    // Add event to history
    addEvent(type, data = {}) {
        this.events.push({
            type,
            timestamp: new Date(),
            data
        });
    }

    // Get event history
    getEvents() {
        return [...this.events];
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `timer-notification timer-notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
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
                console.error('Timer: Observer error', error);
            }
        });
    }

    // Update settings
    updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        this.notifyObservers('timerSettingsUpdated', this.settings);
    }

    // Export timer data
    exportData() {
        return {
            duration: this.duration,
            events: this.events,
            settings: this.settings,
            exportedAt: new Date(),
            version: '1.0.0'
        };
    }

    // Static utility methods
    static formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    static parseTimeString(timeString) {
        // Parse time strings like "25:00", "1:30:00", "45"
        const parts = timeString.split(':').map(Number);
        
        if (parts.length === 1) {
            // Just seconds
            return parts[0];
        } else if (parts.length === 2) {
            // Minutes:seconds
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            // Hours:minutes:seconds
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        
        throw new Error('Invalid time format');
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes gentlePulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.9; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Timer;
}
