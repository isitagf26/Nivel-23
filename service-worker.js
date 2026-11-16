const CACHE = 'nivel23-v11';
self.addEventListener('install', event => { event.waitUntil(self.skipWaiting()); });
self.addEventListener('activate', event => { event.waitUntil((async () => { for (const key of await caches.keys()) if (key.startsWith('nivel23-') && key !== CACHE) await caches.delete(key); await self.clients.claim(); })()); });
self.addEventListener('fetch', event => {
 const req = event.request; const url = new URL(req.url);
 if (req.method !== 'GET' || url.origin !== self.location.origin) return;
 if (req.mode === 'navigate' || /\.(html|css|js)$/.test(url.pathname)) {
  event.respondWith(fetch(req, {cache:'no-store'}));
 }
});
