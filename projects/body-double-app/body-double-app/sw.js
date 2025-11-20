// Body Double Virtual Space - Service Worker
// Provides offline functionality and caching for PWA

const CACHE_NAME = 'body-double-v1.0.0';
const STATIC_CACHE = 'body-double-static-v1.0.0';
const DYNAMIC_CACHE = 'body-double-dynamic-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    './js/app.js',
    './js/session-manager.js',
    './js/avatar-system.js',
    './js/timer.js',
    './js/analytics.js',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static assets', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', request.url);
                    return cachedResponse;
                }

                // Otherwise fetch from network
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response for caching
                        const responseToCache = response.clone();

                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.log('Service Worker: Network request failed', request.url, error);
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        
                        // Return a custom offline response for other requests
                        return new Response(
                            JSON.stringify({
                                error: 'Offline',
                                message: 'This content is not available offline'
                            }),
                            {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: new Headers({
                                    'Content-Type': 'application/json'
                                })
                            }
                        );
                    });
            })
    );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'session-sync') {
        event.waitUntil(syncSessionData());
    } else if (event.tag === 'analytics-sync') {
        event.waitUntil(syncAnalyticsData());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Time for your focus session!',
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'start',
                title: 'Start Session',
                icon: './icons/icon-192x192.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: './icons/icon-192x192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Body Double Virtual Space', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event.action);
    
    event.notification.close();

    if (event.action === 'start') {
        event.waitUntil(
            clients.openWindow('./index.html?action=start')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open app
        event.waitUntil(
            clients.openWindow('./index.html')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    } else if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    } else if (event.data && event.data.type === 'CACHE_SESSION_DATA') {
        cacheSessionData(event.data.sessionData);
    }
});

// Helper functions
async function syncSessionData() {
    try {
        // Get offline session data from IndexedDB
        const sessionData = await getOfflineSessionData();
        
        if (sessionData && sessionData.length > 0) {
            // Sync with server
            const response = await fetch('/api/sessions/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessions: sessionData })
            });

            if (response.ok) {
                console.log('Service Worker: Session data synced successfully');
                // Clear offline data after successful sync
                await clearOfflineSessionData();
            }
        }
    } catch (error) {
        console.error('Service Worker: Failed to sync session data', error);
    }
}

async function syncAnalyticsData() {
    try {
        // Get offline analytics data
        const analyticsData = await getOfflineAnalyticsData();
        
        if (analyticsData && analyticsData.length > 0) {
            // Sync with server
            const response = await fetch('/api/analytics/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ events: analyticsData })
            });

            if (response.ok) {
                console.log('Service Worker: Analytics data synced successfully');
                // Clear offline data after successful sync
                await clearOfflineAnalyticsData();
            }
        }
    } catch (error) {
        console.error('Service Worker: Failed to sync analytics data', error);
    }
}

async function cacheSessionData(sessionData) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put('/api/sessions/offline', new Response(JSON.stringify(sessionData)));
        console.log('Service Worker: Session data cached for offline sync');
    } catch (error) {
        console.error('Service Worker: Failed to cache session data', error);
    }
}

async function getOfflineSessionData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match('/api/sessions/offline');
        return response ? await response.json() : [];
    } catch (error) {
        console.error('Service Worker: Failed to get offline session data', error);
        return [];
    }
}

async function clearOfflineSessionData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.delete('/api/sessions/offline');
        console.log('Service Worker: Offline session data cleared');
    } catch (error) {
        console.error('Service Worker: Failed to clear offline session data', error);
    }
}

async function getOfflineAnalyticsData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match('/api/analytics/offline');
        return response ? await response.json() : [];
    } catch (error) {
        console.error('Service Worker: Failed to get offline analytics data', error);
        return [];
    }
}

async function clearOfflineAnalyticsData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.delete('/api/analytics/offline');
        console.log('Service Worker: Offline analytics data cleared');
    } catch (error) {
        console.error('Service Worker: Failed to clear offline analytics data', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'session-sync') {
        event.waitUntil(syncSessionData());
    }
});

console.log('Service Worker: Loaded successfully');
