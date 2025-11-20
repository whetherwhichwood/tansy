import { BabyWeekData } from './babyData.js';
import { AuthManager } from './authManager.js';
import { LanguageToggle } from './languageToggle.js';

const el = sel => document.querySelector(sel);
const fmtPct = n => `${Math.round(n * 100)}%`;

const authManager = new AuthManager();
const languageToggle = new LanguageToggle();

// Check if user is logged in
if (!authManager.isLoggedIn()) {
	window.location.href = 'index.html';
}

// Check if user has completed their profile
if (!authManager.hasCompletedProfile()) {
	window.location.href = 'index.html';
}

function startOfDay(d) {
	const nd = new Date(d);
	nd.setHours(0,0,0,0);
	return nd;
}
function daysBetween(a, b) {
	const ms = startOfDay(b) - startOfDay(a);
	return Math.round(ms / (1000 * 60 * 60 * 24));
}
function currentWeek(dueDate, today = new Date()) {
	const daysUntilDue = Math.max(0, daysBetween(today, dueDate));
	const weeksUntilDue = Math.floor(daysUntilDue / 7);
	const wk = 40 - weeksUntilDue;
	return Math.min(40, Math.max(1, wk));
}
function progress(dueDate, today = new Date()) {
	return currentWeek(dueDate, today) / 40;
}

// Check if user is logged in
if (!authManager.isLoggedIn()) {
	window.location.href = 'index.html';
}

function renderInput() {
	const container = el('#app');
	container.innerHTML = `
		<section class="card">
			<h2 class="title">${languageToggle.translate('auth.enterDueDate')}</h2>
			<p class="subtle">${languageToggle.translate('auth.calculateDescription')}</p>
			<div class="input-row">
				<input type="date" id="due" />
				<div style="display:flex; gap:8px;">
					<button class="btn-primary" id="saveBtn">${languageToggle.translate('common.save')}</button>
				</div>
			</div>
		</section>
	`;
	const due = el('#due');
	// Get current due date from user profile
	const profile = authManager.getUserProfile();
	if (profile && profile.dueDate) {
		const existing = new Date(profile.dueDate);
		const iso = existing.toISOString().slice(0,10);
		due.value = iso;
	}
	el('#saveBtn').addEventListener('click', () => {
		if (!due.value) return alert(languageToggle.translate('modal.selectDate'));
		const d = new Date(`${due.value}T00:00:00`);
		authManager.updateDueDate(d);
		renderApp();
	});
}

function renderWeekly() {
	const profile = authManager.getUserProfile();
	if (!profile) {
		window.location.href = 'index.html';
		return;
	}

	const wk = authManager.getCurrentWeek();
	const pct = authManager.getProgress();
	const info = BabyWeekData.info(wk, languageToggle.languageManager);
	const s = info.sections || {};

	const container = el('#app');
	container.innerHTML = `
		<section class="card">
			<div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
				<div>
					<h2 class="title">Week ${wk} ${info.toneEmoji || ''}</h2>
					<p class="subtle">${languageToggle.translate('weekly.babySize', { size: info.size })}</p>
				</div>
				<button class="btn-ghost" id="changeBtn">${languageToggle.translate('weekly.changeDueDate')}</button>
			</div>

			<div class="progress">
				<div class="progress-bar"><span style="width:${fmtPct(pct)}"></span></div>
				<small class="subtle">${languageToggle.translate('weekly.progress', { percent: Math.round(pct * 100) })}</small>
			</div>

			${renderSection(languageToggle.translate('weekly.babyDevelopment'), s.development || [info.fact])}
			${renderSection(languageToggle.translate('weekly.yourBody'), s.yourBody)}
			${renderSection(languageToggle.translate('weekly.smartNutrition'), s.nutrition)}
			${renderSection(languageToggle.translate('weekly.movement'), s.movement)}
			${renderSection(languageToggle.translate('weekly.mindMood'), s.mind)}
			${renderSection(languageToggle.translate('weekly.checklist'), s.checklist)}
			${renderSection(languageToggle.translate('weekly.questions'), s.questions)}
			${renderSection(languageToggle.translate('weekly.redFlags'), s.redFlags)}
			${renderSection(languageToggle.translate('weekly.funBonding'), s.fun)}
		</section>
	`;

	el('#changeBtn').addEventListener('click', () => {
		showDueDateModal();
	});
}

function renderApp() {
	renderWeekly();
}


function renderSection(title, items) {
	if (!items || items.length === 0) return '';
	const bulletChar = languageToggle.translate('common.bullet');
	const list = items.map(t => `
		<div class="tip">
			<div class="tip-bullet">${bulletChar}</div>
			<div>${escapeHTML(stripLeadBullet(t))}</div>
		</div>
	`).join('');
	return `
		<div class="section">
			<h3>${title}</h3>
			<div class="tips">${list}</div>
		</div>
	`;
}

function stripLeadBullet(text) {
	return (text || '').replace(/^\s*•\s*/, '');
}

function escapeHTML(str) {
	const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
	return String(str).replace(/[&<>"']/g, m => map[m]);
}

function showDueDateModal() {
	const modal = el('#dueDateModal');
	const newDueDateInput = el('#newDueDate');
	
	// Update modal text with translations
	el('#modalTitle').textContent = languageToggle.translate('modal.changeDueDate');
	el('#modalDescription').textContent = languageToggle.translate('modal.updateDescription');
	el('#modalLabel').textContent = languageToggle.translate('modal.dueDateLabel');
	el('#cancelBtn').textContent = languageToggle.translate('common.cancel');
	el('#saveDueDateBtn').textContent = languageToggle.translate('modal.saveChanges');
	
	// Get current due date and pre-populate the input
	const profile = authManager.getUserProfile();
	if (profile && profile.dueDate) {
		const currentDueDate = new Date(profile.dueDate);
		const isoDate = currentDueDate.toISOString().slice(0, 10);
		newDueDateInput.value = isoDate;
	}
	
	// Show modal
	modal.classList.remove('hidden');
	
	// Focus on the input
	newDueDateInput.focus();
}

function hideDueDateModal() {
	const modal = el('#dueDateModal');
	modal.classList.add('hidden');
}

function saveDueDate() {
	const newDueDateInput = el('#newDueDate');
	const newDateValue = newDueDateInput.value;
	
	if (!newDateValue) {
		alert(languageToggle.translate('modal.selectDate'));
		return;
	}
	
	const newDueDate = new Date(`${newDateValue}T00:00:00`);
	
	// Update the due date
	if (authManager.updateDueDate(newDueDate)) {
		hideDueDateModal();
		// Refresh the page to show updated data
		window.location.reload();
	} else {
		alert(languageToggle.translate('modal.updateFailed'));
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Update page title and header with translation
	const pageTitle = el('#pageTitle');
	const pageHeader = el('#pageHeader');
	if (pageTitle) {
		pageTitle.textContent = languageToggle.translate('pageTitle.app');
	}
	if (pageHeader) {
		pageHeader.textContent = languageToggle.translate('pageHeader.app');
	}
	
	// Update footer disclaimer with translation
	const footerDisclaimer = el('#footerDisclaimer');
	if (footerDisclaimer) {
		footerDisclaimer.textContent = languageToggle.translate('common.disclaimer');
	}
	
	renderApp();
	
	// Add navigation event listeners
	const homeBtn = el('#homeBtn');
	const logoutBtn = el('#logoutBtn');
	
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
	
	// Add modal event listeners
	const closeModalBtn = el('#closeModal');
	const cancelBtn = el('#cancelBtn');
	const saveDueDateBtn = el('#saveDueDateBtn');
	const modal = el('#dueDateModal');
	
	if (closeModalBtn) {
		closeModalBtn.addEventListener('click', hideDueDateModal);
	}
	
	if (cancelBtn) {
		cancelBtn.addEventListener('click', hideDueDateModal);
	}
	
	if (saveDueDateBtn) {
		saveDueDateBtn.addEventListener('click', saveDueDate);
	}
	
	// Close modal when clicking outside of it
	if (modal) {
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				hideDueDateModal();
			}
		});
	}
	
	// Close modal with Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
			hideDueDateModal();
		}
	});
});