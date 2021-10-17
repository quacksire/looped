function logout(r = null) {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);



    if (Cookies.get('slUser')) {
        if (Cookies.get('sl') != 'offline') Cookies.remove('slUser')
        console.log('Logged Out!')
    } else {

        console.error('User not detected')

    }

    setTimeout(() => {
        if (urlParams.has('page') && r) {
            document.location.href = document.location.origin + `/looped/login/?out=true&r=${encodeURI(String(r))}&p=${urlParams.get('page')}`
        } else if (r) {
            document.location.href = document.location.origin + `/looped/login/?out=true&r=${encodeURI(String(r))}`
        } else if (urlParams.has('page')) {
            document.location.href = document.location.origin + `/looped/login/?out=true&p=${urlParams.get('page')}`
        } else {
            document.location.href = document.location.origin + `/looped/login/?out=true`
        }




    }, 500)

}

document.getElementById('logout').addEventListener('click', () => {

    logout()

})

feather.replace({ 'aria-hidden': 'true' })

function offline() {
    console.error('----------------------- OFFLINE MODE ENABLED -----------------------', '\nNo or an invalid response from School Loop', '\nAssumed Offline', '\n-----------------------------------------------------------')
}