import { AuthManager } from './authManager.js';
import { LanguageToggle } from './languageToggle.js';

const el = sel => document.querySelector(sel);
const authManager = new AuthManager();
const languageToggle = new LanguageToggle();

// Check if user is already logged in and redirect to home
if (authManager.isLoggedIn()) {
	// User already logged in, redirecting to home
	window.location.href = 'home.html';
}

document.addEventListener('DOMContentLoaded', () => {
	// Update page title and header with translation
	const pageTitle = el('title');
	const pageHeader = el('#pageHeader');
	if (pageTitle) {
		pageTitle.textContent = languageToggle.translate('pageTitle.landing');
	}
	if (pageHeader) {
		pageHeader.textContent = languageToggle.translate('pageHeader.landing');
	}
	
	// Update footer disclaimer with translation
	const footerDisclaimer = el('#footerDisclaimer');
	if (footerDisclaimer) {
		footerDisclaimer.textContent = languageToggle.translate('common.disclaimer');
	}
	
	renderLandingPage();
	setupEventListeners();
	
	// Ensure language toggle is properly created after rendering
	setTimeout(() => {
		languageToggle.createToggle();
		languageToggle.updateDisplay();
		languageToggle.bindEvents();
	}, 100);
});

function renderLandingPage() {
	const container = el('#app');
	
	container.innerHTML = `
		<div class="landing-container">
			<!-- Hero Section -->
			<section class="card hero-card">
				<div class="hero-content">
					<h2 class="hero-title">${languageToggle.translate('landing.title')}</h2>
					<p class="hero-subtitle">${languageToggle.translate('landing.subtitle')}</p>
				</div>
			</section>

			<!-- Action Cards -->
			<section class="card actions-card">
				<h3>${languageToggle.translate('landing.getStarted')}</h3>
				<div class="action-grid">
					<div class="action-card" id="loginCard">
						<div class="action-icon">🔐</div>
						<h4>${languageToggle.translate('landing.login')}</h4>
						<p>${languageToggle.translate('landing.loginDesc')}</p>
						<button class="btn-primary action-btn" id="loginBtn">${languageToggle.translate('landing.login')}</button>
					</div>
					
					<div class="action-card" id="signupCard">
						<div class="action-icon">✨</div>
						<h4>${languageToggle.translate('landing.signup')}</h4>
						<p>${languageToggle.translate('landing.signupDesc')}</p>
						<button class="btn-primary action-btn" id="signupBtn">${languageToggle.translate('landing.signup')}</button>
					</div>
					
					<div class="action-card" id="sneakPeekCard">
						<div class="action-icon">👀</div>
						<h4>${languageToggle.translate('landing.sneakPeek')}</h4>
						<p>${languageToggle.translate('landing.sneakPeekDesc')}</p>
						<button class="btn-primary action-btn" id="sneakPeekBtn">${languageToggle.translate('landing.takeLook')}</button>
					</div>
				</div>
			</section>

			<!-- Features Preview -->
			<section class="card features-card">
				<h3>${languageToggle.translate('landing.features')}</h3>
				<div class="features-grid">
					<div class="feature-item">
						<div class="feature-icon">📅</div>
						<h4>${languageToggle.translate('landing.weeklyUpdates')}</h4>
						<p>${languageToggle.translate('landing.weeklyUpdatesDesc')}</p>
					</div>
					<div class="feature-item">
						<div class="feature-icon">📝</div>
						<h4>${languageToggle.translate('landing.journal')}</h4>
						<p>${languageToggle.translate('landing.journalDesc')}</p>
					</div>
					<div class="feature-item">
						<div class="feature-icon">📊</div>
						<h4>${languageToggle.translate('landing.progress')}</h4>
						<p>${languageToggle.translate('landing.progressDesc')}</p>
					</div>
					<div class="feature-item">
						<div class="feature-icon">💡</div>
						<h4>${languageToggle.translate('landing.tips')}</h4>
						<p>${languageToggle.translate('landing.tipsDesc')}</p>
					</div>
				</div>
			</section>
		</div>

		<!-- Login Modal -->
		<div id="loginModal" class="modal hidden">
			<div class="modal-content">
				<div class="modal-header">
					<h3>${languageToggle.translate('auth.login')}</h3>
					<button class="close-btn" onclick="closeModal('loginModal')">&times;</button>
				</div>
				<form id="loginForm" class="auth-form">
					<div class="input-group">
						<label for="loginEmail">${languageToggle.translate('auth.email')}</label>
						<input type="email" id="loginEmail" required />
					</div>
					<div class="input-group">
						<label for="loginPassword">${languageToggle.translate('auth.password')}</label>
						<input type="password" id="loginPassword" required />
					</div>
					<button type="submit" class="btn-primary">${languageToggle.translate('auth.login')}</button>
				</form>
			</div>
		</div>

		<!-- Signup Modal -->
		<div id="signupModal" class="modal hidden">
			<div class="modal-content">
				<div class="modal-header">
					<h3>${languageToggle.translate('auth.createAccount')}</h3>
					<button class="close-btn" onclick="closeModal('signupModal')">&times;</button>
				</div>
				<form id="signupForm" class="auth-form">
					<div class="input-group">
						<label for="signupEmail">${languageToggle.translate('auth.email')}</label>
						<input type="email" id="signupEmail" required />
					</div>
					<div class="input-group">
						<label for="signupPassword">${languageToggle.translate('auth.password')}</label>
						<input type="password" id="signupPassword" required minlength="6" />
					</div>
					<div class="input-group">
						<label for="confirmPassword">${languageToggle.translate('auth.confirmPassword')}</label>
						<input type="password" id="confirmPassword" required />
					</div>
					<div class="input-group">
						<label for="signupName">${languageToggle.translate('auth.name')}</label>
						<input type="text" id="signupName" required />
					</div>
					<div class="input-group">
						<label for="signupDueDate">${languageToggle.translate('auth.dueDate')}</label>
						<input type="date" id="signupDueDate" required />
					</div>
					<button type="submit" class="btn-primary">${languageToggle.translate('auth.createAccount')}</button>
				</form>
			</div>
		</div>

		<!-- Due Date Modal (for existing users and sneak peek) -->
		<div id="dueDateModal" class="modal hidden">
			<div class="modal-content">
				<div class="modal-header">
					<h3 id="dueDateTitle">${languageToggle.translate('auth.completeProfile')}</h3>
					<button class="close-btn" onclick="closeModal('dueDateModal')">&times;</button>
				</div>
				<form id="dueDateForm" class="auth-form">
					<div class="input-group">
						<label for="userName">${languageToggle.translate('auth.name')}</label>
						<input type="text" id="userName" required />
					</div>
					<div class="input-group">
						<label for="dueDate">${languageToggle.translate('auth.dueDate')}</label>
						<input type="date" id="dueDate" required />
					</div>
					<button type="submit" class="btn-primary" id="dueDateSubmit">${languageToggle.translate('auth.continue')}</button>
				</form>
			</div>
		</div>
	`;

	setupEventListeners();
}

function setupEventListeners() {
	// Main action buttons
	const loginBtn = el('#loginBtn');
	const signupBtn = el('#signupBtn');
	const sneakPeekBtn = el('#sneakPeekBtn');
	
	if (loginBtn) {
		loginBtn.addEventListener('click', (e) => {
			e.preventDefault();
			showLogin();
		});
	}
	
	if (signupBtn) {
		signupBtn.addEventListener('click', (e) => {
			e.preventDefault();
			showSignup();
		});
	}
	
	if (sneakPeekBtn) {
		sneakPeekBtn.addEventListener('click', (e) => {
			e.preventDefault();
			showSneakPeek();
		});
	}

	// Login form
	const loginForm = el('#loginForm');
	if (loginForm) {
		loginForm.addEventListener('submit', handleLogin);
	}

	// Signup form
	const signupForm = el('#signupForm');
	if (signupForm) {
		signupForm.addEventListener('submit', handleSignup);
	}

	// Due date form
	const dueDateForm = el('#dueDateForm');
	if (dueDateForm) {
		dueDateForm.addEventListener('submit', handleDueDate);
	}

	// Set up due date validation for both signup and due date modal
	const dueDateInput = el('#dueDate');
	const signupDueDateInput = el('#signupDueDate');
	if (dueDateInput) {
		setupDueDateValidation(dueDateInput);
	}
	if (signupDueDateInput) {
		setupDueDateValidation(signupDueDateInput);
	}
}

function setupDueDateValidation(input) {
	const today = new Date();
	const maxDate = new Date();
	maxDate.setFullYear(today.getFullYear() + 1);
	
	input.max = maxDate.toISOString().split('T')[0];
	// Allow past dates (for users who are already pregnant)
	input.min = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()).toISOString().split('T')[0];
}

function handleLogin(e) {
	e.preventDefault();
	const email = el('#loginEmail').value;
	const password = el('#loginPassword').value;

	if (authManager.login(email, password)) {
		closeModal('loginModal');
		
		// Check if user has completed their profile
		if (authManager.hasCompletedProfile()) {
			// User has completed profile, go to home
			window.location.href = 'home.html';
		} else {
			// User needs to complete profile - show modal immediately
			setTimeout(() => {
				showDueDateModal(languageToggle.translate('auth.completeProfile'), 'home.html');
			}, 100);
		}
	} else {
		showError(languageToggle.translate('auth.invalidCredentials'));
	}
}

function handleSignup(e) {
	e.preventDefault();
	const email = el('#signupEmail').value;
	const password = el('#signupPassword').value;
	const confirmPassword = el('#confirmPassword').value;
	const name = el('#signupName').value;
	const dueDate = el('#signupDueDate').value;

	if (password !== confirmPassword) {
		showError(languageToggle.translate('auth.passwordsDontMatch'));
		return;
	}

	if (!name.trim()) {
		showError('Name is required');
		return;
	}

	if (!dueDate) {
		showError('Due date is required');
		return;
	}

	try {
		// Create account with complete profile
		if (authManager.signupWithProfile(email, password, name, new Date(dueDate + 'T00:00:00'))) {
			closeModal('signupModal');
			// Redirect directly to home since profile is complete
			window.location.href = 'home.html';
		}
	} catch (error) {
		showError(error.message);
	}
}

function handleDueDate(e) {
	e.preventDefault();
	
	try {
		const name = el('#userName').value;
		const dueDate = new Date(el('#dueDate').value + 'T00:00:00');

		if (!name.trim()) {
			showError(languageToggle.translate('auth.name') + ' is required');
			return;
		}

		if (!el('#dueDate').value) {
			showError(languageToggle.translate('auth.selectDueDate'));
			return;
		}

		// Validate date
		if (isNaN(dueDate.getTime())) {
			showError('Please enter a valid date');
			return;
		}

		// Get the redirect URL from the modal
		const redirectUrl = el('#dueDateModal').dataset.redirectUrl || 'home.html';
		
		// Check if this is a sneak peek
		const isSneakPeek = redirectUrl.includes('sneakpeek');
		
		if (isSneakPeek) {
			// Store temporary data for sneak peek
			authManager.setSneakPeekData(name, dueDate);
			window.location.href = redirectUrl;
		} else {
			// Complete user registration
			authManager.completeRegistration(name, dueDate);
			window.location.href = redirectUrl;
		}
	} catch (error) {
		console.error('Error in handleDueDate:', error);
		showError('An error occurred. Please try again.');
	}
}

// Modal functions - make them global
window.showLogin = function() {
	el('#loginModal').classList.remove('hidden');
}

window.showSignup = function() {
	el('#signupModal').classList.remove('hidden');
}

window.showSneakPeek = function() {
	showDueDateModal(languageToggle.translate('sneakpeek.title'), 'sneakpeek.html');
}

function showDueDateModal(title, redirectUrl) {
	el('#dueDateTitle').textContent = title;
	el('#dueDateSubmit').textContent = title.includes('Sneak Peek') ? languageToggle.translate('landing.takeLook') : languageToggle.translate('auth.continue');
	
	// Store the redirect URL for later use
	el('#dueDateModal').dataset.redirectUrl = redirectUrl;
	
	el('#dueDateModal').classList.remove('hidden');
}

window.closeModal = function(modalId) {
	try {
		const modal = el(`#${modalId}`);
		if (modal) {
			modal.classList.add('hidden');
		}
	} catch (error) {
		console.error('Error closing modal:', error);
	}
}

function showError(message) {
	try {
		// Remove existing error
		const existingError = el('.error-message');
		if (existingError) {
			existingError.remove();
		}

		// Create error message
		const errorDiv = document.createElement('div');
		errorDiv.className = 'error-message';
		errorDiv.textContent = message || 'An error occurred';
		
		// Insert after current modal or body
		const modal = el('.modal:not(.hidden)');
		if (modal) {
			modal.appendChild(errorDiv);
		} else {
			// Fallback to body if no modal is open
			document.body.appendChild(errorDiv);
		}
	} catch (error) {
		console.error('Error in showError:', error);
		// Fallback to alert if DOM manipulation fails
		alert(message || 'An error occurred');
	}
}
