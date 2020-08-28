importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log(`Workbox berhasil dimuat`);

} else {
    console.log(`Workbox gagal dimuat`);
}

workbox.precaching.precacheAndRoute([
    {url: '/', revision: '1'},
    {url: '/nav.html', revision: '1'},
    {url: '/index.html', revision: '1'},
    {url: '/pages/home.html', revision: '1'},
    {url: '/pages/jadwal.html', revision: '1'},
    {url: '/pages/klasemen.html', revision: '1'},
    {url: '/pages/favorit.html', revision: '1'},
    {url: '/pages/tanding.html', revision: '1'},
    {url: '/pages/tim.html', revision: '1'},
    {url: '/css/materialize.min.css', revision: '1'},
    {url: '/css/style.css', revision: '1'},
    {url: '/js/materialize.min.js', revision: '1'},
    {url: '/manifest.json', revision: '1'},
    {url: '/js/nav.js', revision: '1'},
    {url: '/js/api.js', revision: '1'},
    {url: '/js/script.js', revision: '1'},
    {url: '/js/pertandingan_terakhir.js', revision: '1'},
    {url: '/js/pertandingan_mendatang.js', revision: '1'},
    {url: '/js/jadwal.js', revision: '1'},
    {url: '/js/db.js', revision: '1'},
    {url: '/js/idb.js', revision: '1'},
    {url: '/js/main.js', revision: '1'},
    {url: '/js/time.js', revision: '1'},
    {url: '/dist/bundle.js', revision: '1'},
    {url: '/dist/index.html', revision: '1'},
    {url: '/img/logo.png', revision: '1'},
    {url: '/img/favicon.ico', revision: '1'},
    {url: '/img/192x192.png', revision: '1'},
    {url: '/img/192x192c.png', revision: '1'},
    {url: '/img/512x512.png', revision: '1'},
    {url: '/img/profile.png', revision: '1'},
    {url: '/img/goal.svg', revision: '1'},
    {url: '/img/fans.svg', revision: '1'},
    {url: '/img/game_day.svg', revision: '1'},
    {url: '/img/loading.gif', revision: '1'},
    {url: '/img/9.jpg', revision: '1'},
    {url: '/img/7.jpg', revision: '1'},
    {url: '/img/player.png', revision: '1'},
    {url: '/img/soccer-2.png', revision: '1'},
    {url: '/img/soccer.png', revision: '1'},
    {url: '/img/indigo.png', revision: '1'},
    {url: '/img/null.png', revision: '1'},
    {url: '/img/404.svg', revision: '1'},
    {url: '/img/warning.svg', revision: '1'},
    {url: '/node_modules/jquery/dist/jquery.min.js', revision: '1'},
    {url: '/node_modules/moment/moment.js', revision: '1'},
    {url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: '1'},
    {url: 'https://unpkg.com/sweetalert/dist/sweetalert.min.js', revision: '1'},
    {url: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap', revision: '1'},
    {url: 'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2', revision: '1'}
],
{
    ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
)

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp('.*\.js'),
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('/css/materialize.min.css'),
    workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
    new RegExp('.*\.png'),
    workbox.strategies.cacheFirst()
);

self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'img/192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});