/* eslint-env worker */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

if (self.workbox) {
  self.workbox.routing.registerRoute(
    'https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js',
    new self.workbox.strategies.CacheFirst()
  )
  self.workbox.routing.registerRoute(
    'https://www.gstatic.com/firebasejs/7.6.1/firebase-database.js',
    new self.workbox.strategies.CacheFirst()
  )
  self.workbox.routing.registerRoute(
    'https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css',
    new self.workbox.strategies.CacheFirst()
  )
  self.workbox.routing.registerRoute(
    new RegExp('https://picsum.photos/'),
    new self.workbox.strategies.StaleWhileRevalidate()
  )
  self.workbox.routing.registerRoute(
    /\.js$/,
    new self.workbox.strategies.StaleWhileRevalidate()
  )
  self.workbox.routing.registerRoute(
    // Cache image files.
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available.
    new self.workbox.strategies.CacheFirst({
      // Use a custom cache name.
      cacheName: 'image-cache',
      plugins: [
        new self.workbox.expiration.Plugin({
          // Cache only 20 images.
          maxEntries: 20,
          // Cache for a maximum of a week.
          maxAgeSeconds: 7 * 24 * 60 * 60
        })
      ]
    })
  )
} else {
  console.log('Boo! Workbox didn\'t load 😬')
}
