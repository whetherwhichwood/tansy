import { AuthManager } from './authManager.js';
import { LanguageToggle } from './languageToggle.js';

const el = sel => document.querySelector(sel);
const authManager = new AuthManager();
const languageToggle = new LanguageToggle();

// Initialize login page
document.addEventListener('DOMContentLoaded', () => {
	// Update footer disclaimer with translation
	const footerDisclaimer = el('#footerDisclaimer');
	if (footerDisclaimer) {
		footerDisclaimer.textContent = languageToggle.translate('common.disclaimer');
	}
	
	const form = el('#loginForm');
	const emailInput = el('#email');
	const passwordInput = el('#password');

	// Handle form submission
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			
			const email = emailInput.value.trim();
			const password = passwordInput.value.trim();
			
			if (!email || !password) {
				showError('Please enter both email and password');
				return;
			}

			if (authManager.login(email, password)) {
				window.location.href = 'home.html';
			} else {
				showError('Invalid email or password');
			}
		});
	}

	// Add some visual feedback
	if (emailInput) {
		emailInput.addEventListener('input', () => {
			emailInput.classList.remove('error');
		});
	}

	if (passwordInput) {
		passwordInput.addEventListener('input', () => {
			passwordInput.classList.remove('error');
		});
	}
});

function showError(message) {
	// Remove existing error
	const existingError = el('.error-message');
	if (existingError) {
		existingError.remove();
	}

	// Create error message
	const errorDiv = document.createElement('div');
	errorDiv.className = 'error-message';
	errorDiv.textContent = message;
	
	// Insert after form
	const form = el('#loginForm');
	form.parentNode.insertBefore(errorDiv, form.nextSibling);
	
	// Highlight input
	if (el('#email')) el('#email').classList.add('error');
	if (el('#password')) el('#password').classList.add('error');
}
