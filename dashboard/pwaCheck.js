function offline() {
    console.log('%c **************************\n OFFLINE\n**************************', 'background: #222; color: #FF0000');
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js', {
        scope: '/'
    });
}

var online = true
if (!navigator.onLine || Cookies.get('sl') === 'offline') {
    offline()
        /*
        PWA Mode
        */
    online = false //Don't want stuff getting cleared
}

window.addEventListener('offline', () => {
    offline()
    online = false
})

window.addEventListener('online', () => {
    online = true
    location.reload() //Will refresh cache if offline for more than 10 minutes
})