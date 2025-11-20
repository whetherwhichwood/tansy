export class JournalManager {
	constructor() {
		this.JOURNAL_PREFIX = 'pregnancy_journal_';
		this.MAX_ENTRIES_PER_USER = 100;
	}

	/**
	 * Get a unique storage key for a user's journal entries
	 * @param {string} userId - The user's unique identifier
	 * @returns {string} - The storage key
	 */
	getJournalKey(userId) {
		if (!userId) {
			throw new Error('User ID is required for journal access');
		}
		return `${this.JOURNAL_PREFIX}${userId}`;
	}

	/**
	 * Save a journal entry for a specific user
	 * @param {Object} entry - The journal entry object
	 * @param {string} userId - The user's unique identifier
	 * @returns {boolean} - Success status
	 */
	saveEntry(entry, userId) {
		try {
			if (!userId) {
				throw new Error('User ID is required to save journal entry');
			}

			// Validate entry
			if (!entry || !entry.content || !entry.date) {
				throw new Error('Invalid journal entry data');
			}

			// Add user ID to entry for extra security
			entry.userId = userId;
			entry.id = this.generateEntryId(entry);

			// Get existing entries
			const entries = this.getEntries(userId);
			
			// Add new entry to beginning
			entries.unshift(entry);
			
			// Limit entries per user
			if (entries.length > this.MAX_ENTRIES_PER_USER) {
				entries.splice(this.MAX_ENTRIES_PER_USER);
			}
			
			// Save to localStorage
			const key = this.getJournalKey(userId);
			localStorage.setItem(key, JSON.stringify(entries));
			
			return true;
		} catch (error) {
			console.error('Error saving journal entry:', error);
			return false;
		}
	}

	/**
	 * Get all journal entries for a specific user
	 * @param {string} userId - The user's unique identifier
	 * @returns {Array} - Array of journal entries
	 */
	getEntries(userId) {
		try {
			if (!userId) {
				console.warn('No user ID provided for journal access');
				return [];
			}

			const key = this.getJournalKey(userId);
			const stored = localStorage.getItem(key);
			
			if (!stored) {
				return [];
			}

			const entries = JSON.parse(stored);
			
			// Validate that all entries belong to this user
			return entries.filter(entry => entry.userId === userId);
		} catch (error) {
			console.error('Error retrieving journal entries:', error);
			return [];
		}
	}

	/**
	 * Delete a specific journal entry
	 * @param {string} entryId - The entry's unique identifier
	 * @param {string} userId - The user's unique identifier
	 * @returns {boolean} - Success status
	 */
	deleteEntry(entryId, userId) {
		try {
			if (!userId || !entryId) {
				throw new Error('User ID and Entry ID are required');
			}

			const entries = this.getEntries(userId);
			const filteredEntries = entries.filter(entry => entry.id !== entryId);
			
			if (filteredEntries.length === entries.length) {
				console.warn('Entry not found or does not belong to user');
				return false;
			}

			const key = this.getJournalKey(userId);
			localStorage.setItem(key, JSON.stringify(filteredEntries));
			
			return true;
		} catch (error) {
			console.error('Error deleting journal entry:', error);
			return false;
		}
	}

	/**
	 * Clear all journal entries for a user
	 * @param {string} userId - The user's unique identifier
	 * @returns {boolean} - Success status
	 */
	clearUserJournal(userId) {
		try {
			if (!userId) {
				throw new Error('User ID is required');
			}

			const key = this.getJournalKey(userId);
			localStorage.removeItem(key);
			return true;
		} catch (error) {
			console.error('Error clearing user journal:', error);
			return false;
		}
	}

	/**
	 * Generate a unique ID for a journal entry
	 * @param {Object} entry - The journal entry object
	 * @returns {string} - Unique entry ID
	 */
	generateEntryId(entry) {
		const timestamp = new Date(entry.date).getTime();
		const contentHash = this.simpleHash(entry.content);
		return `${entry.userId}_${timestamp}_${contentHash}`;
	}

	/**
	 * Simple hash function for content
	 * @param {string} str - String to hash
	 * @returns {string} - Hash value
	 */
	simpleHash(str) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash).toString(36);
	}

	/**
	 * Get journal statistics for a user
	 * @param {string} userId - The user's unique identifier
	 * @returns {Object} - Statistics object
	 */
	getUserStats(userId) {
		const entries = this.getEntries(userId);
		const now = new Date();
		const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		return {
			totalEntries: entries.length,
			entriesThisWeek: entries.filter(entry => new Date(entry.date) >= oneWeekAgo).length,
			entriesThisMonth: entries.filter(entry => new Date(entry.date) >= oneMonthAgo).length,
			lastEntry: entries.length > 0 ? entries[0].date : null,
			hasImages: entries.filter(entry => entry.image).length
		};
	}

	/**
	 * Validate that a user can access specific journal data
	 * @param {string} userId - The user's unique identifier
	 * @param {string} requestedUserId - The requested user ID
	 * @returns {boolean} - Whether access is allowed
	 */
	validateAccess(userId, requestedUserId) {
		return userId === requestedUserId;
	}

	/**
	 * Get all journal keys in localStorage (for debugging)
	 * @returns {Array} - Array of journal keys
	 */
	getAllJournalKeys() {
		const keys = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(this.JOURNAL_PREFIX)) {
				keys.push(key);
			}
		}
		return keys;
	}

	/**
	 * Clean up orphaned journal entries (entries without valid users)
	 * @param {Array} validUserIds - Array of valid user IDs
	 * @returns {number} - Number of entries cleaned up
	 */
	cleanupOrphanedEntries(validUserIds) {
		let cleanedCount = 0;
		const journalKeys = this.getAllJournalKeys();
		
		journalKeys.forEach(key => {
			const userId = key.replace(this.JOURNAL_PREFIX, '');
			if (!validUserIds.includes(userId)) {
				localStorage.removeItem(key);
				cleanedCount++;
			}
		});
		
		return cleanedCount;
	}
}
