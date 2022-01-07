if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
        scope: '/'
    });
}


//#region global vars
var platform = window['platform-detect']
var online = true
let whatIsSiteBeingRunAs = platform.pwa || platform.uwp ? 'PWA' : 'Web'
    //#endregion

    //Domain Migration
    if (!platform.pwa) {
        if (document.location.host.endsWith('pages.dev') || document.location.host.endsWith('duckling.pw')) document.location.host = 'looped.duckapp.de'
    }


//#region offline handling

function offline() {
    console.log('%c **************************\n OFFLINE\n**************************', 'background: #222; color: #FF0000');
}


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
    //#endregion

//#region mnbile handling
function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        return true
    } else {
        return false
    }
}

function mobileCollapse(p = null) {
    if (isMobile() && p || $(window).width() < 800) {
        return `data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false"`
    } else {
        return ''
    }
}
//#endregion