const cache_name = "restaurant_app_index";
const cache_Name = 'restaurant-app-photos'; 


/*
Install caches in storage
*/
self.addEventListener("install", event => {
    console.log("Service Worker Installing");
    event.waitUntil(
        caches.open(cache_name).then(cache => {
            return cache.addAll([
                '/',
                "/index.html",
                "/css/styles.css",
                "/css/media-queries.css",
                "/data/restaurants.json",
                '/js/dbhelper.js', 
                '/js/main.js',
                '/js/registersw.js',
                '/js/restaurant_info.js',
                'src/offline.jpg',
                'restaurant.html?id=1', 
                'restaurant.html?id=2', 
                'restaurant.html?id=3', 
                'restaurant.html?id=4', 
                'restaurant.html?id=5', 
                'restaurant.html?id=6',
                 'restaurant.html?id=7', 
                 'restaurant.html?id=8', 
                 'restaurant.html?id=9', 
                 'restaurant.html?id=10',
                 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
                 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
                 'https://leafletjs.com/reference-1.3.0.html#marker',
                

            ]);
        })
    );
});

self.addEventListener('install', event => {
    console.log('Service worker installing images');
    event.waitUntil(
        caches.open(cache_Name).then(cache => {
            return cache.addAll([
              'src/images/1-300_small.jpg','src/images/2-300_small.jpg','src/images/3-300_small.jpg','src/images/4-300_small.jpg','src/images/5-300_small.jpg','src/images/6-300_small.jpg','src/images/7-300_small.jpg','src/images/8-300_small.jpg','src/images/9-300_small.jpg','src/images/10-300_small.jpg',
              'src/images/1-600_medium_2x.jpg','src/images/2-600_medium_2x.jpg','src/images/3-600_medium_2x.jpg','src/images/4-600_medium_2x.jpg','src/images/5-600_medium_2x.jpg','src/images/6-600_medium_2x.jpg','src/images/7-600_medium_2x.jpg','src/images/8-600_medium_2x.jpg','src/images/9-600_medium_2x.jpg','src/images/10-600_medium_2x.jpg',
              'src/images/1-800_large_2x.jpg', 'src/images/2-800_large_2x.jpg', 'src/images/3-800_large_2x.jpg', 'src/images/4-800_large_2x.jpg', 'src/images/5-800_large_2x.jpg', 'src/images/6-800_large_2x.jpg', 'src/images/7-800_large_2x.jpg', 'src/images/8-800_large_2x.jpg', 'src/images/9-800_large_2x.jpg', 'src/images/10-800_large_2x.jpg', 
            ])
        })
    )
})

// event for activate when new cache_name is discovered
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheFiles => {
            return Promise.all(
                cacheFiles
                    .filter(cache_name => {
                        return (
                            cache_name.startsWith("restaurant_") && !cache_name
                        );
                    })
                    .map(cache_name => {
                        return caches.delete(cache_name);
                    })
            );
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheFiles => {
            return Promise.all(
                cacheFiles
                    .filter(cache_Name => {
                        return (
                            cache_Name.startsWith("restaurant_") && !cache_Name
                        );
                    })
                    .map(cache_Name => {
                        return caches.delete(cache_Name);
                    })
            );
        })
    );
});

self.addEventListener("fetch", event => {
   let getUrl = new URL(event.request.url);

    if (getUrl.origin === location.origin) {
        console.log("fetching url :" + getUrl.pathname);
  
        if (getUrl.pathname === "/" || getUrl.pathname ===  "/index.html") {
            event.respondWith(caches.match("/index.html"));
            if(getUrl.pathname.includes('.jpg')){
                event.respondWith(caches.match("src/offline2.jpg"));
            }
        }
        else {  
            event.respondWith(caches.match(event.request));
        }
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            } else {
                console.log(
                    event.request.url + " not found in cache fetching from network."
                );
                return fetch(event.request);
            }
        })
    );
});

self.addEventListener("message", event => {
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});
