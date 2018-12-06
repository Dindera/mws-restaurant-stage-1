const CACHENAME = "restaurant_app_v1";
const CACHE_PHOTOS = 'restaurant-app-photos'; 
const REPO = "";
const ALLCACHE = [
    CACHENAME, 
    CACHE_PHOTOS
];


/*
Install caches in storage
*/

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHENAME).then(cache => {
            return cache.addAll([
                '/',
                'index.html',
                "css/styles.css",
                "css/media-queries.css",
                'js/dbhelper.js', 
                'js/main.js',
                'js/idb.js',
                'js/registersw.js',
                'js/restaurant_info.js',
                'manifest.json',
                'sw.js',
                'src/offline.jpg',
                'src/cutlery.svg',
                'restaurant.html',
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

            ]).catch((error)=> {
               console.log(error);
            });
        })
    );
});

/*
// Activate when new cache name is discovered
*/
// 
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheFiles => {
            return Promise.all(
                cacheFiles.filter(cacheFile  => {
                        return  cacheFile.startsWith("restaurant_") && !ALLCACHE.includes(cacheFile);
                    }).map(cacheFile  => {
                        return caches.delete(cacheFile);
                    })
                );
           })
       );
    });

/*
// Fetch images and Index.html using fetch event
*/
self.addEventListener("fetch", event => {
   const getUrl = new URL(event.request.url);

    if (getUrl.origin === location.origin) {
        if (getUrl.pathname === "/" || getUrl.pathname === REPO + "/") {
            event.respondWith(caches.match(REPO + "/index.html"));
        //    return;
        }
         if(getUrl.pathname.startsWith('/src/')){
        event.respondWith(servePhotos(event.request));
        // return;
    } else {// handle other request from  this site
        console.log('OTHRSAAAAA', getUrl.pathname);
        event.respondWith(caches.match(event.request));
    }
        // Get images from cache if no network
      
       return;
    }

        event.respondWith(
            caches.match(event.request).then(response => {
                // if(response){
                //     return response;
                // }else {
                //     return fetch(event.request);
                // }

                return response || fetch(event.request);
            })
        )
});

/*
// Open cache storage for images
*/
function servePhotos(request){
    const storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

    return caches.open(CACHE_PHOTOS).then(cache => {
        return cache.match(storageUrl).then(response => {
            const fetchNetwork = fetch(request).then(networkResponse => {
              cache.put(storageUrl, networkResponse.clone());
              return networkResponse;
            });
            return response || fetchNetwork;
        })
    }).catch(() => { 
        return caches.match('src/offline.jpg');
  });
}


self.addEventListener("message", event => {
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});