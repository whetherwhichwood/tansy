import { AuthManager } from './authManager.js';
import { BabyWeekData } from './babyData.js';
import { LanguageToggle } from './languageToggle.js';

const authManager = new AuthManager();
const languageToggle = new LanguageToggle();

// Progress page loading

// Function to get the container
function getContainer() {
	let container = document.querySelector('#progress-content');
	if (!container) {
		// Primary container not found, trying fallbacks
		container = document.querySelector('main') || document.querySelector('#app') || document.querySelector('.app');
	}
	return container;
}

// Function to show error
function showError(message) {
	const container = getContainer();
	if (container) {
		container.innerHTML = `
			<div class="card">
				<h2>Error</h2>
				<p>${message}</p>
				<button onclick="window.location.reload()" class="btn-primary">Refresh Page</button>
			</div>
		`;
	}
}

// Function to render simple progress
function renderSimpleProgress(profile, currentWeek) {
	const container = getContainer();
	if (!container) return;
	
	const progress = Math.round((currentWeek / 40) * 100);
	const weekInfo = BabyWeekData.info(currentWeek);
	
	container.innerHTML = `
		<div class="progress-container">
			<section class="card progress-main">
				<h2>Your Pregnancy Journey</h2>
				<div class="progress-overview">
					<div class="progress-circle">
						<div class="circle-bg">
							<div class="circle-fill" style="--progress: ${currentWeek / 40}"></div>
						</div>
						<div class="circle-text">
							<span class="progress-percent">${progress}%</span>
							<span class="progress-label">Complete</span>
						</div>
					</div>
					<div class="progress-info">
						<h3>Week ${currentWeek}</h3>
						<p class="progress-subtitle">${weekInfo.size} size</p>
						<p class="progress-description">${weekInfo.fact}</p>
					</div>
				</div>
			</section>
			
			<section class="card milestones-card">
				<h3>Pregnancy Milestones</h3>
				<div class="milestones-grid">
					<div class="milestone ${currentWeek >= 4 ? 'completed' : ''}">
						<div class="milestone-icon">🧪</div>
						<div class="milestone-content">
							<div class="milestone-title">Positive Test</div>
							<div class="milestone-week">Week 4</div>
						</div>
						<div class="milestone-status">${currentWeek >= 4 ? '✅' : '⏳'}</div>
					</div>
					<div class="milestone ${currentWeek >= 8 ? 'completed' : ''}">
						<div class="milestone-icon">📷</div>
						<div class="milestone-content">
							<div class="milestone-title">First Ultrasound</div>
							<div class="milestone-week">Week 8</div>
						</div>
						<div class="milestone-status">${currentWeek >= 8 ? '✅' : '⏳'}</div>
					</div>
					<div class="milestone ${currentWeek >= 12 ? 'completed' : ''}">
						<div class="milestone-icon">🎉</div>
						<div class="milestone-content">
							<div class="milestone-title">End of First Trimester</div>
							<div class="milestone-week">Week 12</div>
						</div>
						<div class="milestone-status">${currentWeek >= 12 ? '✅' : '⏳'}</div>
					</div>
					<div class="milestone ${currentWeek >= 20 ? 'completed' : ''}">
						<div class="milestone-icon">🔍</div>
						<div class="milestone-content">
							<div class="milestone-title">Anatomy Scan</div>
							<div class="milestone-week">Week 20</div>
						</div>
						<div class="milestone-status">${currentWeek >= 20 ? '✅' : '⏳'}</div>
					</div>
					<div class="milestone ${currentWeek >= 28 ? 'completed' : ''}">
						<div class="milestone-icon">🚀</div>
						<div class="milestone-content">
							<div class="milestone-title">Third Trimester</div>
							<div class="milestone-week">Week 28</div>
						</div>
						<div class="milestone-status">${currentWeek >= 28 ? '✅' : '⏳'}</div>
					</div>
					<div class="milestone ${currentWeek >= 40 ? 'completed' : ''}">
						<div class="milestone-icon">👶</div>
						<div class="milestone-content">
							<div class="milestone-title">Due Date</div>
							<div class="milestone-week">Week 40</div>
						</div>
						<div class="milestone-status">${currentWeek >= 40 ? '✅' : '⏳'}</div>
					</div>
				</div>
			</section>
			
			<section class="card stats-card">
				<h3>Your Stats</h3>
				<div class="stats-grid">
					<div class="stat-item">
						<div class="stat-number">${currentWeek}</div>
						<div class="stat-label">Current Week</div>
					</div>
					<div class="stat-item">
						<div class="stat-number">${40 - currentWeek}</div>
						<div class="stat-label">Weeks Remaining</div>
					</div>
					<div class="stat-item">
						<div class="stat-number">${progress}%</div>
						<div class="stat-label">Progress</div>
					</div>
					<div class="stat-item">
						<div class="stat-number">${Math.max(0, Math.floor((new Date() - new Date(profile.dueDate)) / (1000 * 60 * 60 * 24)) + 280)}</div>
						<div class="stat-label">Days Pregnant</div>
					</div>
				</div>
			</section>
		</div>
	`;
}

// Function to setup navigation
function setupNavigation() {
	const homeBtn = document.querySelector('#homeBtn');
	const logoutBtn = document.querySelector('#logoutBtn');
	
	if (homeBtn) {
		homeBtn.addEventListener('click', () => {
			window.location.href = 'home.html';
		});
	}
	
	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			authManager.logout();
			window.location.href = 'index.html';
		});
	}
}

// Main execution when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	// DOM loaded
	
	// Update footer disclaimer with translation
	const footerDisclaimer = document.querySelector('#footerDisclaimer');
	if (footerDisclaimer) {
		footerDisclaimer.textContent = languageToggle.translate('common.disclaimer');
	}
	
	// Check if user is logged in first
	if (!authManager.isLoggedIn()) {
		// User not logged in, redirecting to index.html
		window.location.href = 'index.html';
		return;
	}
	
	// Show loading
	const container = getContainer();
	if (container) {
		container.innerHTML = '<div class="card"><h2>Loading...</h2></div>';
	}
	
	// Check profile
	if (!authManager.hasCompletedProfile()) {
		// Profile incomplete, showing form
		if (container) {
			container.innerHTML = `
				<div class="card">
					<h2>Complete Your Profile</h2>
					<p>Please complete your profile to access all features.</p>
					<form id="profileForm">
						<div class="input-group">
							<label>Your Name</label>
							<input type="text" id="userName" required />
						</div>
						<div class="input-group">
							<label>Due Date</label>
							<input type="date" id="dueDate" required />
						</div>
						<button type="submit" class="btn-primary">Complete Profile</button>
					</form>
				</div>
			`;
			
			// Handle form submission
			const form = document.querySelector('#profileForm');
			if (form) {
				form.addEventListener('submit', (e) => {
					e.preventDefault();
					const name = document.querySelector('#userName').value;
					const dueDate = new Date(document.querySelector('#dueDate').value + 'T00:00:00');
					
					if (authManager.completeRegistration(name, dueDate)) {
						window.location.reload();
					} else {
						alert('Failed to complete registration');
					}
				});
			}
		}
		return;
	}
	
	// Get data
	const profile = authManager.getUserProfile();
	const currentWeek = authManager.getCurrentWeek();
	
	// Profile and current week loaded
	
	if (!profile || !currentWeek) {
		showError('Unable to load profile data');
		return;
	}
	
	// Render progress
	try {
		renderSimpleProgress(profile, currentWeek);
		// Progress rendered successfully
	} catch (error) {
		console.error('Render error:', error);
		showError('Error rendering progress: ' + error.message);
	}
	
	// Setup navigation
	setupNavigation();
	
	// Setup complete
});