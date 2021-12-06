(async function() {
    if (!navigator.cookieEnabled) console.error('NO COOKIES!!')
    if (Cookies.get('slUser')) {
        console.info('School Loop User Cookie Found! Sending to Dashboard')
        setTimeout(() => {            document.location.replace(document.location.origin + `/dashboard/`)
        }, 1500)
    } else {
        console.info('We found someone new! Sending to login page')
        setTimeout(() => {
            document.location.replace(document.location.origin + `/login/`)
        }, 1500)
    }
})()