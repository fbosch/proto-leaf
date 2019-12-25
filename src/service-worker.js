/* eslint-env worker */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

if (self.workbox) {
  self.workbox.setConfig({ debug: false }) // prevent excessive logs on localhost
  self.workbox.precaching.precacheAndRoute([]) // precached assets will be injected by parcel

  self.workbox.routing.registerNavigationRoute('/index.html')
  // eslint-disable-next-line
  console.log('⚙️ Service Worker loaded')
  self.workbox.routing.registerRoute(
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
    new self.workbox.strategies.CacheFirst()
  )
  self.workbox.routing.registerRoute(
    new RegExp('https://www.gstatic.com/firebasejs/'),
    new self.workbox.strategies.CacheFirst()
  )
  self.workbox.routing.registerRoute(
    'https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css',
    new self.workbox.strategies.CacheFirst()
  )
  self.workbox.routing.registerRoute(
    new RegExp('https://picsum.photos/'),
    new self.workbox.strategies.NetworkFirst()
  )
  self.workbox.routing.registerRoute(
    new RegExp('https://i.ytimg.com/vi/'),
    new self.workbox.strategies.StaleWhileRevalidate()
  )
  self.workbox.routing.registerRoute(
    /\.js$/,
    new self.workbox.strategies.NetworkFirst()
  )
  self.workbox.routing.registerRoute(
    // Cache image files.
    /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
    // Use the cache if it's available.
    new self.workbox.strategies.CacheFirst({
      // Use a custom cache name.
      cacheName: 'image-cache'
    })
  )
} else {
  console.log('Service Worker didn\'t load 😬')
}
