import { BabyWeekData } from './babyData.js';
import { AuthManager } from './authManager.js';
import { FruitImages } from './fruitImages.js';
import { LanguageToggle } from './languageToggle.js';

const el = sel => document.querySelector(sel);
const authManager = new AuthManager();
const languageToggle = new LanguageToggle();

// Check if user has sneak peek data
if (!authManager.isSneakPeek()) {
	window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
	// Update footer disclaimer with translation
	const footerDisclaimer = el('#footerDisclaimer');
	if (footerDisclaimer) {
		footerDisclaimer.textContent = languageToggle.translate('common.disclaimer');
	}
	
	const profile = authManager.getSneakPeekProfile();
	const currentWeek = authManager.getCurrentWeek();
	const progress = authManager.getProgress();
	const weekInfo = BabyWeekData.info(currentWeek, languageToggle.languageManager);

	// Render sneak peek page
	renderSneakPeekPage(profile, currentWeek, progress, weekInfo);

	// Add navigation event listeners
	const createAccountBtn = el('#createAccountBtn');
	const backBtn = el('#backBtn');
	const createAccountBtn2 = el('#createAccountBtn2');
	
	if (createAccountBtn) {
		createAccountBtn.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = 'index.html';
		});
	}
	
	if (createAccountBtn2) {
		createAccountBtn2.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = 'index.html';
		});
	}
	
	if (backBtn) {
		backBtn.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = 'index.html';
		});
	}

	// Fix any buttons with onclick attributes
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
});

function renderSneakPeekPage(profile, currentWeek, progress, weekInfo) {
	const container = el('#app');
	
	container.innerHTML = `
		<div class="sneakpeek-container">
			<!-- Welcome Section -->
			<section class="card welcome-card">
				<div class="welcome-content">
					<h2 class="welcome-title">Week ${currentWeek} ${weekInfo.toneEmoji || ''}</h2>
					<p class="welcome-subtitle">Hi ${profile.name}! Your baby is the size of a ${weekInfo.size}</p>
					<div class="progress-section">
						<div class="progress-bar">
							<div class="progress-fill" style="width: ${Math.round(progress * 100)}%"></div>
						</div>
						<p class="progress-text">${Math.round(progress * 100)}% of your pregnancy journey</p>
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
						<h3>This Week's Size</h3>
						<p class="fruit-description">Your little one is about the size of a ${weekInfo.size} this week!</p>
					</div>
				</div>
			</section>

			<!-- Quick Tips Preview -->
			<section class="card tips-preview">
				<h3>This Week's Highlights</h3>
				<div class="tips-grid">
					${renderQuickTips(weekInfo)}
				</div>
			</section>

			<!-- Limited Features Notice -->
			<section class="card notice-card">
				<div class="notice-content">
					<h3>🚀 Want More Features?</h3>
					<p>This is just a preview! Create an account to access:</p>
					<ul class="feature-list">
						<li>📝 Personal pregnancy journal with photos</li>
						<li>📊 Detailed progress tracking and milestones</li>
						<li>💡 Comprehensive health tips and advice</li>
						<li>📅 Full weekly updates and development info</li>
						<li>💾 Save your data and return anytime</li>
					</ul>
					<button class="btn-primary create-account-btn" id="createAccountBtn2">
						Create Free Account
					</button>
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
