const QueryString = window.location.search;
const urlParams = new URLSearchParams(QueryString);



function validate(e) {
    e.preventDefault();

    const username = document.getElementById("floatingUsername");
    const password = document.getElementById("floatingPassword");
    console.log(`${username} : ${password}`)


    return valid;
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function login() {


    //Debug ENV
    if (document.location.port) document.location.href = document.location.origin + "/dashboard/index.html"
    if (urlParams.has('p')) {
        document.location.href = document.location.origin + `/looped/dashboard/?page=${urlParams.get('p')}`
    } else {
        document.location.href = document.location.origin + "/looped/dashboard/"
    }


}

function error() {

    document.location.href = document.location.origin + `/looped/login/?failed=true`



}

function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    var loginAlert = document.getElementById('loginAlert')
    loginAlert.append(wrapper)
}

function incorrectRole(role) {

    document.getElementById('badRole').innerHTML = String(role)

    var myModal = new bootstrap.Modal(document.getElementById('roleError'), {})
    myModal.toggle()

}


//document.getElementById("submit").addEventListener("click", validate);

//chrome.storage.local.clear()

let welcome = `
 __          __  _                          _ \n
 \ \        / / | |                        | |\n
  \ \  /\  / /__| | ___ ___  _ __ ___   ___| |\n
   \ \/  \/ / _ \ |/ __/ _ \| '_ \` _ \ / _ \ |\n
    \  /\  /  __/ | (_| (_) | | | | | |  __/_|\n
     \/  \/ \___|_|\___\___/|_| |_| |_|\___(_)\n
`


//Cookie checker
/*
try {
    if (browser.storage.local.get("user")) login()
} catch {
    try {
        if (chrome.storage.local.get("user")) login()
    } catch {
        try {
            if (getCookie('user')) login()
        } catch {
            console.warn('No User Detected')
        }
    }
}
*/
async function checkUser(user, pass) {
    console.log(`Trying to login with key: ${btoa(`${encodeURI(user)}:${encodeURI(pass)}`)}`)
            let response = await fetch(`https://hmbhs.schoolloop.com/mapi/login?version=3&devToken=${encodeURI('Looped')}&devOS=${encodeURI(navigator.userAgent)}&year=${new Date().getFullYear()}`, {
                headers: {
                    authorization: `Basic ${btoa(`${encodeURI(user)}:${encodeURI(pass)}`)}`
                }
            })
            console.log(response)
             //document.getElementById('runas').innerHTML = response
    
    
    
        try {
            console.log(response)
            if (response.statusText == 'OK' || response.statusText == '') {
                response = await response.json()
                //response.role = 'admin'
                document.getElementById('runas').innerHTML = response
                if (response.role == 'student') {
                    response.auth = `Basic ${btoa(`${encodeURI(user)}:${encodeURI(pass)}`)}` //Save Auth header for future use
                    //response.role = 'admin'
                    
                    setCookie('slUser', encodeURI(JSON.stringify(response)), 7)
                    alert(`<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Please Wait, Signing you in</span></div> Signing you in...`, 'success')
                    setTimeout(() => {

                        login()
                    
                    }, 1000)//2500
                    
                    
                    
                    
                    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                } else {
                    incorrectRole(response.role)
                    return
                }
            } else {
                alert('Something Went Wrong! Check Username and Password', 'danger')
                return
            }
        } catch(e) {
            alert(`Error ${e}`, 'danger')
            return
        }
        
        
    
             
        //login()


}




// vvv OLD vvv
async function main() {
    
    if (urlParams.get('r') === 'null' && String(window.location.href).includes('?')) {
        console.log('Logged Out')
        document.getElementById('error').outerHTML = `<div class="toast position-absoulute bottom-0 end-0 text-white bg-primary border-0 position-absolute" role="alert" aria-live="assertive" aria-atomic="true" id='loggedOutToast'>
            <div class="d-flex">
                <div class="toast-body">
                    You have been logged out.
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>`
            //loggedOutToast
    } else {

        console.log('[LEGACY] No URI Params')

    }
}

document.getElementById('runas').innerHTML = `Web`

if (urlParams.has('r')) incorrectRole(urlParams.get('r'))
main()

if (/\bCrOS\b/.test(navigator.userAgent)) alert('ChromeOS support is not great, things might break', 'warning')


$(document).ready(function() {
    $('.toast').toast('show');
    setTimeout(() => {
        $('.toast').toast('hide');
    }, 2500)
});
$('#login').bind('submit', function(e) {
    e.preventDefault();
    console.log('Welcome!');
    console.info('hi')
    checkUser($('#floatingUsername').val(), $('#floatingPassword').val());
});
/*
$('#login').bind('click', function(e) {
    e.preventDefault();
    console.log('Welcome!');
    document.getElementById('runas').innerHTML = `Hi`
    checkUser($('#floatingUsername').val(), $('#floatingPassword').val());
});
*/