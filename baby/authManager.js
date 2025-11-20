export class AuthManager {
	constructor() {
		this.USERS_KEY = 'pregnancy_users';
		this.CURRENT_USER_KEY = 'pregnancy_current_user';
		this.SNEAK_PEEK_KEY = 'pregnancy_sneak_peek';
	}

	signup(email, password) {
		// Validate input
		if (!this.isValidEmail(email)) {
			throw new Error('Invalid email format');
		}
		
		if (!this.isValidPassword(password)) {
			throw new Error('Password must be at least 6 characters');
		}

		const users = this.getAllUsers();
		
		if (users[email]) {
			throw new Error('Email already exists');
		}

		users[email] = {
			email: email,
			password: this.hashPassword(password),
			createdAt: new Date().toISOString(),
			profile: null,
			lastLogin: null,
			language: 'en' // Default language
		};

		try {
			localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
			return true;
		} catch (error) {
			throw new Error('Failed to save user data');
		}
	}

	signupWithProfile(email, password, name, dueDate) {
		// Validate input
		if (!this.isValidEmail(email)) {
			throw new Error('Invalid email format');
		}
		
		if (!this.isValidPassword(password)) {
			throw new Error('Password must be at least 6 characters');
		}

		if (!name || !name.trim()) {
			throw new Error('Name is required');
		}

		if (!dueDate || !(dueDate instanceof Date)) {
			throw new Error('Valid due date is required');
		}

		const users = this.getAllUsers();
		
		if (users[email]) {
			throw new Error('Email already exists');
		}

		// Create user with complete profile
		const userData = {
			email: email,
			password: this.hashPassword(password),
			createdAt: new Date().toISOString(),
			profile: {
				name: name.trim(),
				dueDate: dueDate,
				userId: this.generateUserId(name, dueDate),
				lastLogin: new Date(),
				language: 'en'
			},
			lastLogin: new Date(),
			language: 'en'
		};

		users[email] = userData;

		try {
			localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
			// Set as current user immediately
			this.setCurrentUser(userData);
			return true;
		} catch (error) {
			throw new Error('Failed to save user data');
		}
	}

	login(email, password) {
		const users = this.getAllUsers();
		const user = users[email];

		if (!user || !this.verifyPassword(password, user.password)) {
			return false;
		}

		// Set current user
		this.setCurrentUser(user);
		return true;
	}

	completeRegistration(name, dueDate) {
		const currentUser = this.getCurrentUser();
		if (!currentUser) return false;

		const userData = {
			...currentUser,
			profile: {
				name: name,
				dueDate: dueDate,
				userId: this.generateUserId(name, dueDate),
				lastLogin: new Date(),
				language: currentUser.language || 'en'
			}
		};

		// Update user in storage
		const users = this.getAllUsers();
		users[currentUser.email] = userData;
		localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

		// Set current user
		this.setCurrentUser(userData);
		return true;
	}

	setSneakPeekData(name, dueDate) {
		const sneakPeekData = {
			name: name,
			dueDate: dueDate,
			userId: 'sneakpeek_' + Date.now(),
			isSneakPeek: true
		};
		localStorage.setItem(this.SNEAK_PEEK_KEY, JSON.stringify(sneakPeekData));
	}

	getSneakPeekData() {
		const stored = localStorage.getItem(this.SNEAK_PEEK_KEY);
		return stored ? JSON.parse(stored) : null;
	}

	getCurrentUser() {
		const stored = localStorage.getItem(this.CURRENT_USER_KEY);
		return stored ? JSON.parse(stored) : null;
	}

	setCurrentUser(user) {
		localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
	}

	isLoggedIn() {
		const user = this.getCurrentUser();
		return user !== null;
	}

	hasCompletedProfile() {
		const user = this.getCurrentUser();
		return user && user.profile && user.profile.name && user.profile.dueDate;
	}

	isSneakPeek() {
		return this.getSneakPeekData() !== null;
	}

	logout() {
		localStorage.removeItem(this.CURRENT_USER_KEY);
		localStorage.removeItem(this.SNEAK_PEEK_KEY);
	}

	getUserProfile() {
		const user = this.getCurrentUser();
		return user ? user.profile : null;
	}

	getSneakPeekProfile() {
		const sneakPeek = this.getSneakPeekData();
		return sneakPeek;
	}

	getCurrentProfile() {
		if (this.isSneakPeek()) {
			return this.getSneakPeekProfile();
		}
		return this.getUserProfile();
	}

	getCurrentWeek() {
		const profile = this.getCurrentProfile();
		if (!profile || !profile.dueDate) return null;

		const today = new Date();
		const dueDate = new Date(profile.dueDate);
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

	getUserId() {
		const profile = this.getCurrentProfile();
		return profile ? profile.userId : null;
	}

	generateUserId(name, dueDate) {
		const dateStr = dueDate.toISOString().split('T')[0];
		return `${name.toLowerCase().replace(/\s+/g, '')}_${dateStr}`;
	}

	getAllUsers() {
		const stored = localStorage.getItem(this.USERS_KEY);
		return stored ? JSON.parse(stored) : {};
	}

	hashPassword(password) {
		// More secure hash for demo purposes - in production, use bcrypt or similar
		let hash = 0;
		const salt = 'pregnancy_app_salt_2024';
		const saltedPassword = password + salt;
		
		for (let i = 0; i < saltedPassword.length; i++) {
			const char = saltedPassword.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		
		// Add additional complexity
		hash = hash * 31 + password.length;
		return hash.toString(16); // Convert to hex
	}

	verifyPassword(password, hashedPassword) {
		return this.hashPassword(password) === hashedPassword;
	}

	isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	isValidPassword(password) {
		return password && password.length >= 6;
	}

	// Data integrity methods
	validateUserData(user) {
		return user && user.email && user.password && user.createdAt;
	}

	backupUserData() {
		const users = this.getAllUsers();
		const backup = {
			timestamp: new Date().toISOString(),
			users: users
		};
		localStorage.setItem('pregnancy_backup', JSON.stringify(backup));
	}

	restoreUserData() {
		const backup = localStorage.getItem('pregnancy_backup');
		if (backup) {
			const backupData = JSON.parse(backup);
			localStorage.setItem(this.USERS_KEY, JSON.stringify(backupData.users));
			return true;
		}
		return false;
	}

	updateDueDate(newDueDate) {
		const currentUser = this.getCurrentUser();
		if (!currentUser || !currentUser.profile) return false;

		// Update the profile with new due date
		const updatedUser = {
			...currentUser,
			profile: {
				...currentUser.profile,
				dueDate: newDueDate,
				userId: this.generateUserId(currentUser.profile.name, newDueDate)
			}
		};

		// Update user in storage
		const users = this.getAllUsers();
		users[currentUser.email] = updatedUser;
		localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

		// Set current user
		this.setCurrentUser(updatedUser);
		return true;
	}
}
