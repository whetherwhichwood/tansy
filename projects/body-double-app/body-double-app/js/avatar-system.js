// Avatar System - Manages virtual companions for body doubling
// Designed to provide comfort and motivation for ADHD/autistic users

class AvatarSystem {
    constructor() {
        this.avatars = this.initializeAvatars();
        this.currentAvatar = null;
        this.avatarBehaviors = this.initializeBehaviors();
        this.observers = [];
    }

    // Initialize available avatars
    initializeAvatars() {
        return [
            {
                id: 'calm',
                name: 'Calm',
                emoji: '🧘',
                description: 'Peaceful and focused companion',
                personality: 'serene',
                color: '#10b981',
                behaviors: ['meditation', 'deep_breathing', 'gentle_encouragement'],
                voice: 'soft',
                movement: 'minimal'
            },
            {
                id: 'energetic',
                name: 'Energetic',
                emoji: '⚡',
                description: 'High energy and motivation partner',
                personality: 'enthusiastic',
                color: '#f59e0b',
                behaviors: ['cheering', 'quick_movements', 'motivational_quotes'],
                voice: 'loud',
                movement: 'active'
            },
            {
                id: 'friendly',
                name: 'Friendly',
                emoji: '😊',
                description: 'Warm and encouraging friend',
                personality: 'supportive',
                color: '#3b82f6',
                behaviors: ['smiling', 'nodding', 'positive_feedback'],
                voice: 'warm',
                movement: 'friendly'
            },
            {
                id: 'serious',
                name: 'Serious',
                emoji: '🤔',
                description: 'Focused and determined colleague',
                personality: 'professional',
                color: '#6b7280',
                behaviors: ['concentrated_work', 'occasional_glances', 'firm_encouragement'],
                voice: 'steady',
                movement: 'controlled'
            },
            {
                id: 'creative',
                name: 'Creative',
                emoji: '🎨',
                description: 'Inspiring and imaginative collaborator',
                personality: 'artistic',
                color: '#8b5cf6',
                behaviors: ['creative_gestures', 'inspirational_quotes', 'artistic_movements'],
                voice: 'expressive',
                movement: 'flowing'
            },
            {
                id: 'analytical',
                name: 'Analytical',
                emoji: '📊',
                description: 'Logical and methodical partner',
                personality: 'systematic',
                color: '#06b6d4',
                behaviors: ['data_analysis', 'systematic_work', 'logical_thinking'],
                voice: 'precise',
                movement: 'methodical'
            }
        ];
    }

    // Initialize avatar behaviors and animations
    initializeBehaviors() {
        return {
            meditation: {
                name: 'Meditation',
                duration: 5000,
                animation: 'breathe',
                message: 'Let\'s take a deep breath together...',
                frequency: 0.3
            },
            deep_breathing: {
                name: 'Deep Breathing',
                duration: 3000,
                animation: 'expand_contract',
                message: 'Breathe in... breathe out...',
                frequency: 0.2
            },
            gentle_encouragement: {
                name: 'Gentle Encouragement',
                duration: 2000,
                animation: 'nod',
                message: 'You\'re doing great! Keep going.',
                frequency: 0.4
            },
            cheering: {
                name: 'Cheering',
                duration: 1500,
                animation: 'bounce',
                message: 'Yes! You\'ve got this!',
                frequency: 0.6
            },
            quick_movements: {
                name: 'Quick Movements',
                duration: 1000,
                animation: 'quick_gesture',
                message: 'Let\'s keep the energy up!',
                frequency: 0.8
            },
            motivational_quotes: {
                name: 'Motivational Quotes',
                duration: 3000,
                animation: 'point_up',
                message: 'Every step forward is progress!',
                frequency: 0.3
            },
            smiling: {
                name: 'Smiling',
                duration: 2000,
                animation: 'smile',
                message: 'I\'m here with you!',
                frequency: 0.5
            },
            nodding: {
                name: 'Nodding',
                duration: 1000,
                animation: 'nod',
                message: 'That\'s right, keep it up!',
                frequency: 0.4
            },
            positive_feedback: {
                name: 'Positive Feedback',
                duration: 2500,
                animation: 'thumbs_up',
                message: 'Excellent work!',
                frequency: 0.3
            },
            concentrated_work: {
                name: 'Concentrated Work',
                duration: 4000,
                animation: 'focus',
                message: 'Focus... we can do this together.',
                frequency: 0.2
            },
            occasional_glances: {
                name: 'Occasional Glances',
                duration: 1000,
                animation: 'glance',
                message: 'Still with you.',
                frequency: 0.1
            },
            firm_encouragement: {
                name: 'Firm Encouragement',
                duration: 2000,
                animation: 'firm_nod',
                message: 'Stay focused, you\'re making progress.',
                frequency: 0.3
            },
            creative_gestures: {
                name: 'Creative Gestures',
                duration: 2000,
                animation: 'creative_flow',
                message: 'Let your creativity flow!',
                frequency: 0.4
            },
            inspirational_quotes: {
                name: 'Inspirational Quotes',
                duration: 4000,
                animation: 'inspire',
                message: 'Creativity is intelligence having fun!',
                frequency: 0.2
            },
            artistic_movements: {
                name: 'Artistic Movements',
                duration: 3000,
                animation: 'artistic_gesture',
                message: 'Express yourself freely!',
                frequency: 0.3
            },
            data_analysis: {
                name: 'Data Analysis',
                duration: 3000,
                animation: 'analyze',
                message: 'Let\'s break this down systematically.',
                frequency: 0.2
            },
            systematic_work: {
                name: 'Systematic Work',
                duration: 4000,
                animation: 'methodical',
                message: 'One step at a time, methodically.',
                frequency: 0.1
            },
            logical_thinking: {
                name: 'Logical Thinking',
                duration: 2000,
                animation: 'think',
                message: 'Think it through logically.',
                frequency: 0.3
            }
        };
    }

    // Select an avatar
    selectAvatar(avatarId) {
        const avatar = this.avatars.find(a => a.id === avatarId);
        if (!avatar) {
            throw new Error(`Avatar with ID ${avatarId} not found`);
        }

        this.currentAvatar = avatar;
        this.notifyObservers('avatarSelected', avatar);
        return avatar;
    }

    // Get current avatar
    getCurrentAvatar() {
        return this.currentAvatar;
    }

    // Get all available avatars
    getAvatars() {
        return [...this.avatars];
    }

    // Get avatar by ID
    getAvatar(avatarId) {
        return this.avatars.find(a => a.id === avatarId);
    }

    // Start avatar behavior
    startBehavior(behaviorId) {
        if (!this.currentAvatar) return null;

        const behavior = this.avatarBehaviors[behaviorId];
        if (!behavior) return null;

        const behaviorInstance = {
            id: behaviorId,
            avatarId: this.currentAvatar.id,
            startTime: Date.now(),
            ...behavior
        };

        this.notifyObservers('behaviorStarted', behaviorInstance);
        return behaviorInstance;
    }

    // Get random behavior for current avatar
    getRandomBehavior() {
        if (!this.currentAvatar) return null;

        const availableBehaviors = this.currentAvatar.behaviors;
        const randomBehaviorId = availableBehaviors[Math.floor(Math.random() * availableBehaviors.length)];
        
        return this.startBehavior(randomBehaviorId);
    }

    // Get behavior by ID
    getBehavior(behaviorId) {
        return this.avatarBehaviors[behaviorId];
    }

    // Get all behaviors
    getBehaviors() {
        return { ...this.avatarBehaviors };
    }

    // Create custom avatar
    createCustomAvatar(avatarData) {
        const customAvatar = {
            id: `custom_${Date.now()}`,
            ...avatarData,
            isCustom: true,
            createdAt: new Date()
        };

        this.avatars.push(customAvatar);
        this.notifyObservers('avatarCreated', customAvatar);
        return customAvatar;
    }

    // Update avatar
    updateAvatar(avatarId, updates) {
        const avatar = this.avatars.find(a => a.id === avatarId);
        if (!avatar) return false;

        Object.assign(avatar, updates);
        avatar.updatedAt = new Date();
        this.notifyObservers('avatarUpdated', avatar);
        return true;
    }

    // Delete avatar (only custom ones)
    deleteAvatar(avatarId) {
        const avatarIndex = this.avatars.findIndex(a => a.id === avatarId);
        if (avatarIndex === -1) return false;

        const avatar = this.avatars[avatarIndex];
        if (!avatar.isCustom) {
            throw new Error('Cannot delete built-in avatars');
        }

        this.avatars.splice(avatarIndex, 1);
        this.notifyObservers('avatarDeleted', { id: avatarId });
        return true;
    }

    // Get avatar recommendations based on user preferences
    getRecommendations(userPreferences = {}) {
        const { personality, energyLevel, workStyle, sensoryPreferences } = userPreferences;
        
        let recommendations = [...this.avatars];

        // Filter by personality
        if (personality) {
            recommendations = recommendations.filter(avatar => 
                avatar.personality === personality
            );
        }

        // Filter by energy level
        if (energyLevel) {
            const energyMap = {
                low: ['calm', 'serious'],
                medium: ['friendly', 'analytical'],
                high: ['energetic', 'creative']
            };
            
            if (energyMap[energyLevel]) {
                recommendations = recommendations.filter(avatar => 
                    energyMap[energyLevel].includes(avatar.id)
                );
            }
        }

        // Filter by work style
        if (workStyle) {
            const workStyleMap = {
                focused: ['calm', 'serious', 'analytical'],
                creative: ['creative', 'friendly'],
                energetic: ['energetic', 'friendly']
            };
            
            if (workStyleMap[workStyle]) {
                recommendations = recommendations.filter(avatar => 
                    workStyleMap[workStyle].includes(avatar.id)
                );
            }
        }

        // Filter by sensory preferences
        if (sensoryPreferences) {
            const { lowStimulation, highStimulation, minimalMovement } = sensoryPreferences;
            
            if (lowStimulation) {
                recommendations = recommendations.filter(avatar => 
                    ['calm', 'serious'].includes(avatar.id)
                );
            }
            
            if (highStimulation) {
                recommendations = recommendations.filter(avatar => 
                    ['energetic', 'creative'].includes(avatar.id)
                );
            }
            
            if (minimalMovement) {
                recommendations = recommendations.filter(avatar => 
                    avatar.movement === 'minimal' || avatar.movement === 'controlled'
                );
            }
        }

        return recommendations;
    }

    // Get avatar usage statistics
    getUsageStats() {
        // This would typically come from analytics
        const stats = {};
        this.avatars.forEach(avatar => {
            stats[avatar.id] = {
                name: avatar.name,
                usageCount: 0,
                averageSessionLength: 0,
                userRating: 0
            };
        });
        return stats;
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
                console.error('AvatarSystem: Observer error', error);
            }
        });
    }

    // Export avatars data
    exportAvatars() {
        return {
            avatars: this.avatars,
            behaviors: this.avatarBehaviors,
            exportedAt: new Date(),
            version: '1.0.0'
        };
    }

    // Import avatars data
    importAvatars(data) {
        if (!data || !data.avatars || !Array.isArray(data.avatars)) {
            throw new Error('Invalid avatars data format');
        }

        // Merge with existing avatars
        data.avatars.forEach(importedAvatar => {
            const existingIndex = this.avatars.findIndex(a => a.id === importedAvatar.id);
            if (existingIndex >= 0) {
                this.avatars[existingIndex] = { ...this.avatars[existingIndex], ...importedAvatar };
            } else {
                this.avatars.push(importedAvatar);
            }
        });

        this.notifyObservers('avatarsImported', { count: data.avatars.length });
        return data.avatars.length;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvatarSystem;
}
