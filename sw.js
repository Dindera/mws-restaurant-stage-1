const CACHENAME = "restaurant_app_index";
const CACHE_NAME = 'restaurant-app-photos'; 
const REPO =  '/restaurant-review-app/';

/*
Install caches in storage
*/
self.addEventListener("install", event => {
    console.log("Service Worker Installing");
    event.waitUntil(
        caches.open(CACHENAME).then(cache => {
            return cache.addAll([
                REPO,
                '/restaurant-review-app/',
                REPO+"/css/styles.css",
                REPO+"/css/media-queries.css",
                REPO+"/data/restaurants.json",
                REPO+'/js/dbhelper.js', 
                REPO+'/js/main.js',
                REPO+'/js/registersw.js',
                REPO+'/js/restaurant_info.js',
                REPO+'src/offline.jpg',
                REPO+'restaurant.html?id=1', 
                REPO+'restaurant.html?id=2', 
                REPO+'restaurant.html?id=3', 
                REPO+'restaurant.html?id=4', 
                REPO+'restaurant.html?id=5', 
                REPO+'restaurant.html?id=6',
                REPO+'restaurant.html?id=7', 
                REPO+'restaurant.html?id=8', 
                REPO+'restaurant.html?id=9', 
                REPO+'restaurant.html?id=10',
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
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
                REPO+'src/images/1-300_small.jpg',REPO+'src/images/2-300_small.jpg',REPO+'src/images/3-300_small.jpg',REPO+'src/images/4-300_small.jpg',REPO+'src/images/5-300_small.jpg',REPO+'src/images/6-300_small.jpg',REPO+'src/images/7-300_small.jpg',REPO+'src/images/8-300_small.jpg',REPO+'src/images/9-300_small.jpg',REPO+'src/images/10-300_small.jpg',
                REPO+'src/images/1-600_medium_2x.jpg',REPO+'src/images/2-600_medium_2x.jpg',REPO+'src/images/3-600_medium_2x.jpg',REPO+'src/images/4-600_medium_2x.jpg',REPO+'src/images/5-600_medium_2x.jpg',REPO+'src/images/6-600_medium_2x.jpg',REPO+'src/images/7-600_medium_2x.jpg',REPO+'src/images/8-600_medium_2x.jpg',REPO+'src/images/9-600_medium_2x.jpg',REPO+'src/images/10-600_medium_2x.jpg',
                REPO+'src/images/1-800_large_2x.jpg', REPO+'src/images/2-800_large_2x.jpg', REPO+'src/images/3-800_large_2x.jpg', REPO+'src/images/4-800_large_2x.jpg', REPO+'src/images/5-800_large_2x.jpg', REPO+'src/images/6-800_large_2x.jpg', REPO+'src/images/7-800_large_2x.jpg', REPO+'src/images/8-800_large_2x.jpg', REPO+'src/images/9-800_large_2x.jpg', REPO+'src/images/10-800_large_2x.jpg', 
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
                    .filter(CACHENAME  => {
                        return (
                            CACHENAME .startsWith("restaurant_") && !CACHENAME 
                        );
                    })
                    .map(CACHENAME  => {
                        return caches.delete(CACHENAME );
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
                    .filter(CACHE_NAME=> {
                        return (
                            CACHE_NAME.startsWith("restaurant_") && !CACHE_NAME
                        );
                    })
                    .map(CACHE_NAME => {
                        return caches.delete(CACHE_NAME);
                    })
            );
        })
    );
});

self.addEventListener("fetch", event => {
   let getUrl = new URL(event.request.url);

    if (getUrl.origin === location.origin) {
        console.log("fetching url :" + getUrl.pathname);
  
        if (getUrl.pathname === "/restaurant-review-app/" || getUrl.pathname ===  "/index.html") {
            event.respondWith(caches.match("/restaurant-review-app/"));
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
