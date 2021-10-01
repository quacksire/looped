function logout(r = null) {    
    try {
        
        chrome.storage.local.clear(() => {
            console.log('Logged Out!')
            document.location.href = document.location.origin + `/schoolloop/redesign/login/login.html?out=true&r=${encodeURI(JSON.stringify(r))}`
        })
        
    } catch {
        
        setTimeout(() => {
            document.location.href = document.location.origin + `hmbhs-web-extension/schoolloop/redesign/login/login.html?out=true&r=${encodeURI(JSON.stringify(r))}`
        }, 3000)
        
    }
}

document.getElementById('logout').addEventListener('click', () => {

    logout()

})

feather.replace({ 'aria-hidden': 'true' })
