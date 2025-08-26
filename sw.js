/**
 * Service Worker for My Silent Library
 * Provides offline capability, intelligent caching, and performance improvements
 */

// Versioning helps force an update when you change the constant below before publishing
const VERSION = 'v3';
const CACHE_PREFIX = 'my-silent-library-';
const STATIC_CACHE = `${CACHE_PREFIX}static-${VERSION}`;
const DYNAMIC_CACHE = `${CACHE_PREFIX}dynamic-${VERSION}`;
const OFFLINE_ITEMS_CACHE = `${CACHE_PREFIX}offline-items-${VERSION}`;

// Files to cache immediately (app shell)
const STATIC_FILES = [
    // Core documents
    'index.html', // The new landing page
    'library.html', // The main library app
    'offline.html',

    // CSS
    'assets/css/landing.css', // Landing page styles
    'assets/css/style.css',
    'assets/css/tokens.css',
    'assets/css/tokens-overrides.css',

    // JavaScript modules
    'assets/js/content-data.js',
    'assets/js/app.js',
    'assets/js/search.js',
    'assets/js/modal.js',
    'assets/js/theme.js',
    'assets/js/lazy-loader.js',

    // Images
    'assets/images/book-placeholder.svg'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES).catch(err => {
                    console.warn('Some static files failed to cache during addAll:', err); // continue without failing install
                    return Promise.resolve();
                });
            })
            .then(() => {
                console.log('Static files cached successfully');
                // Don't call skipWaiting automatically so updates can be gated by the user.
                // The client can call postMessage({type: 'skipWaiting'}) when they accept the new version.
                return Promise.resolve();
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
                // Delete any cache that doesn't start with the current prefix/version
                return Promise.all(cacheNames.map(cacheName => {
                    if (![STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_ITEMS_CACHE].includes(cacheName)) {
                        // if it doesn't match current names, remove it
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                    return Promise.resolve(true);
                }));
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

    // Bypass known analytics/telemetry requests so they always hit the network
    // This prevents the SW from accidentally serving cached analytics responses or blocking beacons
    const analyticsPattern = /google-analytics|analytics.js|gtm.js|collect|plausible.io|umami.js|hotjar|mixpanel/i;
    if (analyticsPattern.test(request.url)) {
        event.respondWith(fetch(request).catch(() => new Response('', { status: 204 })));
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
        
        // Return offline fallback if available
        const offline = await caches.match('offline.html');
        return offline || new Response('', { status: 503 });
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

// Handle message events from main thread
self.addEventListener('message', event => {
    console.log('Message received in service worker:', event.data);
    
    if (event.data && event.data.type === 'skipWaiting') {
        self.skipWaiting();
    }
});
