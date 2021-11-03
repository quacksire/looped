function logout(r = null) {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
    if (Cookies.get('slUser')) {
        if (Cookies.get('sl') != 'offline' || online) Cookies.remove('slUser')
        console.log('Logged Out!')
    } else {
        console.error('User not detected')
    }
    setTimeout(() => {
        if (urlParams.has('page') && r) {
            //if (document.location.href.includes('/looped/') || document.location.href.includes('/looped')) document.location.href = `/looped/login/?out=true&r=${encodeURI(String(r))}&p=${urlParams.get('page')}` //Fixes Cache
            document.location.href = `/login/?out&r=${encodeURI(String(r))}&p=${urlParams.get('page')}`
        } else if (r) {
            //if (document.location.href.includes('/looped/') || document.location.href.includes('/looped')) document.location.href = `/looped/login/?out=true&r=${encodeURI(String(r))}` //Fixes Cache
            document.location.href = `/login/?out&r=${encodeURI(String(r))}`
        } else if (urlParams.has('page')) {
            //if (document.location.href.includes('/looped/') || document.location.href.includes('/looped')) document.location.href = `/looped/login/?out=true&p=${urlParams.get('page')}` //Fixes Cache
            document.location.href = `/login/?out&p=${urlParams.get('page')}`
        } else {
            //if (document.location.href.includes('/looped/') || document.location.href.includes('/looped')) document.location.href = `/looped/login/?out=true` //Fixes Cache
            document.location.href = `/login/?out`
        }
    }, 500)
}

document.getElementById('logout').addEventListener('click', () => {
    logout()
})

feather.replace({ 'aria-hidden': 'true' })

//function offline() {
//    console.error('----------------------- OFFLINE MODE ENABLED -----------------------', '\nNo or an invalid response from School Loop', '\nAssumed Offline', '\n-----------------------------------------------------------')
//}