// 이레 서비스 워커: 오프라인에서도 열리고, 새 버전은 다음 실행 때 반영돼요
var CACHE = 'eire-v4';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'fonts/LINESeedKR-Rg.woff2', 'fonts/LINESeedKR-Bd.woff2',
  'icons/icon.svg', 'icons/app_icon_192.png', 'icons/app_icon_512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(e.request).then(function (res) { if (res && res.ok) c.put(e.request, res.clone()); return res; }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
