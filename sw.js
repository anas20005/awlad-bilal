/* مكتبة أولاد بلال - Service Worker
   الشبكة أولًا (لتصلك آخر نسخة)، ثم النسخة المحفوظة عند انقطاع الإنترنت.
   غيّر رقم VERSION عند كل تحديث كبير لتنظيف النسخ القديمة. */
const VERSION = 'v1';
const CACHE = 'awlad-bilal-' + VERSION;
const FILES = ['./', './index.html', './style.css', './app.js', './manifest.json',
               './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('awlad-bilal-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
