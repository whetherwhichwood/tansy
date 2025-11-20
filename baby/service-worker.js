const CACHE_NAME = 'pregnancy-companion-v10';
const STATIC_CACHE = 'pregnancy-static-v10';
const DYNAMIC_CACHE = 'pregnancy-dynamic-v10';

// Static assets that should be cached immediately
const STATIC_ASSETS = [
	'./',
	'./index.html',
	'./login.html',
	'./home.html',
	'./journal.html',
	'./progress.html',
	'./tips.html',
	'./sneakpeek.html',
	'./app.html',
	'./styles.css',
	'./manifest.json',
	'./favicon.svg',
	'./icons/favicon.png'
];

// JavaScript modules that should be cached
const JS_ASSETS = [
	'./app.js',
	'./landing.js',
	'./login.js',
	'./home.js',
	'./journal.js',
	'./progress.js',
	'./tips.js',
	'./sneakpeek.js',
	'./babyData.js',
	'./authManager.js',
	'./userManager.js',
	'./fruitImages.js',
	'./languageManager.js',
	'./languageToggle.js',
	'./journalManager.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
	console.log('Service Worker installing...');
	event.waitUntil(
		Promise.all([
			caches.open(STATIC_CACHE).then(cache => {
				console.log('Caching static assets...');
				return cache.addAll(STATIC_ASSETS);
			}),
			caches.open(DYNAMIC_CACHE).then(cache => {
				console.log('Caching JS modules...');
				return cache.addAll(JS_ASSETS);
			})
		]).then(() => {
			console.log('Service Worker installed successfully');
			self.skipWaiting();
		})
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
	console.log('Service Worker activating...');
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
						console.log('Deleting old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		}).then(() => {
			console.log('Service Worker activated');
			self.clients.claim();
		})
	);
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip external requests
	if (url.origin !== location.origin) {
		return;
	}

	event.respondWith(
		caches.match(request).then(cachedResponse => {
			// Return cached version if available
			if (cachedResponse) {
				console.log('Serving from cache:', request.url);
				return cachedResponse;
			}

			// Otherwise fetch from network
			return fetch(request).then(response => {
				// Don't cache if not a valid response
				if (!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				}

				// Clone the response
				const responseToCache = response.clone();

				// Determine which cache to use
				let cacheName = DYNAMIC_CACHE;
				if (STATIC_ASSETS.includes(url.pathname) || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
					cacheName = STATIC_CACHE;
				}

				// Cache the response
				caches.open(cacheName).then(cache => {
					cache.put(request, responseToCache);
					console.log('Cached new resource:', request.url);
				});

				return response;
			}).catch(error => {
				console.log('Fetch failed, serving offline page:', error);
				
				// Return offline page for navigation requests
				if (request.mode === 'navigate') {
					return caches.match('./index.html');
				}
				
				// Return a generic offline response for other requests
				return new Response('Offline content not available', {
					status: 503,
					statusText: 'Service Unavailable',
					headers: new Headers({
						'Content-Type': 'text/plain'
					})
				});
			});
		})
	);
});

// Background sync for offline data
self.addEventListener('sync', event => {
	if (event.tag === 'background-sync') {
		console.log('Background sync triggered');
		event.waitUntil(
			// Handle any pending offline data
			handleBackgroundSync()
		);
	}
});

// Push notification handling
self.addEventListener('push', event => {
	console.log('Push notification received');
	
	const options = {
		body: event.data ? event.data.text() : 'You have a new pregnancy update!',
		icon: './icons/favicon.png',
		badge: './icons/favicon.png',
		vibrate: [200, 100, 200],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		},
		actions: [
			{
				action: 'explore',
				title: 'View Update',
				icon: './icons/favicon.png'
			},
			{
				action: 'close',
				title: 'Close',
				icon: './icons/favicon.png'
			}
		]
	};

	event.waitUntil(
		self.registration.showNotification('Pregnancy Companion', options)
	);
});

// Notification click handling
self.addEventListener('notificationclick', event => {
	console.log('Notification clicked');
	event.notification.close();

	if (event.action === 'explore') {
		event.waitUntil(
			clients.openWindow('./app.html')
		);
	}
});

// Helper function for background sync
async function handleBackgroundSync() {
	try {
		// Handle any pending offline data here
		console.log('Processing background sync...');
	} catch (error) {
		console.error('Background sync failed:', error);
	}
}

// Message handling for communication with main thread
self.addEventListener('message', event => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});