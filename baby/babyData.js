export const BabyWeekData = {
	info(week, languageManager = null) {
		const idx = Math.max(1, Math.min(40, week)) - 1;
		const base = this.weeks[idx];
		return enrichWeek(base, languageManager);
	},
	weeks: [
		{ week: 1, size: "poppy seed", fact: "It’s the very beginning; most development is cellular groundwork that supports the journey ahead.", tips: [
			"Start or continue a prenatal vitamin with folate.",
			"Track your cycle and estimated due date."
		]},
		{ week: 2, size: "sesame seed", fact: "Your body is preparing hormonally for implantation and early growth.", tips: [
			"Prioritize balanced meals and hydration.",
			"Limit alcohol and avoid smoking."
		]},
		{ week: 3, size: "poppy seed", fact: "Fertilization and early cell division may occur; a tiny cluster of cells begins forming.", tips: [
			"Rest well to support hormonal balance.",
			"Keep caffeine moderate (≤200 mg/day)."
		]},
		{ week: 4, size: "poppy seed", fact: "Implantation is likely complete; the placenta starts forming to nourish your baby.", tips: [
			"If positive test: schedule a prenatal visit.",
			"Note medications and ask your provider about safety."
		]},
		{ week: 5, size: "sesame seed", fact: "The neural tube is forming, which will become the brain and spinal cord.", tips: [
			"Ensure folate/folic acid intake is adequate.",
			"Eat iron-rich foods (beans, leafy greens, lean meats)."
		]},
		{ week: 6, size: "lentil", fact: "A tiny heartbeat may be detectable; facial features begin to take shape.", tips: [
			"Small, frequent meals can ease nausea.",
			"Keep a water bottle handy throughout the day."
		]},
		{ week: 7, size: "blueberry", fact: "Arm and leg buds are present; brain development is rapid.", tips: [
			"Try ginger or vitamin B6 for nausea (ask provider).",
			"Light movement like walking can boost energy."
		]},
		{ week: 8, size: "kidney bean", fact: "Fingers and toes start to form; major organs continue developing.", tips: [
			"Choose protein with each meal for steady energy.",
			"Use unscented skincare if scents trigger nausea."
		]},
		{ week: 9, size: "grape", fact: "Cartilage and bone are forming; baby’s tail is nearly gone.", tips: [
			"Consider a simple symptom journal.",
			"Plan your first prenatal appointment if not yet scheduled."
		]},
		{ week: 10, size: "kumquat", fact: "Vital organs are formed; baby is now called a fetus.", tips: [
			"Add fiber for digestion (oats, fruits, veggies).",
			"Practice gentle stretches for comfort."
		]},
		{ week: 11, size: "fig", fact: "Tooth buds form; baby can move though you won’t feel it yet.", tips: [
			"Schedule recommended screenings with your provider.",
			"Keep snacks handy to prevent dizziness."
		]},
		{ week: 12, size: "lime", fact: "Reflexes begin; the digestive system is practicing movements.", tips: [
			"Review travel plans and safety timing with your provider.",
			"Use SPF; skin can be more sun-sensitive."
		]},
		{ week: 13, size: "pea pod", fact: "Vocal cords and fingerprints develop; you’re entering the second trimester soon.", tips: [
			"Reassess your sleep setup for better support.",
			"Aim for consistent, gentle exercise."
		]},
		{ week: 14, size: "lemon", fact: "Lanugo (fine hair) may begin to grow; baby can practice facial expressions.", tips: [
			"Nausea may ease—rebalance nutrition if appetite returns.",
			"Hydrate with water-rich foods (cucumber, melon)."
		]},
		{ week: 15, size: "apple", fact: "Bones harden and limbs lengthen; hearing starts developing.", tips: [
			"Consider a prenatal yoga class.",
			"Check iron levels and intake with your provider."
		]},
		{ week: 16, size: "avocado", fact: "Baby can make sucking motions; eyes are moving behind lids.", tips: [
			"Side sleeping with a pillow can improve comfort.",
			"Keep up calcium and vitamin D."
		]},
		{ week: 17, size: "pear", fact: "Fat stores begin; the skeleton continues to harden.", tips: [
			"Wear supportive footwear to reduce strain.",
			"Add magnesium-rich foods (nuts, legumes)."
		]},
		{ week: 18, size: "sweet potato", fact: "You may feel flutters (quickening); ears are in position.", tips: [
			"Note fetal movement patterns as they emerge.",
			"Discuss anatomy scan timing (around 20 weeks)."
		]},
		{ week: 19, size: "mango", fact: "Vernix caseosa forms to protect skin; nerves specialize.", tips: [
			"Moisturize skin to ease itchiness.",
			"Practice diaphragmatic breathing."
		]},
		{ week: 20, size: "banana", fact: "Halfway there; anatomy scan typically around now.", tips: [
			"Review results and questions with your provider.",
			"Evaluate workplace ergonomics."
		]},
		{ week: 21, size: "carrot", fact: "Baby’s taste buds work; you might notice preferences.", tips: [
			"Balance meals: protein, complex carbs, healthy fats.",
			"Elevate feet briefly to reduce swelling."
		]},
		{ week: 22, size: "papaya", fact: "Facial features are more defined; sleep/wake cycles form.", tips: [
			"Practice left-side sleeping for circulation.",
			"Stay active with low-impact movement."
		]},
		{ week: 23, size: "grapefruit", fact: "Skin is less transparent; lungs and surfactant develop.", tips: [
			"Increase fiber and water for regularity.",
			"Consider a maternity support band if helpful."
		]},
		{ week: 24, size: "corn cob", fact: "Hearing improves; baby responds to your voice.", tips: [
			"Read or sing—bonding can start now.",
			"Know preterm labor signs; call your provider if unsure."
		]},
		{ week: 25, size: "rutabaga", fact: "Hair texture and color start to develop.", tips: [
			"Prioritize sleep hygiene; use a cool, dark room.",
			"Plan glucose screening if recommended."
		]},
		{ week: 26, size: "scallion", fact: "Eyes start to open; brain wave activity increases.", tips: [
			"Stretch calves and stay hydrated to reduce cramps.",
			"Add choline sources (eggs, legumes)."
		]},
		{ week: 27, size: "cauliflower", fact: "Third trimester approaches; lungs continue maturing.", tips: [
			"Review third-trimester appointments and tests.",
			"Practice gentle hip and back mobility."
		]},
		{ week: 28, size: "eggplant", fact: "Baby can blink and has REM sleep; more body fat forms.", tips: [
			"Know fetal movement guidelines and kick counts.",
			"Discuss Tdap/other vaccines per guidance."
		]},
		{ week: 29, size: "butternut squash", fact: "Muscles and lungs keep strengthening; bones are sturdy.", tips: [
			"Maintain iron and vitamin C combo for absorption.",
			"Use side-lying rest to ease back strain."
		]},
		{ week: 30, size: "cabbage", fact: "Brain grooves deepen; baby’s grip strengthens.", tips: [
			"Finalize birth class or hospital tour.",
			"Prepare a simple postpartum support plan."
		]},
		{ week: 31, size: "coconut", fact: "Baby can track light; layers of fat smooth the skin.", tips: [
			"Test your car seat installation early.",
			"Start organizing your hospital bag list."
		]},
		{ week: 32, size: "jicama", fact: "Bones are fully formed but still soft; practice breathing continues.", tips: [
			"Discuss birth preferences with your provider.",
			"Elevate legs and use compression if recommended."
		]},
		{ week: 33, size: "pineapple", fact: "Immune system support increases; periods of sleep grow longer.", tips: [
			"Prep freezer-friendly meals.",
			"Review signs of labor and when to call."
		]},
		{ week: 34, size: "cantaloupe", fact: "Central nervous system and lungs mature steadily.", tips: [
			"Wash baby clothes and linens.",
			"Consider perineal massage if advised."
		]},
		{ week: 35, size: "honeydew", fact: "Baby gains about 200–250 g per week; space is getting tight.", tips: [
			"Confirm your support person plans.",
			"Stay flexible and rest as needed."
		]},
		{ week: 36, size: "romaine lettuce", fact: "Baby likely head-down; practicing coordination and breathing.", tips: [
			"Keep your phone charged and bag ready.",
			"Plan pet/house logistics for delivery time."
		]},
		{ week: 37, size: "swiss chard", fact: "Considered early term; lungs are maturing.", tips: [
			"Have hospital route and parking planned.",
			"Continue monitoring movement; call if decreased."
		]},
		{ week: 38, size: "leek", fact: "Vernix thickens; baby’s grasp is firm and neural connections thrive.", tips: [
			"Prioritize protein and fluids for labor stamina.",
			"Practice relaxation and breathing techniques."
		]},
		{ week: 39, size: "mini watermelon", fact: "Full term; baby’s brain and lungs benefit from each extra day.", tips: [
			"Confirm your birth preferences and paperwork.",
			"Rest between practice contractions."
		]},
		{ week: 40, size: "small pumpkin", fact: "Due date! Many healthy pregnancies deliver before or after this week.", tips: [
			"Stay in touch with your provider on next steps.",
			"Focus on rest, nourishment, and calm."
		]}
	]
};

function enrichWeek(base, languageManager = null) {
	// Backward-compatible enrichment: keep original fields and add friendly, hip sections
	const wk = base.week;
	const toneEmoji = weekVibeEmoji(wk);
	const sections = buildSections(wk, base, languageManager);
	return { ...base, toneEmoji, sections };
}

function weekVibeEmoji(wk) {
	if (wk <= 4) return "🌱";
	if (wk <= 12) return "✨";
	if (wk <= 20) return "🚀";
	if (wk <= 28) return "🌈";
	if (wk <= 36) return "💪";
	return "🎉";
}

function buildSections(week, base, languageManager = null) {
	const { fact, tips } = base;
	// Spread the original tips across relevant sections for immediate value
	const [tip1 = null, tip2 = null, tip3 = null] = tips || [];

	// Helper function to get translated text
	const t = (key, params = {}) => {
		if (languageManager) {
			return languageManager.t(key, params);
		}
		// Fallback to English if no language manager
		const fallbacks = {
			'content.babySize': `Baby is about the size of a ${params.size || '{size}'}.`,
			'content.babyGrowing': 'Baby is growing fast.',
			'content.firstTrimester': 'First-trimester feels are real—fatigue and nausea may ebb and flow.',
			'content.secondTrimester': 'Energy may be better now; posture and core support matter more.',
			'content.thirdTrimester': 'More pressure and swelling are normal; listen to your body\'s pace.',
			'content.hydration': 'Hydration is a superpower—aim for steady sips all day.',
			'content.ironAbsorption': 'Iron + vitamin C = better absorption (think beans + bell peppers).',
			'content.lightStrength': 'Light strength and mobility keep you comfy and resilient.',
			'content.sideLying': 'Practice side-lying and pelvic tilts for back relief.',
			'content.microMindfulness': 'Micro-mindfulness: 60 seconds of slow breathing between tasks = calmer day.',
			'content.gratitudeList': 'Start a tiny gratitude list about your body\'s daily wins.',
			'content.firstVisit': 'Book your first prenatal visit if you haven\'t yet.',
			'content.anatomyScan': 'Anatomy scan window—confirm date and questions.',
			'content.glucoseScreening': 'Glucose screening—know the plan.',
			'content.kickCounts': 'Learn kick-count basics—know baby\'s rhythm.',
			'content.birthPreferences': 'Draft birth preferences; tour your birth location if possible.',
			'content.bagPrep': 'Bag prep, car seat install check, and support contacts ready.',
			'content.watchFor': 'Anything I should watch for this week given my history?',
			'content.movementGuidelines': 'What movement guidelines fit my activity level?',
			'content.kickCountGuidelines': 'How and when should I do kick counts?',
			'content.severePain': 'Severe abdominal pain, heavy bleeding, or fluid gush—seek urgent care.',
			'content.contractions': 'Regular contractions before 37 weeks—call immediately.',
			'content.decreasedMovement': 'Noticeable decrease in baby movement—contact your provider.',
			'content.visionChanges': 'Severe headaches, vision changes, or upper abdominal pain—urgent evaluation needed.',
			'content.talkToBaby': 'Talk, sing, or read to your baby—they can hear you now!',
			'content.partnerBonding': 'Include your partner in belly time and baby prep.',
			'content.memoryMaking': 'Capture this time—photos, journal entries, or voice notes.'
		};
		return fallbacks[key] || key;
	};

	const development = [
		decorate(base.size ? t('content.babySize', { size: base.size }) : t('content.babyGrowing')),
		decorate(fact)
	].filter(Boolean);

	const yourBody = filterTruthy([
		week <= 12 ? decorate(t('content.firstTrimester')) : null,
		week > 12 && week <= 28 ? decorate(t('content.secondTrimester')) : null,
		week > 28 ? decorate(t('content.thirdTrimester')) : null
	]);

	const nutrition = filterTruthy([
		decorate(tip1 || defaultNutrition(week)),
		decorate(t('content.hydration')),
		week >= 20 ? decorate(t('content.ironAbsorption')) : null
	]);

	const movement = filterTruthy([
		decorate(tip2 || defaultMovement(week)),
		decorate(t('content.lightStrength')),
		week >= 28 ? decorate(t('content.sideLying')) : null
	]);

	const mind = filterTruthy([
		decorate(t('content.microMindfulness')),
		week >= 24 ? decorate(t('content.gratitudeList')) : null
	]);

	const checklist = filterTruthy([
		week <= 10 ? decorate(t('content.firstVisit')) : null,
		week >= 18 && week <= 22 ? decorate(t('content.anatomyScan')) : null,
		week >= 24 && week <= 28 ? decorate(t('content.glucoseScreening')) : null,
		week >= 28 ? decorate(t('content.kickCounts')) : null,
		week >= 32 ? decorate(t('content.birthPreferences')) : null,
		week >= 36 ? decorate(t('content.bagPrep')) : null
	]);

	const questions = filterTruthy([
		decorate(t('content.watchFor')),
		week >= 20 ? decorate(t('content.movementGuidelines')) : null,
		week >= 28 ? decorate(t('content.kickCountGuidelines')) : null
	]);

	const redFlags = filterTruthy([
		decorate(t('content.severePain')),
		week >= 20 ? decorate(t('content.visionChanges')) : null,
		week >= 28 ? decorate(t('content.decreasedMovement')) : null
	]);

	const fun = filterTruthy([
		decorate(tip3 || defaultFun(week)),
		decorate(t('content.memoryMaking')),
	]);

	return {
		development,
		yourBody,
		nutrition,
		movement,
		mind,
		checklist,
		questions,
		redFlags,
		fun
	};
}

function decorate(text) {
	if (!text) return null;
	return text
		.replace(/^/,'• ')
		.replace(/\s+/g, ' ')
		.trim();
}

function filterTruthy(arr) {
	return (arr || []).filter(Boolean);
}

function defaultNutrition(week) {
	if (week <= 12) return "Nibble-friendly snacks: nuts, yogurt, fruit for steady energy.";
	if (week <= 28) return "Build plates: protein + fiber + healthy fats for stable vibes.";
	return "Smaller, frequent meals; add fiber + fluids to support digestion.";
}

function defaultMovement(week) {
	if (week <= 12) return "Walks and gentle stretching—motion helps nausea and mood.";
	if (week <= 28) return "Prenatal yoga or swimming—easy on joints, great on comfort.";
	return "Daily mobility minutes: ankles, hips, back—thank us later.";
}

function defaultFun(week) {
	if (week <= 12) return "Curate a feel-good playlist for morning pep talks.";
	if (week <= 28) return "Pick a weekly ‘celebrate this win’ ritual (treat, call, stroll).";
	return "Create a cozy corner for newborn snuggles—soft light, soft blanket.";
}