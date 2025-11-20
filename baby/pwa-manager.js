// PWA Manager - Handles installation, updates, and offline functionality
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.setupUpdateHandler();
        this.setupOnlineOfflineHandlers();
        this.setupServiceWorker();
    }

    setupInstallPrompt() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Listen for the appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.isInstalled = true;
            this.hideInstallButton();
            this.deferredPrompt = null;
        });
    }

    setupUpdateHandler() {
        // Check for updates when the page loads
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service worker updated, reloading page');
                window.location.reload();
            });
        }
    }

    setupOnlineOfflineHandlers() {
        window.addEventListener('online', () => {
            console.log('App is online');
            this.isOnline = true;
            this.hideOfflineIndicator();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            console.log('App is offline');
            this.isOnline = false;
            this.showOfflineIndicator();
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registered successfully:', registration);
                    this.checkForUpdates(registration);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            console.log('Install prompt not available');
            return false;
        }

        try {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                return true;
            } else {
                console.log('User dismissed the install prompt');
                return false;
            }
        } catch (error) {
            console.error('Error during installation:', error);
            return false;
        } finally {
            this.deferredPrompt = null;
        }
    }

    checkForUpdates(registration) {
        if (registration.waiting) {
            // There's an update waiting
            this.showUpdateAvailable();
        }

        // Listen for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New update is available
                        this.showUpdateAvailable();
                    }
                });
            }
        });
    }

    updateApp() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (registration && registration.waiting) {
                    // Tell the waiting service worker to skip waiting
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
            });
        }
    }

    showInstallButton() {
        // Create install button if it doesn't exist
        let installBtn = document.getElementById('install-btn');
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'install-btn';
            installBtn.className = 'install-btn';
            installBtn.innerHTML = '📱 Install App';
            installBtn.onclick = () => this.installApp();
            
            // Add to page
            const header = document.querySelector('.header');
            if (header) {
                header.appendChild(installBtn);
            }
        }
        installBtn.style.display = 'block';
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    showUpdateAvailable() {
        // Create update notification
        let updateNotification = document.getElementById('update-notification');
        if (!updateNotification) {
            updateNotification = document.createElement('div');
            updateNotification.id = 'update-notification';
            updateNotification.className = 'update-notification';
            updateNotification.innerHTML = `
                <div class="update-content">
                    <span>🔄 Update Available</span>
                    <button onclick="pwaManager.updateApp()" class="update-btn">Update Now</button>
                </div>
            `;
            
            // Add to page
            document.body.appendChild(updateNotification);
        }
        updateNotification.style.display = 'block';
    }

    showOfflineIndicator() {
        let offlineIndicator = document.getElementById('offline-indicator');
        if (!offlineIndicator) {
            offlineIndicator = document.createElement('div');
            offlineIndicator.id = 'offline-indicator';
            offlineIndicator.className = 'offline-indicator';
            offlineIndicator.innerHTML = '📡 You\'re offline - some features may be limited';
            
            // Add to page
            document.body.appendChild(offlineIndicator);
        }
        offlineIndicator.style.display = 'block';
    }

    hideOfflineIndicator() {
        const offlineIndicator = document.getElementById('offline-indicator');
        if (offlineIndicator) {
            offlineIndicator.style.display = 'none';
        }
    }

    async syncOfflineData() {
        // Sync any data that was saved while offline
        console.log('Syncing offline data...');
        // Implementation would depend on your data storage strategy
    }

    // Utility methods
    isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }

    getInstallabilityStatus() {
        return {
            canInstall: !!this.deferredPrompt,
            isInstalled: this.isInstalled,
            isOnline: this.isOnline,
            isPWA: this.isPWAInstalled()
        };
    }
}

// Initialize PWA Manager
const pwaManager = new PWAManager();

// Make it globally available
window.pwaManager = pwaManager;

// Add CSS for PWA elements
const style = document.createElement('style');
style.textContent = `
    .install-btn {
        background: #2563eb;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        margin-left: 10px;
    }

    .install-btn:hover {
        background: #1d4ed8;
    }

    .update-notification {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fbbf24;
        color: #92400e;
        padding: 12px;
        text-align: center;
        z-index: 1000;
        display: none;
    }

    .update-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 600px;
        margin: 0 auto;
    }

    .update-btn {
        background: #92400e;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    }

    .update-btn:hover {
        background: #78350f;
    }

    .offline-indicator {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #6b7280;
        color: white;
        padding: 8px;
        text-align: center;
        font-size: 14px;
        z-index: 1000;
        display: none;
    }

    @media (max-width: 640px) {
        .install-btn {
            font-size: 12px;
            padding: 6px 12px;
        }
        
        .update-content {
            flex-direction: column;
            gap: 8px;
        }
    }
`;
document.head.appendChild(style);







