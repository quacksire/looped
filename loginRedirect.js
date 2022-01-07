(async function() {
    if (!navigator.cookieEnabled) // TODO: DO something if cookies are disabled
    if (Cookies.get('slUser')) {
        //School Loop User Cookie Found! Sending to Dashboard
        setTimeout(() => {
            document.location.replace(document.location.origin + `/dashboard/`)
        }, 1500)
    } else {
        //We found someone new! Sending to login page
        setTimeout(() => {
            document.location.replace(document.location.origin + `/login/`)
        }, 1500)
    }
})()