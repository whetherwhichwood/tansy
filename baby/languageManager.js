export class LanguageManager {
	constructor() {
		this.currentLanguage = this.getStoredLanguage();
		this.translations = this.loadTranslations();
	}

	getStoredLanguage() {
		// Check if user is logged in and has a language preference
		const currentUser = JSON.parse(localStorage.getItem('pregnancy_current_user') || '{}');
		if (currentUser.profile && currentUser.profile.language) {
			return currentUser.profile.language;
		}
		
		// Check localStorage for language preference
		const storedLang = localStorage.getItem('pregnancy_language');
		if (storedLang) {
			return storedLang;
		}
		
		// Fallback to browser language or default to English
		const browserLang = navigator.language.split('-')[0];
		const finalLang = ['es', 'en'].includes(browserLang) ? browserLang : 'en';
		return finalLang;
	}

	setLanguage(language) {
		if (!this.translations[language]) {
			console.error('Invalid language:', language);
			return;
		}
		
		this.currentLanguage = language;
		
		// Update user profile if logged in
		const currentUser = JSON.parse(localStorage.getItem('pregnancy_current_user') || '{}');
		if (currentUser.profile) {
			currentUser.profile.language = language;
			localStorage.setItem('pregnancy_current_user', JSON.stringify(currentUser));
			
			// Also update in users registry
			const users = JSON.parse(localStorage.getItem('pregnancy_users') || '{}');
			if (users[currentUser.email]) {
				users[currentUser.email].profile.language = language;
				localStorage.setItem('pregnancy_users', JSON.stringify(users));
			}
		}
		
		// Store in localStorage for non-logged-in users
		localStorage.setItem('pregnancy_language', language);
		
		// Reload page to apply translations
		window.location.reload();
	}

	loadTranslations() {
		return {
			en: {
				// Landing Page
				'landing.title': 'Your Pregnancy Journey Starts Here 🌸',
				'landing.subtitle': 'Track your weekly progress, get personalized tips, and create lasting memories of this special time.',
				'landing.getStarted': 'Get Started',
				'landing.login': 'Log In',
				'landing.loginDesc': 'Access your personalized pregnancy dashboard',
				'landing.signup': 'Create Account',
				'landing.signupDesc': 'Start your pregnancy journey with us',
				'landing.sneakPeek': 'Sneak Peek',
				'landing.sneakPeekDesc': 'Try it out without creating an account',
				'landing.takeLook': 'Take a Look',
				'landing.features': 'What You\'ll Get',
				'landing.weeklyUpdates': 'Weekly Updates',
				'landing.weeklyUpdatesDesc': 'Detailed weekly progress and baby development info',
				'landing.journal': 'Pregnancy Journal',
				'landing.journalDesc': 'Record memories and thoughts with photos',
				'landing.progress': 'Progress Tracking',
				'landing.progressDesc': 'Visual milestones and pregnancy timeline',
				'landing.tips': 'Health Tips',
				'landing.tipsDesc': 'Personalized nutrition and wellness advice',
				
				// Authentication
				'auth.email': 'Email',
				'auth.password': 'Password',
				'auth.confirmPassword': 'Confirm Password',
				'auth.login': 'Log In',
				'auth.signup': 'Sign Up',
				'auth.createAccount': 'Create Account',
				'auth.completeProfile': 'Complete Your Profile',
				'auth.continue': 'Continue',
				'auth.name': 'Your Name',
				'auth.dueDate': 'Due Date',
				'auth.invalidEmail': 'Invalid email format',
				'auth.passwordTooShort': 'Password must be at least 6 characters',
				'auth.emailExists': 'Email already exists',
				'auth.passwordsDontMatch': 'Passwords do not match',
				'auth.invalidCredentials': 'Invalid email or password',
				'auth.selectDueDate': 'Please select a due date',
				'auth.enterDueDate': 'Enter your due date',
				'auth.calculateDescription': 'We\'ll calculate your current week, baby size, and give concise, practical tips.',
				
				// Navigation
				'nav.home': 'Home',
				'nav.logout': 'Logout',
				'nav.weeklyDetails': 'Weekly Details',
				'nav.progress': 'Progress',
				'nav.tips': 'Health Tips',
				'nav.journal': 'Journal',
				'nav.back': 'Back',
				'nav.createAccount': 'Create Account',
				
				// Home Page
				'home.welcome': 'Week {week} {emoji}',
				'home.babySize': 'Your baby is the size of a {size}',
				'home.progress': '{percent}% of your pregnancy journey',
				'home.thisWeekSize': 'This Week\'s Size',
				'home.sizeDescription': 'Your little one is about the size of a {size} this week!',
				'home.highlights': 'This Week\'s Highlights',
				'home.viewFullUpdate': 'View Full Weekly Update',
				'home.exploreMore': 'Explore More',
				'home.weeklyDetails': 'Weekly Details',
				'home.weeklyDetailsDesc': 'In-depth weekly updates and tips',
				'home.progressTracker': 'Progress Tracker',
				'home.progressTrackerDesc': 'Track your pregnancy milestones',
				'home.healthTips': 'Health Tips',
				'home.healthTipsDesc': 'Nutrition, exercise, and wellness',
				'home.pregnancyJournal': 'Pregnancy Journal',
				'home.pregnancyJournalDesc': 'Record your thoughts and memories',
				
				// Journal
				'journal.title': 'Pregnancy Journal',
				'journal.subtitle': 'Record your thoughts, feelings, and special moments',
				'journal.entryTitle': 'Title (optional)',
				'journal.entryTitlePlaceholder': 'e.g., First ultrasound, Baby kicks!',
				'journal.entryContent': 'How are you feeling today?',
				'journal.entryContentPlaceholder': 'Share your thoughts, feelings, symptoms, or special moments...',
				'journal.mood': 'Mood',
				'journal.happy': 'Happy',
				'journal.calm': 'Calm',
				'journal.tired': 'Tired',
				'journal.nauseous': 'Nauseous',
				'journal.anxious': 'Anxious',
				'journal.excited': 'Excited',
				'journal.sad': 'Sad',
				'journal.frustrated': 'Frustrated',
				'journal.photo': 'Photo (optional)',
				'journal.saveEntry': 'Save Entry',
				'journal.recentEntries': 'Recent Entries',
				'journal.noEntries': 'No journal entries yet. Start writing your pregnancy story!',
				'journal.delete': 'Delete',
				'journal.characters': 'characters',
				'journal.pleaseWrite': 'Please write something in your journal entry!',
				'journal.tooLong': 'Journal entry is too long. Please keep it under 2000 characters.',
				'journal.imageTooLarge': 'Image is too large. Please choose an image under 5MB.',
				'journal.pleaseLogin': 'Please log in to save journal entries.',
				'journal.entrySaved': 'Journal entry saved successfully!',
				'journal.failedToSave': 'Failed to save journal entry. Please try again.',
				'journal.failedToLoadImage': 'Failed to load image preview.',
				'journal.deleteConfirm': 'Are you sure you want to delete this entry?',
				'journal.entryDeleted': 'Journal entry deleted successfully!',
				'journal.failedToDelete': 'Failed to delete journal entry. Please try again.',
				
				// Weekly Details
				'weekly.babySize': 'Baby is the size of a {size}',
				'weekly.progress': '{percent}% of 40 weeks',
				'weekly.changeDueDate': 'Change Due Date',
				'weekly.babyDevelopment': 'Baby development',
				'weekly.yourBody': 'Your body',
				'weekly.smartNutrition': 'Smart nutrition',
				'weekly.movement': 'Feel-good movement',
				'weekly.mindMood': 'Mind & mood',
				'weekly.checklist': 'Weekly checklist',
				'weekly.questions': 'Ask your provider',
				'weekly.redFlags': 'Red flags (seek care)',
				'weekly.funBonding': 'Fun & bonding',
				
				// Weekly Content - Development
				'content.babySize': 'Baby is about the size of a {size}.',
				'content.babyGrowing': 'Baby is growing fast.',
				
				// Weekly Content - Your Body
				'content.firstTrimester': 'First-trimester feels are real—fatigue and nausea may ebb and flow.',
				'content.secondTrimester': 'Energy may be better now; posture and core support matter more.',
				'content.thirdTrimester': 'More pressure and swelling are normal; listen to your body\'s pace.',
				
				// Weekly Content - Nutrition
				'content.hydration': 'Hydration is a superpower—aim for steady sips all day.',
				'content.ironAbsorption': 'Iron + vitamin C = better absorption (think beans + bell peppers).',
				
				// Weekly Content - Movement
				'content.lightStrength': 'Light strength and mobility keep you comfy and resilient.',
				'content.sideLying': 'Practice side-lying and pelvic tilts for back relief.',
				
				// Weekly Content - Mind
				'content.microMindfulness': 'Micro-mindfulness: 60 seconds of slow breathing between tasks = calmer day.',
				'content.gratitudeList': 'Start a tiny gratitude list about your body\'s daily wins.',
				
				// Weekly Content - Checklist
				'content.firstVisit': 'Book your first prenatal visit if you haven\'t yet.',
				'content.anatomyScan': 'Anatomy scan window—confirm date and questions.',
				'content.glucoseScreening': 'Glucose screening—know the plan.',
				'content.kickCounts': 'Learn kick-count basics—know baby\'s rhythm.',
				'content.birthPreferences': 'Draft birth preferences; tour your birth location if possible.',
				'content.bagPrep': 'Bag prep, car seat install check, and support contacts ready.',
				
				// Weekly Content - Questions
				'content.watchFor': 'Anything I should watch for this week given my history?',
				'content.movementGuidelines': 'What movement guidelines fit my activity level?',
				'content.kickCountGuidelines': 'How and when should I do kick counts?',
				
				// Weekly Content - Red Flags
				'content.severePain': 'Severe abdominal pain, heavy bleeding, or fluid gush—seek urgent care.',
				'content.contractions': 'Regular contractions before 37 weeks—call immediately.',
				'content.decreasedMovement': 'Noticeable decrease in baby movement—contact your provider.',
				'content.visionChanges': 'Severe headaches, vision changes, or upper abdominal pain—urgent evaluation needed.',
				
				// Weekly Content - Fun & Bonding
				'content.talkToBaby': 'Talk, sing, or read to your baby—they can hear you now!',
				'content.partnerBonding': 'Include your partner in belly time and baby prep.',
				'content.memoryMaking': 'Capture this time—photos, journal entries, or voice notes.',
				
				// Due Date Modal
				'modal.changeDueDate': 'Change Due Date',
				'modal.updateDescription': 'Update your due date to recalculate your pregnancy progress.',
				'modal.dueDateLabel': 'Due Date:',
				'modal.saveChanges': 'Save Changes',
				'modal.selectDate': 'Please select a date.',
				'modal.updateFailed': 'Failed to update due date. Please try again.',
				'modal.updateSuccess': 'Due date updated successfully!',
				
				// Progress
				'progress.title': 'Pregnancy Progress',
				'progress.subtitle': 'Track your journey and milestones',
				'progress.overview': 'Progress Overview',
				'progress.currentWeek': 'Current Week',
				'progress.weeksRemaining': 'Weeks Remaining',
				'progress.completion': 'Completion',
				'progress.milestones': 'Key Milestones',
				'progress.firstTrimester': 'First Trimester',
				'progress.secondTrimester': 'Second Trimester',
				'progress.thirdTrimester': 'Third Trimester',
				'progress.stats': 'Pregnancy Stats',
				'progress.daysPregnant': 'Days Pregnant',
				'progress.weeksPregnant': 'Weeks Pregnant',
				'progress.daysToGo': 'Days to Go',
				
				// Tips
				'tips.title': 'Health Tips',
				'tips.subtitle': 'Nutrition, wellness, and self-care advice',
				'tips.nutrition': 'Nutrition',
				'tips.exercise': 'Exercise',
				'tips.mentalHealth': 'Mental Health',
				'tips.safety': 'Safety',
				
				// Sneak Peek
				'sneakpeek.title': 'Pregnancy Companion - Sneak Peek 👀',
				'sneakpeek.wantMore': '🚀 Want More Features?',
				'sneakpeek.preview': 'This is just a preview! Create an account to access:',
				'sneakpeek.personalJournal': 'Personal pregnancy journal with photos',
				'sneakpeek.detailedProgress': 'Detailed progress tracking and milestones',
				'sneakpeek.comprehensiveTips': 'Comprehensive health tips and advice',
				'sneakpeek.fullUpdates': 'Full weekly updates and development info',
				'sneakpeek.saveData': 'Save your data and return anytime',
				'sneakpeek.createFreeAccount': 'Create Free Account',
				
				// Common
				'common.loading': 'Loading...',
				'common.error': 'Error',
				'common.success': 'Success',
				'common.close': 'Close',
				'common.save': 'Save',
				'common.cancel': 'Cancel',
				'common.yes': 'Yes',
				'common.no': 'No',
				'common.bullet': '•',
				'common.disclaimer': 'Educational info only; not medical advice. Consult your provider.',
				
				// Page Titles
				'pageTitle.app': 'Pregnancy Companion - Weekly Details',
				'pageTitle.home': 'Pregnancy Companion - Home',
				'pageTitle.journal': 'Pregnancy Companion - Journal',
				'pageTitle.progress': 'Pregnancy Companion - Progress Tracker',
				'pageTitle.tips': 'Pregnancy Companion - Health Tips',
				'pageTitle.login': 'Pregnancy Companion - Login',
				'pageTitle.sneakpeek': 'Pregnancy Companion - Sneak Peek',
				'pageTitle.landing': 'Pregnancy Companion',
				
				// Page Headers
				'pageHeader.app': 'Weekly Details 📅',
				'pageHeader.home': 'Pregnancy Companion',
				'pageHeader.journal': 'Pregnancy Companion - Journal',
				'pageHeader.progress': 'Pregnancy Companion - Progress Tracker',
				'pageHeader.tips': 'Pregnancy Companion - Health Tips',
				'pageHeader.login': 'Pregnancy Companion',
				'pageHeader.sneakpeek': 'Pregnancy Companion - Sneak Peek 👀',
				'pageHeader.landing': 'Pregnancy Companion'
			},
			es: {
				// Landing Page
				'landing.title': 'Tu Viaje de Embarazo Comienza Aquí 🌸',
				'landing.subtitle': 'Rastrea tu progreso semanal, obtén consejos personalizados y crea recuerdos duraderos de este momento especial.',
				'landing.getStarted': 'Comenzar',
				'landing.login': 'Iniciar Sesión',
				'landing.loginDesc': 'Accede a tu panel de embarazo personalizado',
				'landing.signup': 'Crear Cuenta',
				'landing.signupDesc': 'Comienza tu viaje de embarazo con nosotros',
				'landing.sneakPeek': 'Vista Previa',
				'landing.sneakPeekDesc': 'Pruébalo sin crear una cuenta',
				'landing.takeLook': 'Echar un Vistazo',
				'landing.features': 'Lo Que Obtendrás',
				'landing.weeklyUpdates': 'Actualizaciones Semanales',
				'landing.weeklyUpdatesDesc': 'Información detallada del progreso semanal y desarrollo del bebé',
				'landing.journal': 'Diario de Embarazo',
				'landing.journalDesc': 'Registra recuerdos y pensamientos con fotos',
				'landing.progress': 'Seguimiento de Progreso',
				'landing.progressDesc': 'Hitos visuales y cronología del embarazo',
				'landing.tips': 'Consejos de Salud',
				'landing.tipsDesc': 'Consejos personalizados de nutrición y bienestar',
				
				// Authentication
				'auth.email': 'Correo Electrónico',
				'auth.password': 'Contraseña',
				'auth.confirmPassword': 'Confirmar Contraseña',
				'auth.login': 'Iniciar Sesión',
				'auth.signup': 'Registrarse',
				'auth.createAccount': 'Crear Cuenta',
				'auth.completeProfile': 'Completa Tu Perfil',
				'auth.continue': 'Continuar',
				'auth.name': 'Tu Nombre',
				'auth.dueDate': 'Fecha de Parto',
				'auth.invalidEmail': 'Formato de correo electrónico inválido',
				'auth.passwordTooShort': 'La contraseña debe tener al menos 6 caracteres',
				'auth.emailExists': 'El correo electrónico ya existe',
				'auth.passwordsDontMatch': 'Las contraseñas no coinciden',
				'auth.invalidCredentials': 'Correo electrónico o contraseña inválidos',
				'auth.selectDueDate': 'Por favor selecciona una fecha de parto',
				'auth.enterDueDate': 'Ingresa tu fecha de parto',
				'auth.calculateDescription': 'Calcularemos tu semana actual, el tamaño del bebé y te daremos consejos concisos y prácticos.',
				
				// Navigation
				'nav.home': 'Inicio',
				'nav.logout': 'Cerrar Sesión',
				'nav.weeklyDetails': 'Detalles Semanales',
				'nav.progress': 'Progreso',
				'nav.tips': 'Consejos de Salud',
				'nav.journal': 'Diario',
				'nav.back': 'Atrás',
				'nav.createAccount': 'Crear Cuenta',
				
				// Home Page
				'home.welcome': 'Semana {week} {emoji}',
				'home.babySize': 'Tu bebé es del tamaño de un/una {size}',
				'home.progress': '{percent}% de tu viaje de embarazo',
				'home.thisWeekSize': 'Tamaño de Esta Semana',
				'home.sizeDescription': '¡Tu pequeño es aproximadamente del tamaño de un/una {size} esta semana!',
				'home.highlights': 'Destacados de Esta Semana',
				'home.viewFullUpdate': 'Ver Actualización Semanal Completa',
				'home.exploreMore': 'Explorar Más',
				'home.weeklyDetails': 'Detalles Semanales',
				'home.weeklyDetailsDesc': 'Actualizaciones semanales detalladas y consejos',
				'home.progressTracker': 'Seguimiento de Progreso',
				'home.progressTrackerDesc': 'Rastrea los hitos de tu embarazo',
				'home.healthTips': 'Consejos de Salud',
				'home.healthTipsDesc': 'Nutrición, ejercicio y bienestar',
				'home.pregnancyJournal': 'Diario de Embarazo',
				'home.pregnancyJournalDesc': 'Registra tus pensamientos y recuerdos',
				
				// Journal
				'journal.title': 'Diario de Embarazo',
				'journal.subtitle': 'Registra tus pensamientos, sentimientos y momentos especiales',
				'journal.entryTitle': 'Título (opcional)',
				'journal.entryTitlePlaceholder': 'ej., Primera ecografía, ¡Patadas del bebé!',
				'journal.entryContent': '¿Cómo te sientes hoy?',
				'journal.entryContentPlaceholder': 'Comparte tus pensamientos, sentimientos, síntomas o momentos especiales...',
				'journal.mood': 'Estado de Ánimo',
				'journal.happy': 'Feliz',
				'journal.calm': 'Tranquila',
				'journal.tired': 'Cansada',
				'journal.nauseous': 'Nauseas',
				'journal.anxious': 'Ansiosa',
				'journal.excited': 'Emocionada',
				'journal.sad': 'Triste',
				'journal.frustrated': 'Frustrada',
				'journal.photo': 'Foto (opcional)',
				'journal.saveEntry': 'Guardar Entrada',
				'journal.recentEntries': 'Entradas Recientes',
				'journal.noEntries': 'Aún no hay entradas en el diario. ¡Comienza a escribir tu historia de embarazo!',
				'journal.delete': 'Eliminar',
				'journal.characters': 'caracteres',
				'journal.pleaseWrite': '¡Por favor escribe algo en tu entrada del diario!',
				'journal.tooLong': 'La entrada del diario es demasiado larga. Por favor manténla bajo 2000 caracteres.',
				'journal.imageTooLarge': 'La imagen es demasiado grande. Por favor elige una imagen menor a 5MB.',
				'journal.pleaseLogin': 'Por favor inicia sesión para guardar entradas del diario.',
				'journal.entrySaved': '¡Entrada del diario guardada exitosamente!',
				'journal.failedToSave': 'Error al guardar la entrada del diario. Por favor intenta de nuevo.',
				'journal.failedToLoadImage': 'Error al cargar la vista previa de la imagen.',
				'journal.deleteConfirm': '¿Estás segura de que quieres eliminar esta entrada?',
				'journal.entryDeleted': '¡Entrada del diario eliminada exitosamente!',
				'journal.failedToDelete': 'Error al eliminar la entrada del diario. Por favor intenta de nuevo.',
				
				// Weekly Details
				'weekly.babySize': 'El bebé es del tamaño de un/una {size}',
				'weekly.progress': '{percent}% de 40 semanas',
				'weekly.changeDueDate': 'Cambiar Fecha de Parto',
				'weekly.babyDevelopment': 'Desarrollo del bebé',
				'weekly.yourBody': 'Tu cuerpo',
				'weekly.smartNutrition': 'Nutrición inteligente',
				'weekly.movement': 'Movimiento saludable',
				'weekly.mindMood': 'Mente y estado de ánimo',
				'weekly.checklist': 'Lista semanal',
				'weekly.questions': 'Pregunta a tu proveedor',
				'weekly.redFlags': 'Señales de alerta (busca atención)',
				'weekly.funBonding': 'Diversión y vínculo',
				
				// Weekly Content - Development
				'content.babySize': 'El bebé es aproximadamente del tamaño de un/una {size}.',
				'content.babyGrowing': 'El bebé está creciendo rápidamente.',
				
				// Weekly Content - Your Body
				'content.firstTrimester': 'Las sensaciones del primer trimestre son reales—la fatiga y las náuseas pueden ir y venir.',
				'content.secondTrimester': 'La energía puede ser mejor ahora; la postura y el soporte del core importan más.',
				'content.thirdTrimester': 'Más presión e hinchazón son normales; escucha el ritmo de tu cuerpo.',
				
				// Weekly Content - Nutrition
				'content.hydration': 'La hidratación es un superpoder—apunta a sorbos constantes todo el día.',
				'content.ironAbsorption': 'Hierro + vitamina C = mejor absorción (piensa en frijoles + pimientos).',
				
				// Weekly Content - Movement
				'content.lightStrength': 'La fuerza ligera y la movilidad te mantienen cómoda y resistente.',
				'content.sideLying': 'Practica acostarte de lado y inclinaciones pélvicas para alivio de la espalda.',
				
				// Weekly Content - Mind
				'content.microMindfulness': 'Micro-atención plena: 60 segundos de respiración lenta entre tareas = día más calmado.',
				'content.gratitudeList': 'Comienza una pequeña lista de gratitud sobre las victorias diarias de tu cuerpo.',
				
				// Weekly Content - Checklist
				'content.firstVisit': 'Reserva tu primera visita prenatal si aún no lo has hecho.',
				'content.anatomyScan': 'Ventana de ecografía anatómica—confirma la fecha y preguntas.',
				'content.glucoseScreening': 'Tamizaje de glucosa—conoce el plan.',
				'content.kickCounts': 'Aprende los conceptos básicos del conteo de patadas—conoce el ritmo del bebé.',
				'content.birthPreferences': 'Redacta preferencias de parto; visita tu lugar de parto si es posible.',
				'content.bagPrep': 'Preparación de maleta, verificación de instalación del asiento del auto y contactos de apoyo listos.',
				
				// Weekly Content - Questions
				'content.watchFor': '¿Hay algo que debería vigilar esta semana dado mi historial?',
				'content.movementGuidelines': '¿Qué pautas de movimiento se adaptan a mi nivel de actividad?',
				'content.kickCountGuidelines': '¿Cómo y cuándo debo hacer conteos de patadas?',
				
				// Weekly Content - Red Flags
				'content.severePain': 'Dolor abdominal severo, sangrado abundante o chorro de líquido—busca atención urgente.',
				'content.contractions': 'Contracciones regulares antes de las 37 semanas—llama inmediatamente.',
				'content.decreasedMovement': 'Disminución notable en el movimiento del bebé—contacta a tu proveedor.',
				'content.visionChanges': 'Dolores de cabeza severos, cambios en la visión o dolor abdominal superior—evaluación urgente necesaria.',
				
				// Weekly Content - Fun & Bonding
				'content.talkToBaby': '¡Habla, canta o lee a tu bebé—ya pueden escucharte!',
				'content.partnerBonding': 'Incluye a tu pareja en el tiempo de barriga y preparación del bebé.',
				'content.memoryMaking': 'Captura este tiempo—fotos, entradas de diario o notas de voz.',
				
				// Due Date Modal
				'modal.changeDueDate': 'Cambiar Fecha de Parto',
				'modal.updateDescription': 'Actualiza tu fecha de parto para recalcular el progreso de tu embarazo.',
				'modal.dueDateLabel': 'Fecha de Parto:',
				'modal.saveChanges': 'Guardar Cambios',
				'modal.selectDate': 'Por favor selecciona una fecha.',
				'modal.updateFailed': 'Error al actualizar la fecha de parto. Por favor intenta de nuevo.',
				'modal.updateSuccess': '¡Fecha de parto actualizada exitosamente!',
				
				// Progress
				'progress.title': 'Progreso del Embarazo',
				'progress.subtitle': 'Rastrea tu viaje e hitos',
				'progress.overview': 'Resumen del Progreso',
				'progress.currentWeek': 'Semana Actual',
				'progress.weeksRemaining': 'Semanas Restantes',
				'progress.completion': 'Completado',
				'progress.milestones': 'Hitos Clave',
				'progress.firstTrimester': 'Primer Trimestre',
				'progress.secondTrimester': 'Segundo Trimestre',
				'progress.thirdTrimester': 'Tercer Trimestre',
				'progress.stats': 'Estadísticas del Embarazo',
				'progress.daysPregnant': 'Días de Embarazo',
				'progress.weeksPregnant': 'Semanas de Embarazo',
				'progress.daysToGo': 'Días Restantes',
				
				// Tips
				'tips.title': 'Consejos de Salud',
				'tips.subtitle': 'Consejos de nutrición, bienestar y autocuidado',
				'tips.nutrition': 'Nutrición',
				'tips.exercise': 'Ejercicio',
				'tips.mentalHealth': 'Salud Mental',
				'tips.safety': 'Seguridad',
				
				// Sneak Peek
				'sneakpeek.title': 'Compañero de Embarazo - Vista Previa 👀',
				'sneakpeek.wantMore': '🚀 ¿Quieres Más Características?',
				'sneakpeek.preview': '¡Esto es solo una vista previa! Crea una cuenta para acceder a:',
				'sneakpeek.personalJournal': 'Diario personal de embarazo con fotos',
				'sneakpeek.detailedProgress': 'Seguimiento detallado de progreso e hitos',
				'sneakpeek.comprehensiveTips': 'Consejos de salud comprensivos',
				'sneakpeek.fullUpdates': 'Actualizaciones semanales completas e información de desarrollo',
				'sneakpeek.saveData': 'Guarda tus datos y regresa en cualquier momento',
				'sneakpeek.createFreeAccount': 'Crear Cuenta Gratuita',
				
				// Common
				'common.loading': 'Cargando...',
				'common.error': 'Error',
				'common.success': 'Éxito',
				'common.close': 'Cerrar',
				'common.save': 'Guardar',
				'common.cancel': 'Cancelar',
				'common.yes': 'Sí',
				'common.no': 'No',
				'common.bullet': '•',
				'common.disclaimer': 'Información educativa únicamente; no es consejo médico. Consulta a tu proveedor.',
				
				// Page Titles
				'pageTitle.app': 'Compañero de Embarazo - Detalles Semanales',
				'pageTitle.home': 'Compañero de Embarazo - Inicio',
				'pageTitle.journal': 'Compañero de Embarazo - Diario',
				'pageTitle.progress': 'Compañero de Embarazo - Seguimiento de Progreso',
				'pageTitle.tips': 'Compañero de Embarazo - Consejos de Salud',
				'pageTitle.login': 'Compañero de Embarazo - Iniciar Sesión',
				'pageTitle.sneakpeek': 'Compañero de Embarazo - Vista Previa',
				'pageTitle.landing': 'Compañero de Embarazo',
				
				// Page Headers
				'pageHeader.app': 'Detalles Semanales 📅',
				'pageHeader.home': 'Compañero de Embarazo',
				'pageHeader.journal': 'Compañero de Embarazo - Diario',
				'pageHeader.progress': 'Compañero de Embarazo - Seguimiento de Progreso',
				'pageHeader.tips': 'Compañero de Embarazo - Consejos de Salud',
				'pageHeader.login': 'Compañero de Embarazo',
				'pageHeader.sneakpeek': 'Compañero de Embarazo - Vista Previa 👀',
				'pageHeader.landing': 'Compañero de Embarazo'
			}
		};
	}

	t(key, params = {}) {
		let translation = this.translations[this.currentLanguage][key] || this.translations['en'][key] || key;
		
		// Replace parameters
		Object.keys(params).forEach(param => {
			translation = translation.replace(`{${param}}`, params[param]);
		});
		
		return translation;
	}


	toggleLanguage() {
		const newLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
		this.setLanguage(newLanguage);
		return newLanguage;
	}

	getCurrentLanguage() {
		return this.currentLanguage;
	}

	getLanguageFlag() {
		return this.currentLanguage === 'en' ? '🇺🇸' : '🇪🇸';
	}

	getLanguageName() {
		return this.currentLanguage === 'en' ? 'English' : 'Español';
	}
}
