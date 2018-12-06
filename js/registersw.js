// // Check for service worker update
// // const REPO =  '/restaurant-review-app/';
 const REPO =  '';
// // let newServiceWorker;

// // document.getElementById('reload').addEventListener('click', function(){
// //     newServiceWorker.postMessage({ action: 'skipWaiting' });
// //   });
const _updateReady = (worker) => {
    //   document.getElementById('reload').addEventListener('click', function(){
    //   newServiceWorker.postMessage({ action: 'skipWaiting' });
    // });
      console.log('New Version Available');
       worker.postMessage({ action: 'skipWaiting' });
    
  };
  
  const _trackInstalling = (worker) => {
  worker.addEventListener('statechange', () => {
  if (worker.state === 'installed') {
      console.log('SW installed');
       _updateReady(worker);
  }
  });
  };
  
// // register service worker

if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('sw.js').then(reg => {
    
    if (reg.waiting) {
        _updateReady(reg.waiting);
        return;
    }
    // Install service worker
    if (reg.installing) {
        console.log('Installing service Worker');
        _trackInstalling(reg.installing);
        return;
    }
    reg.addEventListener('updatefound', () => {
        console.log('UPDATE FOUND');
        _trackInstalling(reg.installing);
    });
    }).catch(error => {
    console.log(' Service Worker registeration failed', error);
    });
    //Refresh only once
    let refresh;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
    if(refresh) return;
    window.location.reload();
    refresh = true;
    });
    }
    
    
 
    
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