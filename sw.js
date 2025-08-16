/**
 * Service Worker for My Silent Library
 * Provides offline capability, intelligent caching, and performance improvements
 */

const CACHE_NAME = 'my-silent-library-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately (app shell)
const STATIC_FILES = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/css/style.css',
    '/assets/js/app.js',
    '/assets/js/search.js',
    '/assets/js/modal.js',
    '/assets/js/theme.js',
    '/assets/js/lazy-loader.js',
    '/assets/js/virtual-scroller.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests (except for fonts and images)
    if (url.origin !== location.origin) {
        if (request.destination === 'font' || request.destination === 'image') {
            event.respondWith(
                fetch(request)
                    .then(response => {
                        // Cache external fonts and images
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => cache.put(request, responseClone));
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return fallback for failed external requests
                        return new Response('', { status: 404 });
                    })
            );
        }
        return;
    }

    // Handle different types of requests
    if (request.destination === 'document') {
        // HTML files - network first, then cache
        event.respondWith(handleDocumentRequest(request));
    } else if (request.destination === 'style' || request.destination === 'script') {
        // CSS and JS files - cache first, then network
        event.respondWith(handleStaticRequest(request));
    } else if (request.destination === 'image') {
        // Images - cache first, then network
        event.respondWith(handleImageRequest(request));
    } else {
        // Other requests - network first, then cache
        event.respondWith(handleOtherRequest(request));
    }
});

// Handle HTML document requests (network first)
async function handleDocumentRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
        }
        
        return networkResponse;
    } catch (error) {
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page if no cache available
        return caches.match('/index.html');
    }
}

// Handle static asset requests (cache first)
async function handleStaticRequest(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        // Update cache in background
        fetch(request)
            .then(response => {
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(STATIC_CACHE)
                        .then(cache => cache.put(request, responseClone));
                }
            })
            .catch(() => {
                // Ignore fetch errors for background updates
            });
        
        return cachedResponse;
    }
    
    // Fallback to network
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE)
                .then(cache => cache.put(request, responseClone));
        }
        return networkResponse;
    } catch (error) {
        return new Response('', { status: 404 });
    }
}

// Handle image requests (cache first)
async function handleImageRequest(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Fallback to network
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
        }
        return networkResponse;
    } catch (error) {
        return new Response('', { status: 404 });
    }
}

// Handle other requests (network first)
async function handleOtherRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
        }
        
        return networkResponse;
    } catch (error) {
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('', { status: 404 });
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Handle background sync
async function doBackgroundSync() {
    try {
        // Get all clients
        const clients = await self.clients.matchAll();
        
        // Notify clients that sync is complete
        clients.forEach(client => {
            client.postMessage({
                type: 'background-sync-complete',
                timestamp: Date.now()
            });
        });
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Handle push notifications (if implemented later)
self.addEventListener('push', event => {
    console.log('Push notification received:', event);
    
    const options = {
        body: 'New content available in your library',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/assets/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('My Silent Library', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle message events from main thread
self.addEventListener('message', event => {
    console.log('Message received in service worker:', event.data);
    
    if (event.data && event.data.type === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'getCacheInfo') {
        // Return cache information
        caches.keys().then(cacheNames => {
            event.ports[0].postMessage({
                type: 'cacheInfo',
                cacheNames: cacheNames
            });
        });
    }
});

// Clean up old caches periodically
setInterval(async () => {
    try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            name !== STATIC_CACHE && name !== DYNAMIC_CACHE
        );
        
        for (const cacheName of oldCaches) {
            await caches.delete(cacheName);
            console.log('Cleaned up old cache:', cacheName);
        }
    } catch (error) {
        console.error('Cache cleanup failed:', error);
    }
}, 24 * 60 * 60 * 1000); // Run every 24 hours
