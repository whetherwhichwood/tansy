import { BabyWeekData } from './babyData.js';
import { AuthManager } from './authManager.js';
import { FruitImages } from './fruitImages.js';
import { LanguageToggle } from './languageToggle.js';

const el = sel => document.querySelector(sel);
const authManager = new AuthManager();
const languageToggle = new LanguageToggle();

// Check if user is logged in
if (!authManager.isLoggedIn()) {
	window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
	// Update page title and header with translation
	const pageTitle = el('#pageTitle');
	const pageHeader = el('#pageHeader');
	if (pageTitle) {
		pageTitle.textContent = languageToggle.translate('pageTitle.home');
	}
	if (pageHeader) {
		pageHeader.textContent = languageToggle.translate('pageHeader.home');
	}
	
	// Update footer disclaimer with translation
	const footerDisclaimer = el('#footerDisclaimer');
	if (footerDisclaimer) {
		footerDisclaimer.textContent = languageToggle.translate('common.disclaimer');
	}
	
	const profile = authManager.getUserProfile();
	
	// Check if user has completed their profile
	if (!authManager.hasCompletedProfile()) {
		// Show profile completion modal instead of redirecting
		showProfileCompletionModal();
		return;
	}
	
	const currentWeek = authManager.getCurrentWeek();
	const progress = authManager.getProgress();
	const weekInfo = BabyWeekData.info(currentWeek, languageToggle.languageManager);

	// Update user name in header
	const userNameEl = el('#userName');
	if (userNameEl && profile.name) {
		userNameEl.textContent = `Hi, ${profile.name}!`;
	}

	// Render home page
	renderHomePage(profile, currentWeek, progress, weekInfo);
	
	// Animate progress bar after a short delay
	setTimeout(() => {
		const progressSpan = el('.progress-bar span');
		if (progressSpan) {
			// Force a reflow to ensure the transition works
			progressSpan.offsetHeight;
			progressSpan.style.width = `${Math.round(progress * 100)}%`;
		}
	}, 200);

	// Add logout functionality
	const logoutBtn = el('#logoutBtn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			authManager.logout();
			window.location.href = 'index.html';
		});
	}

	// Add navigation button functionality
	setupNavigationButtons();
});

function showProfileCompletionModal() {
	const container = el('#app');
	container.innerHTML = `
		<div class="card">
			<h2>Complete Your Profile</h2>
			<p>Please complete your profile to access all features.</p>
			<form id="profileCompletionForm" class="auth-form">
				<div class="input-group">
					<label for="userName">Your Name</label>
					<input type="text" id="userName" required />
				</div>
				<div class="input-group">
					<label for="dueDate">Due Date</label>
					<input type="date" id="dueDate" required />
				</div>
				<button type="submit" class="btn-primary">Complete Profile</button>
			</form>
		</div>
	`;

	// Set up form submission
	const form = el('#profileCompletionForm');
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = el('#userName').value;
			const dueDate = new Date(el('#dueDate').value + 'T00:00:00');

			if (!name.trim()) {
				alert('Please enter your name');
				return;
			}

			if (!el('#dueDate').value) {
				alert('Please select your due date');
				return;
			}

			// Complete registration
			const success = authManager.completeRegistration(name, dueDate);
			
			if (success) {
				// Reload the page to show the home content
				window.location.reload();
			} else {
				alert('Failed to complete registration. Please try again.');
			}
		});
	}

	// Set up due date validation
	const dueDateInput = el('#dueDate');
	if (dueDateInput) {
		const today = new Date();
		const maxDate = new Date();
		maxDate.setFullYear(today.getFullYear() + 1);
		
		dueDateInput.max = maxDate.toISOString().split('T')[0];
		dueDateInput.min = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate()).toISOString().split('T')[0];
	}
}

function renderHomePage(profile, currentWeek, progress, weekInfo) {
	const container = el('#app');
	const daysLeft = Math.max(0, 280 - (currentWeek - 1) * 7);
	const trimester = getTrimester(currentWeek);
	
	container.innerHTML = `
		<div class="home-container">
			<!-- Enhanced Welcome Section -->
			<section class="card welcome-card enhanced-welcome">
				<div class="welcome-content">
					<div class="welcome-header">
						<div class="week-badge">
							<span class="week-number">${currentWeek}</span>
							<span class="week-label">Weeks</span>
						</div>
						<div class="welcome-text">
							<h2 class="welcome-title">${languageToggle.translate('home.welcome', { week: currentWeek, emoji: weekInfo.toneEmoji || "" })}</h2>
							<p class="welcome-subtitle">${languageToggle.translate('home.babySize', { size: weekInfo.size })}</p>
						</div>
					</div>
					
					<div class="progress-section enhanced-progress">
						<div class="progress-bar enhanced-progress-bar">
							<span style="width: 0%" class="progress-fill"></span>
							<div class="progress-milestones">
								<div class="milestone ${currentWeek >= 12 ? 'reached' : ''}" data-week="12">1st</div>
								<div class="milestone ${currentWeek >= 24 ? 'reached' : ''}" data-week="24">2nd</div>
								<div class="milestone ${currentWeek >= 36 ? 'reached' : ''}" data-week="36">3rd</div>
							</div>
						</div>
						<div class="progress-stats">
							<p class="progress-text">${languageToggle.translate('home.progress', { percent: Math.round(progress * 100) })}</p>
							<p class="days-left">${daysLeft} days to go</p>
						</div>
					</div>
					
					<div class="week-stats">
						<div class="stat">
							<span class="stat-icon">📅</span>
							<span class="stat-label">Days Left</span>
							<span class="stat-value">${daysLeft}</span>
						</div>
						<div class="stat">
							<span class="stat-icon">🎯</span>
							<span class="stat-label">Trimester</span>
							<span class="stat-value">${trimester}</span>
						</div>
						<div class="stat">
							<span class="stat-icon">📏</span>
							<span class="stat-label">Size</span>
							<span class="stat-value">${weekInfo.size || 'Growing'}</span>
						</div>
					</div>
				</div>
			</section>

			<!-- Fruit Image Section -->
			<section class="card fruit-card">
				<div class="fruit-content">
					<div class="fruit-image">
						<img src="${FruitImages.getImageUrl(currentWeek)}" 
							 alt="Week ${currentWeek} - ${weekInfo.size}" 
							 class="fruit-img" />
					</div>
					<div class="fruit-info">
						<h3>${languageToggle.translate('home.thisWeekSize')}</h3>
						<p class="fruit-description">${languageToggle.translate('home.sizeDescription', { size: weekInfo.size })}</p>
					</div>
				</div>
			</section>

			<!-- Quick Tips Preview -->
			<section class="card tips-preview">
				<h3>${languageToggle.translate('home.highlights')}</h3>
				<div class="tips-grid">
					${renderQuickTips(weekInfo)}
				</div>
				<button class="btn-primary view-details-btn" id="viewDetailsBtn">
					${languageToggle.translate('home.viewFullUpdate')}
				</button>
			</section>

			<!-- Navigation Cards -->
			<section class="card navigation-cards">
				<h3>${languageToggle.translate('home.exploreMore')}</h3>
				<div class="nav-grid">
					<div class="nav-card" data-page="weekly">
						<div class="nav-icon">📅</div>
						<h4>${languageToggle.translate('home.weeklyDetails')}</h4>
						<p>${languageToggle.translate('home.weeklyDetailsDesc')}</p>
					</div>
					<div class="nav-card" data-page="progress">
						<div class="nav-icon">📊</div>
						<h4>${languageToggle.translate('home.progressTracker')}</h4>
						<p>${languageToggle.translate('home.progressTrackerDesc')}</p>
					</div>
					<div class="nav-card" data-page="tips">
						<div class="nav-icon">💡</div>
						<h4>${languageToggle.translate('home.healthTips')}</h4>
						<p>${languageToggle.translate('home.healthTipsDesc')}</p>
					</div>
					<div class="nav-card" data-page="journal">
						<div class="nav-icon">📝</div>
						<h4>${languageToggle.translate('home.pregnancyJournal')}</h4>
						<p>${languageToggle.translate('home.pregnancyJournalDesc')}</p>
					</div>
				</div>
			</section>
		</div>
	`;
}

function renderQuickTips(weekInfo) {
	const sections = weekInfo.sections || {};
	const quickTips = [
		sections.development?.[0] || weekInfo.fact,
		sections.nutrition?.[0] || 'Stay hydrated and eat balanced meals',
		sections.movement?.[0] || 'Gentle movement helps with comfort',
		sections.mind?.[0] || 'Take time for mindfulness and relaxation'
	].filter(Boolean).slice(0, 3);

	return quickTips.map(tip => `
		<div class="quick-tip">
			<div class="tip-bullet">•</div>
			<div class="tip-text">${stripLeadBullet(tip)}</div>
		</div>
	`).join('');
}

function stripLeadBullet(text) {
	return (text || '').replace(/^\s*•\s*/, '');
}

// Setup navigation buttons
function setupNavigationButtons() {
	// Wait for DOM to be ready
	setTimeout(() => {
		const viewDetailsBtn = el('#viewDetailsBtn');
		const navCards = el('.nav-grid');
		
		if (viewDetailsBtn) {
			viewDetailsBtn.addEventListener('click', (e) => {
				e.preventDefault();
				window.location.href = 'app.html';
			});
		}
		
		if (navCards) {
			// Add click listeners to all nav cards
			const cards = navCards.querySelectorAll('.nav-card');
			cards.forEach(card => {
				card.addEventListener('click', (e) => {
					e.preventDefault();
					const page = card.dataset.page;
					switch(page) {
						case 'weekly':
							window.location.href = 'app.html';
							break;
						case 'progress':
							window.location.href = 'progress.html';
							break;
						case 'tips':
							window.location.href = 'tips.html';
							break;
						case 'journal':
							window.location.href = 'journal.html';
							break;
						default:
							// Unknown page navigation
					}
				});
			});
		}

		// Also fix any buttons with onclick attributes
		const buttons = document.querySelectorAll('button[onclick]');
		buttons.forEach(button => {
			const onclick = button.getAttribute('onclick');
			if (onclick) {
				button.removeAttribute('onclick');
				button.addEventListener('click', (e) => {
					e.preventDefault();
					// Handle common onclick patterns safely
					if (onclick.includes('window.location.href')) {
						const url = onclick.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
						if (url) {
							window.location.href = url[1];
						}
					} else if (onclick.includes('closeModal')) {
						const modalId = onclick.match(/closeModal\(['"]([^'"]+)['"]\)/);
						if (modalId) {
							closeModal(modalId[1]);
						}
					} else {
						console.warn('Unhandled onclick pattern:', onclick);
					}
				});
			}
		});
	}, 200);
}

// Navigation functions (kept for compatibility)
function viewWeeklyDetails() {
	window.location.href = 'index.html';
}

function viewProgress() {
	window.location.href = 'progress.html';
}

function viewTips() {
	window.location.href = 'tips.html';
}

function viewJournal() {
	window.location.href = 'journal.html';
}
