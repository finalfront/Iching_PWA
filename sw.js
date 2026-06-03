const CACHE_NAME = 'iching-v1';
const ASSETS = [
	    '/',
	        '/index.html',
	            '/app.js',
	                '/data.js',
	                    '/manifest.json',
	                        '/icon.svg',
	                            '/sw.js'
	                            ];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(() => {
                // Fail silently if some assets don't exist yet
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Return a fallback for offline
                return new Response('Offline - data not cached', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            });
        })
    );
});
