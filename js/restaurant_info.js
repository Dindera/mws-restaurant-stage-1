let restaurant;
var newMap;
/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiZGluZGVyYSIsImEiOiJjamtsazl5NWIxd2E3M3Btemp4Njh6eGtrIn0.azq835pUPzRoLuJUX-7b1A',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

fetchReviewsFromURL = (callback) => {
  if (self.review) { // restaurant already fetched!
    callback(null, self.review)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchReviewById(id, (error, review) => {
      self.restaurant = review;
      if (!review) {
        console.error(error);
        return;
      }
      fillReviewsHTML();
      callback(null, review);
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const favorite = document.getElementById('is_favorite');
  // favorite.setAttribute('role', 'checkbox');
 
  if(restaurant.is_favorite == 'true' ){
    console.log(restaurant.is_favorite)
    favorite.checked = true;
    favorite.setAttribute('aria-pressed', 'true');
    favorite.innerHTML = `Remove ${restaurant.name} as a favorite`;
    favorite.title = `Remove ${restaurant.name} as a favorite`;
  } else{
    console.log(restaurant.is_favorite)
    favorite.checked = false;
    favorite.setAttribute('aria-pressed', 'false');
    favorite.innerHTML = `Add ${restaurant.name} as a favorite`;
    favorite.title = `Add ${restaurant.name} as a favorite`;
  }
  console.log('Checked : ', favorite.checked);


  favorite.addEventListener('click', () => {
    console.log('Checked Click : ', favorite.checked);
    if( favorite.checked){
      favorite.setAttribute('aria-pressed', 'true');
      favorite.innerHTML = `Remove ${restaurant.name} as a favorite`;
      favorite.title = `Remove ${restaurant.name} as a favorite`; 
     return DBHelper.saveFavorite(restaurant.id, 'true');  
    }
    else {
      favorite.setAttribute('aria-pressed', 'false');
      favorite.innerHTML = `Add ${restaurant.name} as a favorite`;
      favorite.title = `Add ${restaurant.name} as a favorite`;     
     return DBHelper.saveFavorite(restaurant.id, 'false');
    }


});


  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcsetForRestaurant(restaurant);
  image.sizes = "(max-width: 350px) 300px, (max-width: 650px) 600px, (min-width: 651px) 800px";
  image.alt = " ";
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  DBHelper.fetchReviews(restaurant.id, fillReviewsHTML);
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (error, reviews) => {
  self.restaurant.reviews = reviews;

  if (error) {
    console.log('No reviews', error);
  }
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    // review = DBHelper.fetchReviewById(id, (error, reviews));
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  
  const name = document.createElement('h3');
  name.innerHTML = review.name;
  name.className = 'review-name';
  li.appendChild(name);

  const rating = document.createElement('p');
  rating.classList.add('rating');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.dataset.rating = review.rating;
  li.appendChild(rating);

  const div = document.createElement('div');
  div.append(name);
  div.append(rating);
  div.className = 'review-info';
  li.appendChild(div);

  const createdAt = document.createElement('p');
  createdAt.classList.add('createdAt');
  const createdDate = new Date(review.createdAt).toLocaleDateString();
  createdAt.innerHTML = `Added:- <strong>${createdDate}</strong>`;
  li.appendChild(createdAt);

  const updatedAt = document.createElement('p');
  const updatedDate = new Date(review.updatedAt).toLocaleDateString();
  updatedAt.innerHTML = `Updated:- <strong>${updatedDate}</strong>`;
  updatedAt.classList.add('updatedAt');
  li.appendChild(updatedAt);

  const date = document.createElement('div');
  date.append(createdAt);
  date.append(updatedAt);
  date.className = 'review-date';
  li.appendChild(date);

  const comments = document.createElement('p');
  comments.classList.add('comments');
  comments.innerHTML = review.comments;
  li.appendChild(comments);
  return li;


}

const form = document.querySelector('form');
form.addEventListener('submit', e  => {
  e.preventDefault();
const url = 'http://localhost:1337/reviews';
const method = 'post';
let formdata = new FormData(form);
 let newReview = {
   "id": formdata.get('id'),
   "restaurant_id": self.restaurant.id,
   "name": formdata.get('reviewName'),
   "rating": formdata.get('reviewRate'),
   "comments": formdata.get('comments'),
   "createdAt": new Date()
 }
 fetch(url, {
   method: method,
   headers: { "Content-type": "application/json; charset=UTF-8" }, 
   body: JSON.stringify(newReview)
 }).then((res)=> {
   const data = res.json();
   fillReviewsHTML();
   location.reload();
   console.log('Received Data', data);
   return data;
 }).catch(err => {
   dbPromise.then(db => {
    const tx = db.transaction('review-store', 'readwrite');
    const reviewStore = tx.objectStore('review-store');
      reviewStore.put(newReview);
      fillReviewsHTML();
      location.reload();
      console.log('Posting Offline', err);
      return tx.complete;
   })
 })
});
/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}
/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
