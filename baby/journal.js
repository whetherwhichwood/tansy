import { AuthManager } from './authManager.js';
import { LanguageToggle } from './languageToggle.js';
import { JournalManager } from './journalManager.js';

const el = sel => document.querySelector(sel);
const authManager = new AuthManager();
const languageToggle = new LanguageToggle();
const journalManager = new JournalManager();

// Check if user is logged in
if (!authManager.isLoggedIn()) {
	window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
	// Update footer disclaimer with translation
	const footerDisclaimer = el('#footerDisclaimer');
	if (footerDisclaimer) {
		footerDisclaimer.textContent = languageToggle.translate('common.disclaimer');
	}
	
	// Check if user has completed their profile
	if (!authManager.hasCompletedProfile()) {
		window.location.href = 'index.html';
		return;
	}
	
	const profile = authManager.getUserProfile();
	const currentWeek = authManager.getCurrentWeek();

	// Render journal page
	renderJournalPage(profile, currentWeek);

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
});

function renderJournalPage(profile, currentWeek) {
	const container = el('#app');
	const journalEntries = getJournalEntries();
	
	container.innerHTML = `
		<div class="journal-container">
			<!-- New Entry Section -->
			<section class="card new-entry-card">
				<h2>${languageToggle.translate('journal.title')}</h2>
				<form id="journalForm" class="journal-form">
					<div class="input-group">
						<label for="entryTitle">${languageToggle.translate('journal.entryTitle')}</label>
						<input type="text" id="entryTitle" placeholder="${languageToggle.translate('journal.entryTitlePlaceholder')}" />
					</div>
					
					<div class="input-group">
						<label for="entryContent">${languageToggle.translate('journal.entryContent')}</label>
						<textarea id="entryContent" placeholder="${languageToggle.translate('journal.entryContentPlaceholder')}" required maxlength="2000"></textarea>
						<div class="char-counter">
							<span id="charCount">0</span>/2000 ${languageToggle.translate('journal.characters')}
						</div>
					</div>
					
					<div class="input-group">
						<label for="entryMood">${languageToggle.translate('journal.mood')}</label>
						<select id="entryMood">
							<option value="😊">😊 ${languageToggle.translate('journal.happy')}</option>
							<option value="😌">😌 ${languageToggle.translate('journal.calm')}</option>
							<option value="😴">😴 ${languageToggle.translate('journal.tired')}</option>
							<option value="🤢">🤢 ${languageToggle.translate('journal.nauseous')}</option>
							<option value="😰">😰 ${languageToggle.translate('journal.anxious')}</option>
							<option value="😍">😍 ${languageToggle.translate('journal.excited')}</option>
							<option value="😔">😔 ${languageToggle.translate('journal.sad')}</option>
							<option value="😤">😤 ${languageToggle.translate('journal.frustrated')}</option>
						</select>
					</div>
					
					<div class="input-group">
						<label for="entryImage">${languageToggle.translate('journal.photo')}</label>
						<input type="file" id="entryImage" accept="image/*" />
						<div id="imagePreview" class="image-preview hidden"></div>
					</div>
					
					<button type="submit" class="btn-primary">
						<span class="btn-icon">💾</span>
						${languageToggle.translate('journal.saveEntry')}
					</button>
				</form>
			</section>

			<!-- Journal Entries -->
			<section class="card entries-card">
				<h2>${languageToggle.translate('journal.recentEntries')}</h2>
				<div id="entriesList" class="entries-list">
					${renderJournalEntries(journalEntries)}
				</div>
			</section>
		</div>
	`;

	// Add form submission handler
	const form = el('#journalForm');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		saveJournalEntry();
	});

	// Add image preview handler
	const imageInput = el('#entryImage');
	if (imageInput) {
		imageInput.addEventListener('change', handleImagePreview);
	}

	// Add character counter
	const contentTextarea = el('#entryContent');
	const charCount = el('#charCount');
	if (contentTextarea && charCount) {
		contentTextarea.addEventListener('input', () => {
			const count = contentTextarea.value.length;
			charCount.textContent = count;
			
			// Change color as it approaches limit
			if (count > 1800) {
				charCount.style.color = '#dc2626';
			} else if (count > 1500) {
				charCount.style.color = '#f59e0b';
			} else {
				charCount.style.color = 'var(--muted)';
			}
		});
	}
}

function renderJournalEntries(entries) {
	if (entries.length === 0) {
		return `
			<div class="empty-state">
				<div class="empty-icon">📝</div>
				<h3>No entries yet</h3>
				<p>Start writing your pregnancy journey above!</p>
			</div>
		`;
	}

	return entries.map(entry => `
		<div class="journal-entry" data-id="${entry.id}">
			<div class="entry-header">
				<div class="entry-meta">
					<span class="entry-date">${formatDate(entry.date)}</span>
					<span class="entry-week">Week ${entry.week}</span>
				</div>
				<div class="entry-mood">${entry.mood}</div>
			</div>
			${entry.title ? `<h4 class="entry-title">${entry.title}</h4>` : ''}
			<div class="entry-content">${entry.content}</div>
			${entry.image ? `<div class="entry-image"><img src="${entry.image}" alt="Journal entry photo" /></div>` : ''}
			<div class="entry-actions">
				<button class="btn-ghost delete-entry" data-id="${entry.id}">🗑️ Delete</button>
			</div>
		</div>
	`).join('');
}

function saveJournalEntry() {
	const title = el('#entryTitle').value.trim();
	const content = el('#entryContent').value.trim();
	const mood = el('#entryMood').value;
	const imageFile = el('#entryImage').files[0];
	
	// Validation
	if (!content) {
		showJournalError(languageToggle.translate('journal.pleaseWrite'));
		return;
	}

	if (content.length > 2000) {
		showJournalError(languageToggle.translate('journal.tooLong'));
		return;
	}

	if (imageFile && imageFile.size > 5 * 1024 * 1024) { // 5MB limit
		showJournalError(languageToggle.translate('journal.imageTooLarge'));
		return;
	}

	const profile = authManager.getUserProfile();
	if (!profile) {
		showJournalError(languageToggle.translate('journal.pleaseLogin'));
		return;
	}

	const currentWeek = authManager.getCurrentWeek();
	
	const entry = {
		id: Date.now().toString(),
		title: title || null,
		content: content,
		mood: mood,
		week: currentWeek,
		date: new Date().toISOString(),
		userId: profile.userId,
		image: null
	};

	// Handle image upload
	if (imageFile) {
		const reader = new FileReader();
		reader.onload = function(e) {
			entry.image = e.target.result;
			saveEntryToStorage(entry, profile, currentWeek);
		};
		reader.onerror = function() {
			showJournalError(languageToggle.translate('journal.failedToLoadImage'));
		};
		reader.readAsDataURL(imageFile);
	} else {
		saveEntryToStorage(entry, profile, currentWeek);
	}
}

function saveEntryToStorage(entry, profile, currentWeek) {
	try {
		// Use JournalManager to save entry with enhanced security
		const success = journalManager.saveEntry(entry, profile.userId);
		
		if (success) {
			// Clear form
			el('#entryTitle').value = '';
			el('#entryContent').value = '';
			el('#entryMood').value = '😊';
			el('#entryImage').value = '';
			el('#imagePreview').classList.add('hidden');

			// Show success message
			showJournalSuccess(languageToggle.translate('journal.entrySaved'));

			// Refresh entries display
			renderJournalPage(profile, currentWeek);
		} else {
			throw new Error('Failed to save journal entry');
		}
	} catch (error) {
		showJournalError(languageToggle.translate('journal.failedToSave'));
		console.error('Journal save error:', error);
	}
}

function getJournalEntries() {
	const profile = authManager.getUserProfile();
	if (!profile) return [];
	
	// Use JournalManager for secure access
	return journalManager.getEntries(profile.userId);
}

function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { 
		month: 'short', 
		day: 'numeric', 
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

// Add delete functionality
document.addEventListener('click', (e) => {
	if (e.target.classList.contains('delete-entry')) {
		const entryId = e.target.dataset.id;
		if (confirm('Are you sure you want to delete this entry?')) {
			const profile = authManager.getUserProfile();
			
			// Use JournalManager for secure deletion
			const success = journalManager.deleteEntry(entryId, profile.userId);
			
			if (success) {
				// Refresh display
				const currentWeek = authManager.getCurrentWeek();
				renderJournalPage(profile, currentWeek);
				showJournalSuccess(languageToggle.translate('journal.entryDeleted'));
			} else {
				showJournalError(languageToggle.translate('journal.failedToDelete'));
			}
		}
	}
});

function handleImagePreview(e) {
	const file = e.target.files[0];
	const preview = el('#imagePreview');
	
	if (file) {
		// Check file size
		if (file.size > 5 * 1024 * 1024) {
			showJournalError('Image is too large. Please choose an image under 5MB.');
			e.target.value = '';
			return;
		}
		
		const reader = new FileReader();
		reader.onload = function(e) {
			preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="preview-image" />`;
			preview.classList.remove('hidden');
		};
		reader.onerror = function() {
			showJournalError('Failed to load image preview.');
		};
		reader.readAsDataURL(file);
	} else {
		preview.classList.add('hidden');
	}
}

function showJournalError(message) {
	showJournalMessage(message, 'error');
}

function showJournalSuccess(message) {
	showJournalMessage(message, 'success');
}

function showJournalMessage(message, type) {
	// Remove existing messages
	const existingMessage = el('.journal-message');
	if (existingMessage) {
		existingMessage.remove();
	}

	// Create message element
	const messageDiv = document.createElement('div');
	messageDiv.className = `journal-message journal-message-${type}`;
	messageDiv.textContent = message;
	
	// Insert after form
	const form = el('#journalForm');
	if (form) {
		form.parentNode.insertBefore(messageDiv, form.nextSibling);
		
		// Auto-remove after 5 seconds
		setTimeout(() => {
			if (messageDiv.parentNode) {
				messageDiv.remove();
			}
		}, 5000);
	}
}
