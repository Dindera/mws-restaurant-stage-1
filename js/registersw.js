//Check for service worker update
const REPO =  '/restaurant-review-app/';
const _updateReady = (worker) => {
    console.log('New Version Available');
     worker.postMessage({ action: 'skipWaiting' });
  
};



const _trackInstalling = (worker) => {
worker.addEventListener('statechange', () => {
if (worker.state === 'installed') {
     _updateReady(worker);
}
});
};

// register service worker

if ('serviceWorker' in navigator) {

navigator.serviceWorker.register('/sw.js', {scope: REPO}).then(reg => {

if (reg.waiting) {
    _updateReady(reg.waiting);
    return;
}
// Install service worker
if (reg.installing) {
    _trackInstalling(reg.installing);
    return;
}
reg.addEventListener('updatefound', () => {
    _trackInstalling(reg.installing);
});
}).catch(error => {
console.log('fail', error);
});
//Refresh only once
navigator.serviceWorker.addEventListener('controllerchange', () => {
window.location.reload();
});
}
