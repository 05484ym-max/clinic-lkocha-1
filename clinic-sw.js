// ✏️ Service Worker לאתר הקליניקה - network-first: תמיד מנסה קודם להביא את הגרסה
// העדכנית מהאינטרנט, ומשתמש בעותק השמור רק אם אין בכלל אינטרנט.
// (זו הגרסה הנכונה מההתחלה - למדנו מהבאג שהיה ביומן שגרסת cache-first תוקעת עדכונים)

const CACHE_NAME = 'clinic-site-v1'; // ✏️ אם משנים משהו משמעותי באתר, אפשר להעלות את המספר ב-1
const FILES_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './clinic-manifest.json',
  './clinic-icon-192.png',
  './clinic-icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
