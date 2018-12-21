// export default DBHelper


(function () {
  'use strict'

  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }
});

const dbPromise = idb.open('restaurant-db', 4, function (upgradeDB) {

  switch (upgradeDB.oldVersion) {
    case 0:
     let restaurantStore =  upgradeDB.createObjectStore('restaurant-store', { keyPath: 'id' });
     restaurantStore.createIndex('restaurantIndex', 'is_favorite');
     case 1:
      let reviewStore = upgradeDB.createObjectStore('review-store', { keyPath: 'id' });
      reviewStore.createIndex('reviewIndex', 'restaurant_id');
      upgradeDB.createObjectStore('favorite-store', { keyPath: 'is_favorite' });
      case 2: 
      let offlineStore = upgradeDB.createObjectStore('offline-store', {keyPath: 'name', autoIncrement: true});
        offlineStore.createIndex('offlineIndex', 'restaurant_id');
  }

});

/**
 * Common database helper functions.
 */
class DBHelper {
  /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port

    return `http://localhost:${port}`;

    // return `https://dindera.github.io/${port}/data/restaurants.json`;
  }


  /**
   * Fetch all restaurants.
   */

  static fetchRestaurants(callback) {
    function getDbData() {
      return dbPromise.then(db => {
        const tx = db.transaction('restaurant-store')
          .objectStore('restaurant-store');
        return tx.getAll();
      });
    }

    function fulfillResult() {
      getDbData().then(restaurants => {
        return callback(null, restaurants);
      });
    }

// fetch Restaurant
    fetch(`${DBHelper.DATABASE_URL}/restaurants/`)
      .then(function (response) {
        const restaurants = response.json();
        return restaurants;
      }).then(restaurants => {
        dbPromise.then(db => {
          const tx = db.transaction('restaurant-store', 'readwrite');
          const restaurantStore = tx.objectStore('restaurant-store');
          for (const restaurant of restaurants) {
            restaurantStore.put(restaurant);
          }
          return tx.complete;
        })
        return restaurants;
      }).then(function (restaurants) {
        return callback(null, restaurants);
      }).catch(() => {
        return fulfillResult();
      });
  }

  static fetchReviews(id, callback) {

    function countCursor()  {
      dbPromise.then(db=> {
        let tx = db.transaction('review-store', 'readwrite');
        let store = tx.objectStore('review-store');
         store.index('reviewIndex').openCursor().then(cursor=> {
           return cursor.advance(15);
         }).then(function deleteRest(cursor){
           if(!cursor) return;
           cursor.delete();
           cursor.continue().then(deleteRest);
         });
      })
    }

    function getOfllineStore(){
      return dbPromise.then(db => {
        const tx = db.transaction('offline-store')
        const offlineStore = tx.objectStore('offline-store');
        const index = offlineStore.index('offlineIndex');
        return index.getAll().then(offReviews => {
          console.log(null, offReviews);
           callback(null, offReviews);
        })
      })
    }
    // display the reviews when offline
    function getDbReview() {
      return dbPromise.then(db => {
        const tx = db.transaction('review-store')
        const reviewStore = tx.objectStore('review-store');
        const index = reviewStore.index('reviewIndex');
        // get restaurant_id of a specific number
        return index.getAll(IDBKeyRange.only(+id)).then(reviews => {
            console.log(null, reviews)
           callback(null, reviews);
          }); 
      });
    }


    fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=${+id}`)
      .then(function (response) {
        const reviews = response.json();
        return reviews;
      }).then(reviews => {
        dbPromise.then(db => {
          //save reviews in db
          const tx = db.transaction('review-store', 'readwrite');
          const reviewStore = tx.objectStore('review-store');
          for (const review of reviews) {
            reviewStore.put(review);
          }
          return tx.complete;
        });
        return reviews;
      }).then(function (reviews) {
        countCursor()
        return callback(null, reviews);
      }).catch(() => {
        return getDbReview() && getOfllineStore();
      });
  }


  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
 * Fetch a review by its ID.
 */
  static fetchReviewById(id, cb) {
    // fetch all reviews with proper error handling.
    DBHelper.fetchReviews((error, reviews) => {
      if (error) {
        cb(error, null);
      } else {
        const review = reviews.find(r => r.id == id);
        if (review) { // Got the review
          cb(null, review);
        } else { // Restaurant does not exist in the database
          cb('Review does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }


  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
    // const url = 'https://dindera.github.io/restaurant-review-app/';
    // return (`/restaurants/${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/src/img/${restaurant.id}-300_small.jpg`);
  }

  /**
  *  Image Srcset for Index page.
  */
  static imageSrcsetForIndex(restaurant) {
    return (`src/images/${restaurant.id}-300_small.jpg 1x, src/images/${restaurant.id}-600_medium_2x.jpg 2x`);
  }

  /**
  *  Image Srcset for Restaurant page.
  */
  static imageSrcsetForRestaurant(restaurant) {
    return (`src/images/${restaurant.id}-300_small.jpg 300w, src/images/${restaurant.id}-600_medium_2x.jpg 600w, src/images/${restaurant.id}-800_large_2x.jpg 800w`);
  }

  /**
  * Get Favorite restaurants
  * /*
* Mark favorite restaurant and add to favorite database and restaurant database
* Get the favorites when offline from restaurnt databse 
* put favorite when offline to database
* send favorites to server from database when connected to network

*/

  static saveFavorite(id, isfavorite,) {

  const url = `${DBHelper.DATABASE_URL}/restaurants/${id}/?is_favorite=${isfavorite}`
     
    //DBHelper.addPendingOffline(url, method)
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      if(error) return;
      restaurant.is_favorite = isfavorite;
      console.log(isfavorite);
      dbPromise.then(db => {
        const tx = db.transaction('restaurant-store', 'readwrite');
        const restaurantStore = tx.objectStore('restaurant-store');
        console.log(url);
        
        restaurantStore.put(restaurant).then(id => {
          console.log(tx);
          console.log(isfavorite);
          console.log(url);
          console.log(restaurant.is_favorite);
          fetch(url, {
            method: 'PUT'
          })
        });
        return tx.complete && restaurant;
      }).catch((callback)=> {
      
        DBHelper.fetchRestaurants(callback => {
       return dbPromise.then(db => {
            const tx = db.transaction('restaurant-store', 'readwrite');
       
            const restaurantStore = tx.objectStore('restaurant-store');
            const index = restaurantStore.index('restaurantIndex', 'readwrite');
            const favs =  index.getAll('is_favorite');
           
            console.log(null, favs); 
           return callback(null, favs);
         });
        }); 
      console.log(restaurant.is_favorite);
      return restaurant.is_favorite;
    })
  }
 
)}

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
    marker.addTo(newMap);
    return marker;
  }

  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}

