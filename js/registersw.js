// // Check for service worker update
// // const REPO =  '/restaurant-review-app/';
 const REPO =  '';

const _updateReady = (worker) => {
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

    return reg;
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
    