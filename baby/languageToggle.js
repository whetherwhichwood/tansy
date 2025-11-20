import { LanguageManager } from './languageManager.js';

export class LanguageToggle {
	constructor() {
		this.languageManager = new LanguageManager();
		this.init();
	}

	init() {
		// Always create toggle immediately
		this.createToggle();
		this.updateDisplay();
		this.bindEvents();
	}

	createToggle() {
		// Check if toggle already exists
		const existingToggle = document.querySelector('.language-toggle');
		if (existingToggle) {
			console.log('Language toggle already exists, skipping creation');
			return;
		}

		const toggle = document.createElement('div');
		toggle.className = 'language-toggle';
		toggle.innerHTML = `
			<button id="langEn" class="lang-btn" data-lang="en">
				<span class="flag">🇺🇸</span>
				<span class="lang-name">English</span>
			</button>
			<button id="langEs" class="lang-btn" data-lang="es">
				<span class="flag">🇪🇸</span>
				<span class="lang-name">Español</span>
			</button>
		`;
		
		document.body.appendChild(toggle);
	}

	updateDisplay() {
		const currentLang = this.languageManager.getCurrentLanguage();
		const enBtn = document.getElementById('langEn');
		const esBtn = document.getElementById('langEs');
		
		if (enBtn && esBtn) {
			enBtn.classList.toggle('active', currentLang === 'en');
			esBtn.classList.toggle('active', currentLang === 'es');
		}
	}

	bindEvents() {
		const enBtn = document.getElementById('langEn');
		const esBtn = document.getElementById('langEs');
		
		if (enBtn) {
			enBtn.addEventListener('click', () => {
				this.setLanguage('en');
			});
		}
		
		if (esBtn) {
			esBtn.addEventListener('click', () => {
				this.setLanguage('es');
			});
		}
	}

	setLanguage(language) {
		this.languageManager.setLanguage(language);
		// Note: LanguageManager.setLanguage() will handle the page reload
	}

	getCurrentLanguage() {
		return this.languageManager.getCurrentLanguage();
	}

	translate(key, params = {}) {
		return this.languageManager.t(key, params);
	}
}
