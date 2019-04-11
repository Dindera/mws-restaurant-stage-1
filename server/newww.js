// static addPendingOffline(url, method, body){

//     return dbPromise.then(db => {
//       const tx = db.transaction('offline-store', 'readwrite');
//       const offlineStore = tx.objectStore('offline-store');
//       offlineStore.put({
//         data: {
//           url, method, body
//         }
//       }); 
 
//     }).catch(err => {console.log(err)})
//     .then(DBHelper.checkPending());

// }

// static checkPending() {
//   DBHelper.attemptCommitPending(DBHelper.checkPending);
// }

// static attemptCommitPending(callback){
//  let url;
//  let method;
//  let body;
// dbPromise.then(db => {
//   const tx = db.transaction('offline-store', 'readwrite');
//   const offlineStore = tx.objectStore('offline-store');

//   offlineStore.openCursor().then(cursor => {
//     if(!cursor){
//       return;
//     }
//     const value = cursor.value;
//     url = cursor.value.data.url;
//     method = cursor.value.data.method;
//     body = cursor.value.data.body;

//     if((!url || !method) || (method === "POST" && !body)){
//       cursor.delete().then(callback());
//       return;
//     }
//       const items = {
//         body: JSON.stringify(body),
//         method: method
//       }
//       console.log('Sending post from queue ', items);
//       fetch(url, items)
//       .then(res => {
//         if(!res.ok && !res.redirected){
//           return;
//         }
//       }).then(()=> {
//         dbPromise.then(db => {
//           const tx = db.transaction('offline-store', 'readwrite');
//           tx.objectStore('offline-store');
//           tx.openCursor().then(cursor => {
//             cursor.delete().then(() => {
//               callback();
//             })
//           })
//           console.log('deleted Pending')
//         })
//       }).catch(err => {
//         console.log("Error reading cursor");
//         return;
//       })
 
//   })
// })

// }


//   static addNewReview(restaurantId, reviewObj, callback){
//     //addNewReviewToIDB(restaurantId, reviewObj);
//     const options = {
//         method: 'POST',
//         data: JSON.stringify(reviewObj)
//         // ,headers: {
//         //     "Content-Type": "application/json; charset=utf-8"
//         // }
//     };

//     fetch(`${DBHelper.DATABASE_REVIEW_URL}`, {
//         method: 'POST',
//         body: JSON.stringify(reviewObj)
//     })
//     .then(response => response.json())
//     .then(review => {
//         console.log("Successfully added new review to database", review);
//         callback(null, review);
//     })
//     .catch(error => {
//         console.log('Unable to add new review to database', error);
//         callback(error, null);
//     });
// }


    //  navigator.serviceWorker.ready.then((syncreg) => {
                //    document.getElementsByClassName('is_favorite').addEventListener('click', () => {
//document.querySelectorAll('#is_favorite').addEventListener('click', () => {
              //      window.onload = () => {
                //    return syncreg.sync.register('favoriteSync');
                  
                // }); 
            //   });
    
                        // }


                         // // if ('serviceWorker' in navigator) {
    // //     // Register the service worker
    // //     navigator.serviceWorker.register('/service-worker.js').then(reg => {
    // //       reg.addEventListener('updatefound', () => {
    
    // //         // An updated service worker has appeared in reg.installing!
    // //         newWorker = reg.installing;
    
    // //         newWorker.addEventListener('statechange', () => {
    
    // //           // Has service worker state changed?
    // //           switch (newWorker.state) {
    // //             case 'installed':
    
    // // 	// There is a new service worker available, show the notification
    // //               if (navigator.serviceWorker.controller) {
    // //                 let notification = document.getElementById('notification ');
    // //     notification .className = 'show';
    // //               }
    
    // //               break;
    // //           }
    // //         });
    // //       });
    // //     });
    
    // //   }
    
    // if ('serviceWorker' in navigator) {
    //     window.addEventListener('load', function () {
    //       navigator.serviceWorker.register('sw.js').then(function (registration) {
      
    //         var app = document.querySelector('#app');
    //         if (registration.waiting) {
    //           app.update(registration);
    //           return;
    //         }
      
    //         if (registration.installing) {
    //           registration.installing.addEventListener('statechange', function () {
    //             app.update(registration);
    //           });
    //           return;
    //         }
      
    //         registration.addEventListener('updatefound', function () {
    //           app.update(registration);
    //         });
      
    //         console.info('ServiceWorker registration successful with scope: ', registration.scope);
    //       }, function (err) {
    //         console.info('ServiceWorker registration failed: ', err);
    //       });;
    //     });
    //   }