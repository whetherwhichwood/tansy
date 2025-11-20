import { AuthManager } from './authManager.js';
import { LanguageToggle } from './languageToggle.js';

const el = sel => document.querySelector(sel);
const authManager = new AuthManager();
const languageToggle = new LanguageToggle();

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
		// Show profile completion form instead of redirecting
		showProfileCompletionForm();
		return;
	}
	
	const profile = authManager.getUserProfile();
	const currentWeek = authManager.getCurrentWeek();

	// Render tips page
	renderTipsPage(profile, currentWeek);

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

function renderTipsPage(profile, currentWeek) {
	const container = el('#app');
	
	container.innerHTML = `
		<div class="tips-container">
			<!-- Nutrition Tips -->
			<section class="card tips-section">
				<div class="section-header">
					<div class="section-icon">🥗</div>
					<h2>Nutrition & Diet</h2>
				</div>
				<div class="tips-grid">
					${renderNutritionTips(currentWeek)}
				</div>
			</section>

			<!-- Exercise Tips -->
			<section class="card tips-section">
				<div class="section-header">
					<div class="section-icon">🏃‍♀️</div>
					<h2>Exercise & Movement</h2>
				</div>
				<div class="tips-grid">
					${renderExerciseTips(currentWeek)}
				</div>
			</section>

			<!-- Wellness Tips -->
			<section class="card tips-section">
				<div class="section-header">
					<div class="section-icon">🧘‍♀️</div>
					<h2>Mental Wellness</h2>
				</div>
				<div class="tips-grid">
					${renderWellnessTips(currentWeek)}
				</div>
			</section>

			<!-- Sleep Tips -->
			<section class="card tips-section">
				<div class="section-header">
					<div class="section-icon">😴</div>
					<h2>Sleep & Rest</h2>
				</div>
				<div class="tips-grid">
					${renderSleepTips(currentWeek)}
				</div>
			</section>

			<!-- Safety Tips -->
			<section class="card tips-section">
				<div class="section-header">
					<div class="section-icon">🛡️</div>
					<h2>Safety & Precautions</h2>
				</div>
				<div class="tips-grid">
					${renderSafetyTips(currentWeek)}
				</div>
			</section>
		</div>
	`;
}

function renderNutritionTips(week) {
	const tips = [
		"🍎 Eat 5-7 servings of fruits and vegetables daily",
		"🥛 Aim for 3-4 servings of dairy for calcium",
		"🥩 Include lean protein in every meal",
		"💧 Drink 8-10 glasses of water daily",
		"🌾 Choose whole grains over refined carbs",
		"🥜 Snack on nuts and seeds for healthy fats",
		"🍊 Get vitamin C from citrus fruits",
		"🥬 Add leafy greens for folate and iron"
	];

	if (week <= 12) {
		tips.push("🍞 Eat small, frequent meals to manage nausea");
		tips.push("🍋 Try ginger tea or ginger candies for morning sickness");
	}

	if (week >= 20) {
		tips.push("🥩 Increase iron intake - baby needs more blood supply");
		tips.push("🐟 Add omega-3 rich fish (salmon, sardines) twice weekly");
	}

	if (week >= 28) {
		tips.push("🍽️ Eat smaller portions more frequently as space gets tight");
		tips.push("🥤 Stay extra hydrated - helps with swelling");
	}

	return tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
}

function renderExerciseTips(week) {
	const tips = [
		"🚶‍♀️ Walk 30 minutes daily - great for circulation",
		"🧘‍♀️ Practice prenatal yoga for flexibility",
		"🏊‍♀️ Swimming is gentle on joints and refreshing",
		"💪 Light strength training with proper form",
		"🤸‍♀️ Pelvic floor exercises (Kegels) daily",
		"🦵 Stretch calves to prevent leg cramps",
		"🤲 Practice deep breathing exercises"
	];

	if (week <= 12) {
		tips.push("⚡ Listen to your body - rest when needed");
		tips.push("🚫 Avoid high-impact activities if nauseous");
	}

	if (week >= 20) {
		tips.push("🛏️ Use pregnancy support pillows for comfort");
		tips.push("🚫 Avoid exercises lying flat on your back");
	}

	if (week >= 32) {
		tips.push("🚶‍♀️ Focus on gentle movement and walking");
		tips.push("🪑 Use a chair for support during exercises");
	}

	return tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
}

function renderWellnessTips(week) {
	const tips = [
		"🧘‍♀️ Practice 5-10 minutes of daily meditation",
		"📝 Keep a gratitude journal",
		"🎵 Listen to calming music or nature sounds",
		"📚 Read pregnancy books or join online communities",
		"💬 Talk openly with your partner about feelings",
		"🌿 Spend time in nature when possible",
		"🎨 Engage in creative activities you enjoy"
	];

	if (week <= 12) {
		tips.push("😌 Accept that mood swings are normal");
		tips.push("💤 Prioritize rest - your body is working hard");
	}

	if (week >= 20) {
		tips.push("👶 Start bonding with baby through talking/singing");
		tips.push("📸 Take weekly bump photos to track progress");
	}

	if (week >= 32) {
		tips.push("🤱 Prepare mentally for labor and delivery");
		tips.push("👨‍👩‍👧‍👦 Plan for postpartum support system");
	}

	return tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
}

function renderSleepTips(week) {
	const tips = [
		"🛏️ Sleep on your left side for better circulation",
		"🕐 Establish a consistent bedtime routine",
		"🌡️ Keep bedroom cool and dark",
		"📱 Avoid screens 1 hour before bed",
		"☕ Limit caffeine after 2 PM",
		"🛁 Take a warm bath before bed",
		"📖 Read a book instead of scrolling"
	];

	if (week >= 16) {
		tips.push("🛏️ Use a pregnancy pillow for support");
		tips.push("🚰 Keep water nearby for nighttime hydration");
	}

	if (week >= 28) {
		tips.push("🛏️ Elevate your feet with pillows");
		tips.push("🚽 Reduce fluids 2 hours before bed");
	}

	return tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
}

function renderSafetyTips(week) {
	const tips = [
		"🚫 Avoid alcohol, smoking, and recreational drugs",
		"☕ Limit caffeine to 200mg daily (1-2 cups coffee)",
		"🐟 Avoid high-mercury fish (shark, swordfish, king mackerel)",
		"🧀 Skip unpasteurized dairy and soft cheeses",
		"🥩 Cook all meats thoroughly",
		"🧼 Wash hands frequently",
		"🦠 Avoid people with contagious illnesses"
	];

	if (week <= 12) {
		tips.push("💊 Take prenatal vitamins with folic acid");
		tips.push("🌡️ Avoid hot tubs and saunas");
	}

	if (week >= 20) {
		tips.push("🚗 Always wear seatbelt properly positioned");
		tips.push("✈️ Check airline policies for pregnancy travel");
	}

	if (week >= 36) {
		tips.push("🚗 Have hospital bag ready and car seat installed");
		tips.push("📞 Know when to call your provider");
	}

	return tips.map(tip => `<div class="tip-item">${tip}</div>`).join('');
}

function showProfileCompletionForm() {
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
				// Reload the page to show the tips content
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
