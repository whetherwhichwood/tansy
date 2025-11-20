// Body Double Virtual Space - Main Application
// ADHD/Autistic-friendly design with clear structure and minimal cognitive load

// Import required classes (they will be loaded via script tags)
// Analytics and Timer classes are defined in separate files

class BodyDoubleApp {
    constructor() {
        this.currentSession = null;
        this.userProfile = this.loadUserProfile();
        this.avatars = this.initializeAvatars();
        this.analytics = null; // Will be initialized after Analytics class is loaded
        this.timer = null; // Will be initialized when needed
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoadingScreen();
        
        // Initialize analytics after classes are loaded
        this.initializeAnalytics();
        
        // Simulate app initialization
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showSessionSetup();
        }, 2000);
    }

    initializeAnalytics() {
        // Wait for Analytics class to be available
        if (typeof Analytics !== 'undefined') {
            this.analytics = new Analytics();
        } else {
            // Fallback: create a simple analytics object
            this.analytics = {
                track: () => {},
                trackSessionStart: () => {},
                trackSessionComplete: () => {},
                trackSessionStop: () => {}
            };
        }
    }

    setupEventListeners() {
        // Session setup
        document.getElementById('start-session-btn')?.addEventListener('click', () => {
            this.startSession();
        });

        // Session controls
        document.getElementById('pause-btn')?.addEventListener('click', () => {
            this.pauseSession();
        });

        document.getElementById('stop-btn')?.addEventListener('click', () => {
            this.stopSession();
        });

        // Session complete actions
        document.getElementById('start-new-session')?.addEventListener('click', () => {
            this.showSessionSetup();
        });

        document.getElementById('view-progress')?.addEventListener('click', () => {
            this.showProgress();
        });

        // Settings
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.showSettings();
        });

        // Avatar selection
        this.setupAvatarSelection();
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
    }

    showSessionSetup() {
        this.hideAllSections();
        document.getElementById('session-setup').classList.remove('hidden');
        this.populateAvatars();
        this.updateUserInfo();
    }

    showActiveSession() {
        this.hideAllSections();
        document.getElementById('active-session').classList.remove('hidden');
    }

    showSessionComplete() {
        this.hideAllSections();
        document.getElementById('session-complete').classList.remove('hidden');
        this.updateCompletionStats();
    }

    hideAllSections() {
        const sections = ['session-setup', 'active-session', 'session-complete'];
        sections.forEach(section => {
            document.getElementById(section).classList.add('hidden');
        });
    }

    startSession() {
        const sessionType = document.getElementById('session-type').value;
        const duration = parseInt(document.getElementById('session-duration').value);
        const taskDescription = document.getElementById('task-description').value;
        const selectedAvatar = document.querySelector('.avatar-option.selected')?.dataset.avatar;

        if (!taskDescription.trim()) {
            this.showNotification('Please describe what you\'re working on', 'warning');
            return;
        }

        if (!selectedAvatar) {
            this.showNotification('Please select a virtual companion', 'warning');
            return;
        }

        // Create session
        this.currentSession = {
            id: this.generateSessionId(),
            type: sessionType,
            duration: duration,
            task: taskDescription,
            avatar: selectedAvatar,
            startTime: new Date(),
            isPaused: false,
            isCompleted: false
        };

        // Start timer
        if (typeof Timer !== 'undefined') {
            this.timer = new Timer(duration * 60, () => {
                this.completeSession();
            });
        } else {
            // Fallback timer implementation
            this.timer = this.createFallbackTimer(duration * 60, () => {
                this.completeSession();
            });
        }

        // Update UI
        this.updateSessionUI();
        this.showActiveSession();
        this.timer.start();

        // Track analytics
        this.analytics.trackSessionStart(this.currentSession);
    }

    pauseSession() {
        if (!this.currentSession || this.currentSession.isCompleted) return;

        if (this.currentSession.isPaused) {
            this.timer.resume();
            this.currentSession.isPaused = false;
            document.getElementById('pause-btn').textContent = '⏸️';
        } else {
            this.timer.pause();
            this.currentSession.isPaused = true;
            document.getElementById('pause-btn').textContent = '▶️';
        }
    }

    stopSession() {
        if (!this.currentSession) return;

        if (confirm('Are you sure you want to stop this session? Progress will be saved.')) {
            this.timer.stop();
            this.currentSession.isCompleted = true;
            this.currentSession.endTime = new Date();
            this.currentSession.actualDuration = this.timer.getElapsedTime();
            
            this.analytics.trackSessionStop(this.currentSession);
            this.showSessionComplete();
        }
    }

    completeSession() {
        if (!this.currentSession) return;

        this.currentSession.isCompleted = true;
        this.currentSession.endTime = new Date();
        this.currentSession.actualDuration = this.currentSession.duration * 60;

        // Update user stats
        this.updateUserStats();
        
        // Track analytics
        this.analytics.trackSessionComplete(this.currentSession);
        
        // Show completion screen
        this.showSessionComplete();
    }

    updateSessionUI() {
        if (!this.currentSession) return;

        // Update task description
        document.getElementById('session-task').textContent = this.currentSession.task;

        // Update avatar
        const avatarElement = document.getElementById('companion-avatar');
        const selectedAvatar = this.avatars.find(a => a.id === this.currentSession.avatar);
        if (selectedAvatar) {
            avatarElement.innerHTML = `<div class="avatar-emoji">${selectedAvatar.emoji}</div>`;
        }

        // Update companion status
        const statusMessages = [
            'Your companion is working alongside you',
            'Focusing together on our tasks',
            'Staying motivated and productive',
            'Working in harmony with you'
        ];
        
        let statusIndex = 0;
        setInterval(() => {
            document.getElementById('companion-status').textContent = 
                statusMessages[statusIndex % statusMessages.length];
            statusIndex++;
        }, 10000); // Change every 10 seconds

        // Update stats
        this.updateSessionStats();
    }

    updateSessionStats() {
        // This would be updated in real-time
        const streak = this.userProfile.streak || 0;
        const sessionsToday = this.userProfile.sessionsToday || 0;
        const totalTime = this.userProfile.totalTime || 0;

        document.getElementById('focus-streak').textContent = `${streak} days`;
        document.getElementById('sessions-today').textContent = sessionsToday;
        document.getElementById('total-time').textContent = this.formatTime(totalTime);
    }

    updateCompletionStats() {
        if (!this.currentSession) return;

        const duration = this.currentSession.actualDuration || this.currentSession.duration * 60;
        const focusLevel = this.calculateFocusLevel();

        document.getElementById('completed-duration').textContent = this.formatTime(duration);
        document.getElementById('focus-level').textContent = focusLevel;
    }

    calculateFocusLevel() {
        // Simple focus level calculation based on session completion
        if (!this.currentSession) return 'Unknown';
        
        const completionRate = this.currentSession.actualDuration / (this.currentSession.duration * 60);
        
        if (completionRate >= 0.95) return 'Excellent';
        if (completionRate >= 0.8) return 'Good';
        if (completionRate >= 0.6) return 'Fair';
        return 'Needs Improvement';
    }

    setupAvatarSelection() {
        const avatarGrid = document.getElementById('avatar-grid');
        if (!avatarGrid) return;

        avatarGrid.addEventListener('click', (e) => {
            const avatarOption = e.target.closest('.avatar-option');
            if (!avatarOption) return;

            // Remove previous selection
            document.querySelectorAll('.avatar-option').forEach(option => {
                option.classList.remove('selected');
            });

            // Add selection to clicked option
            avatarOption.classList.add('selected');
        });
    }

    populateAvatars() {
        const avatarGrid = document.getElementById('avatar-grid');
        if (!avatarGrid) return;

        avatarGrid.innerHTML = this.avatars.map(avatar => `
            <div class="avatar-option" data-avatar="${avatar.id}">
                <div class="avatar-emoji">${avatar.emoji}</div>
                <div class="avatar-name">${avatar.name}</div>
            </div>
        `).join('');
    }

    initializeAvatars() {
        return [
            { id: 'calm', name: 'Calm', emoji: '🧘', description: 'Peaceful and focused' },
            { id: 'energetic', name: 'Energetic', emoji: '⚡', description: 'High energy and motivation' },
            { id: 'friendly', name: 'Friendly', emoji: '😊', description: 'Warm and encouraging' },
            { id: 'serious', name: 'Serious', emoji: '🤔', description: 'Focused and determined' },
            { id: 'creative', name: 'Creative', emoji: '🎨', description: 'Inspiring and imaginative' },
            { id: 'analytical', name: 'Analytical', emoji: '📊', description: 'Logical and methodical' }
        ];
    }

    loadUserProfile() {
        const saved = localStorage.getItem('bodyDoubleProfile');
        if (saved) {
            return JSON.parse(saved);
        }

        return {
            name: 'User',
            streak: 0,
            sessionsToday: 0,
            totalTime: 0,
            preferences: {
                defaultDuration: 25,
                defaultType: 'solo',
                notifications: true
            }
        };
    }

    saveUserProfile() {
        localStorage.setItem('bodyDoubleProfile', JSON.stringify(this.userProfile));
    }

    updateUserStats() {
        if (!this.currentSession) return;

        // Update streak
        const today = new Date().toDateString();
        const lastSessionDate = this.userProfile.lastSessionDate;
        
        if (lastSessionDate === today) {
            // Already counted today
        } else if (lastSessionDate === this.getYesterday()) {
            // Consecutive day
            this.userProfile.streak++;
        } else {
            // Streak broken
            this.userProfile.streak = 1;
        }

        this.userProfile.lastSessionDate = today;
        this.userProfile.sessionsToday++;
        this.userProfile.totalTime += this.currentSession.actualDuration || this.currentSession.duration * 60;

        this.saveUserProfile();
    }

    getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toDateString();
    }

    updateUserInfo() {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = `Hi, ${this.userProfile.name}!`;
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
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

    showProgress() {
        // This would show a detailed progress screen
        this.showNotification('Progress view coming soon!', 'info');
    }

    showSettings() {
        // This would show settings modal
        this.showNotification('Settings coming soon!', 'info');
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    // Fallback timer implementation
    createFallbackTimer(duration, onComplete) {
        return {
            duration: duration,
            remaining: duration,
            isRunning: false,
            isPaused: false,
            interval: null,
            
            start: function() {
                this.isRunning = true;
                this.interval = setInterval(() => {
                    this.remaining--;
                    this.updateDisplay();
                    if (this.remaining <= 0) {
                        this.complete();
                    }
                }, 1000);
            },
            
            pause: function() {
                this.isPaused = true;
                clearInterval(this.interval);
            },
            
            resume: function() {
                this.isPaused = false;
                this.start();
            },
            
            stop: function() {
                this.isRunning = false;
                clearInterval(this.interval);
            },
            
            complete: function() {
                this.stop();
                if (onComplete) onComplete();
            },
            
            updateDisplay: function() {
                const minutes = Math.floor(this.remaining / 60);
                const seconds = this.remaining % 60;
                const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                const timerDisplay = document.getElementById('timer-display');
                if (timerDisplay) {
                    timerDisplay.textContent = display;
                }
                
                const progress = ((this.duration - this.remaining) / this.duration) * 100;
                const timerBar = document.getElementById('timer-bar');
                if (timerBar) {
                    timerBar.style.width = `${progress}%`;
                }
            },
            
            getElapsedTime: function() {
                return this.duration - this.remaining;
            }
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BodyDoubleApp();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
