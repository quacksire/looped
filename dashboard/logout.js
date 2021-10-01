function logout(r = null) {    
    try {
        
        chrome.storage.local.clear(() => {
            console.log('Logged Out!')
            document.location.href = document.location.origin + `/looped/login/?out=true&r=${encodeURI(JSON.stringify(r))}`
        })
        
    } catch {
        
        setTimeout(() => {
            document.location.href = document.location.origin + `/looped/login/?out=true&r=${encodeURI(JSON.stringify(r))}`
        }, 3000)
        
    }
}

document.getElementById('logout').addEventListener('click', () => {

    logout()

})

feather.replace({ 'aria-hidden': 'true' })
