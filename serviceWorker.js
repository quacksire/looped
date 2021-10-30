'use strict';

self.addEventListener('install', event => {
    function onInstall() {
        return caches.open('static')
            .then(cache =>
                cache.addAll([
                    './libs/js/bootstrap.bundle.min.js',
                    './libs/js/feather.min.js',
                    './libs/js/js.cookie.min.js',
                    './libs/js/jquery-3.6.0.min.js',
                    './libs/js/Chart.min.js', /////////////
                    './libs/css/bootstrap.min.css',
                    './libs/css/bootstrap-dark.min.css',
                    './libs/css/bootstrap-light.min.css',
                    './libs/css/bootstrap-prefers-dark.min.css',
                    './libs/css/bootstrap-prefers-light.min.css',
                    './libs/css/toggle-bootstrap-dark.min.css',
                    './libs/css/toggle-bootstrap-print.min.css', /////////////
                    './dashboard',
                    './dashboard/class',
                    './dashboard/news',
                    './dashboard/mail', /////////////
                    './dashboard/class.js',
                    './dashboard/news.js',
                    './dashboard/mail.js',
                    './dashboard/fillFeatherTooltip.js',
                    './dashboard/frames.css',
                    './dashboard/sidebars.css',
                ])
            );
    }

    event.waitUntil(onInstall(event));
});

self.addEventListener('activate', event => {

});
self.addEventListener('fetch', function(event) {
    event.respondWith(async function() {
        try {
            var res = await fetch(event.request);
            var cache = await caches.open('cache');
            cache.put(event.request.url, res.clone());
            return res;
        } catch (error) {
            return caches.match(event.request);
        }
    }());
});