let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
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

  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcsetForIndex(restaurant);
  image.sizes = "300px";
  image.alt = `photograph of ${restaurant.name} restaurant`;
  // li.append(image);

  
  
  const headName = document.createElement('div');
  headName.classList.add('head_name');
  // divInfo.append(headName);
  li.append(headName);
  headName.append(image);


  const divInfo = document.createElement('div');
  divInfo.className = 'restaurant-info';
  li.tabIndex = "0";
  li.append(divInfo);
  
  const name = document.createElement('h2');
  // name.className = 'restaurant-name';
  name.innerHTML = restaurant.name;
  divInfo.append(name);

  const fav_div = document.createElement('div');
  fav_div.classList.add('fav_list');
  headName.append(fav_div);

  const favorite = document.createElement('input');
  favorite.className = "is_favorite";
  favorite.setAttribute('role', 'checkbox');
  // favorite.setAttribute('aria-labelledby', 'Restaurant Favorite');
  favorite.type = "checkbox";
  favorite.name = "favorite";
  const label = document.createElement('label');
  // label.setAttribute('for', 'is_favorite');
  label.className = "checkbox-label";

  if(restaurant.is_favorite == 'true' ){
    console.log(restaurant.is_favorite)
    favorite.checked = true;
    favorite.setAttribute('aria-checked', 'true');
    favorite.innerHTML = `Remove ${restaurant.name} as a favorite`;
    favorite.title = `Remove ${restaurant.name} as a favorite`;
  } else{
    console.log(restaurant.is_favorite)
    favorite.checked = false;
    favorite.setAttribute('aria-checked', 'false');
    favorite.innerHTML = `Add ${restaurant.name} as a favorite`;
    favorite.title = `Add ${restaurant.name} as a favorite`;
  }
  console.log('Checked : ', favorite.checked);


  favorite.addEventListener('click', () => {
    console.log('Checked Click : ', favorite.checked);
    
    if( favorite.checked){
      favorite.setAttribute('aria-checked', 'true');
      favorite.innerHTML = `Remove ${restaurant.name} as a favorite`;
      favorite.title = `Remove ${restaurant.name} as a favorite`; 

     return DBHelper.saveFavorite(restaurant.id, 'true');  
    }
    else {
      favorite.setAttribute('aria-checked', 'false');
      favorite.innerHTML = `Add ${restaurant.name} as a favorite`;
      favorite.title = `Add ${restaurant.name} as a favorite`; 

     return DBHelper.saveFavorite(restaurant.id, 'false');
    }
   });
  fav_div.append(favorite);
  fav_div.append(label);
  headName.append(fav_div);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  divInfo.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  divInfo.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  divInfo.append(more)

  return li
}


/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

} 
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */

