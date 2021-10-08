(async function() {
    if (!navigator.cookieEnabled) console.error('NO COOKIES!!')
    if (Cookies.get('slUser')) {
        console.info('School Loop User Cookie Found! Sending to Dashboard')
        setTimeout(() => {
            document.location.pathname = '/looped/dashboard/'
        }, 1500)
    } else {
        console.info('We found someone new! Sending to login page')
        setTimeout(() => {
            if (!navigator.cookieEnabled) document.location.pathname = '/looped/login/?noCookies=true'
            document.location.pathname = '/looped/login/'
        }, 1500)
    }
})()