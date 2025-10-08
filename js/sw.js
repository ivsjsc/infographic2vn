const CACHE_NAME = 'blog-tudo-cache-v1';
const urlsToCache = [
  '/',
  '/blog.html',
  '/write.html',
  '/css/styles.css', // Assuming you have a shared styles file
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/feather-icons',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      }
    )
  );
});

