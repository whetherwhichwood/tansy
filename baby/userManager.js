export class UserManager {
	constructor() {
		this.STORAGE_KEY = 'pregnancy_user_data';
		this.USERS_KEY = 'pregnancy_users';
	}

	saveUser(userData) {
		const user = {
			...userData,
			lastLogin: new Date(),
			createdAt: userData.createdAt || new Date(),
			userId: this.generateUserId(userData.name, userData.dueDate)
		};
		
		// Save current user
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
		
		// Save to users registry
		this.saveToUsersRegistry(user);
		
		return user;
	}

	generateUserId(name, dueDate) {
		// Create a unique ID based on name and due date
		const dateStr = dueDate.toISOString().split('T')[0];
		return `${name.toLowerCase().replace(/\s+/g, '')}_${dateStr}`;
	}

	saveToUsersRegistry(user) {
		const users = this.getAllUsers();
		users[user.userId] = {
			name: user.name,
			dueDate: user.dueDate,
			createdAt: user.createdAt,
			lastLogin: user.lastLogin
		};
		localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
	}

	getAllUsers() {
		const stored = localStorage.getItem(this.USERS_KEY);
		return stored ? JSON.parse(stored) : {};
	}

	findUserByNameAndDueDate(name, dueDate) {
		const userId = this.generateUserId(name, dueDate);
		const users = this.getAllUsers();
		return users[userId] || null;
	}

	getUser() {
		const stored = localStorage.getItem(this.STORAGE_KEY);
		if (!stored) return null;
		
		try {
			const user = JSON.parse(stored);
			// Convert date strings back to Date objects
			user.dueDate = new Date(user.dueDate);
			user.lastLogin = new Date(user.lastLogin);
			user.createdAt = new Date(user.createdAt);
			return user;
		} catch (e) {
			console.error('Error parsing user data:', e);
			return null;
		}
	}

	updateLastLogin() {
		const user = this.getUser();
		if (user) {
			user.lastLogin = new Date();
			this.saveUser(user);
		}
	}

	logout() {
		localStorage.removeItem(this.STORAGE_KEY);
	}

	isLoggedIn() {
		return this.getUser() !== null;
	}

	getCurrentWeek() {
		const user = this.getUser();
		if (!user) return null;

		const today = new Date();
		const dueDate = user.dueDate;
		const timeDiff = dueDate.getTime() - today.getTime();
		const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
		const weeksUntilDue = Math.ceil(daysDiff / 7);
		const currentWeek = 40 - weeksUntilDue;
		
		return Math.min(40, Math.max(1, currentWeek));
	}

	getProgress() {
		const week = this.getCurrentWeek();
		return week ? week / 40 : 0;
	}
}
