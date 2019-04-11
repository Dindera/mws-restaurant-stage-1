self.importScripts('/js/idb.js');
self.importScripts('/js/dbhelper.js');


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
                REPO+'/',
                REPO+'index.html',
                REPO+"css/styles.css",
                REPO+"css/media-queries.css",
                REPO+'js/dbhelper.js', 
                REPO+'js/main.js',
                REPO+'js/idb.js',
                REPO+'js/registersw.js',
                REPO+'js/restaurant_info.js',
                REPO+'manifest.json',
                REPO+'src/offline.jpg',
                REPO+'src/cutlery.svg',
                REPO+'src/Heart-03.svg',
                REPO+'src/Heart-04.svg',
                REPO+'restaurant.html',
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
            event.respondWith(caches.match(REPO + "index.html"));
 
        }
         if(getUrl.pathname.startsWith('/src/')){
                 // Get images from cache if no network
        event.respondWith(servePhotos(event.request));
        // return;
    } else {
        // handle other request from  this site
        event.respondWith(caches.match(event.request)
    );
    }   
       return;
    }
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
});


self.addEventListener('sync', event => {
    const synctag = event.tag;
    // Check if Sync name is present
   if(synctag.startsWith('reviewSync')){
        console.log('sync fired!');
       event.waitUntil(
     dbPromise.then(db => {
         const tx = db.transaction('offline-store', 'readonly');
         const offlineStore = tx.objectStore('offline-store');
        
          return offlineStore.getAll().then(offlineStore => {
          console.log(offlineStore)
            return offlineStore
        }).then((reviews) => {
            // Post data from store to server
            return Promise.all(reviews.map(review  => {
              return fetch('http://localhost:1337/reviews/', {
                  method: 'post',
                  body: JSON.stringify(review),
                  headers: {
                      'Content-Type': 'application/json', 
                      'Accept': 'application/json',
                    }
              }).then(response=> {
                  const res = response.json();
                  console.log('Response of Post', res);
                  return res;
              }).then(data => {
                console.log('Response of Data', data);
                dbPromise.then(db => {
                    const tx = db.transaction('review-store', 'readwrite');
                    const fx = db.transaction('offline-store', 'readwrite');
                    const deleteStore = fx.objectStore('offline-store');
                    const reviewStore = tx.objectStore('review-store');
                    reviewStore.put(data);
                    //delete store
                    const reQ = deleteStore.delete(review.name);

                    reQ.onsuccess = e => {
                        console.log('Successfully deleted');
                    }
                });    
                return data;    
              });         
          })).catch(err => {
            console.log(err);
        })
        })
     })
     )
  }
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

