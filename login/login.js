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

function login(p = null) {

    if (p) document.location.href = document.location.origin + `/schoolloop/redesign/dashboard/dashboard.html?user=${p}`
    document.location.href = document.location.origin + "/schoolloop/redesign/dashboard/dashboard.html"


}

function error() {

    document.location.href = document.location.origin + `/schoolloop/redesign/login/login.html?failed=true`



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
const QueryString = window.location.search;
const urlParams = new URLSearchParams(QueryString);
//chrome.storage.local.clear()

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
            let response = await fetch(`https://hmbhs.schoolloop.com/mapi/login?version=3&devToken=${encodeURI(chrome.runtime.id)}&devOS=${encodeURI(chrome.runtime.getManifest().version)}&year=${new Date().getFullYear()}`, {
                headers: {
                    authorization: `Basic ${btoa(`${encodeURI(user)}:${encodeURI(pass)}`)}`
                }
            })
            console.log(response)

    
    
    
        try {
            console.log(response)
            if (response.statusText == 'OK' || response.statusText == '') {
                response = await response.json()
                //response.role = 'admin'
                if (response.role == 'student') {
                    response.auth = `Basic ${btoa(`${encodeURI(user)}:${encodeURI(pass)}`)}` //SAve Auth header for future use
                    await chrome.storage.local.set({ response }, function () {
                        console.log("Data was saved.");
                        login()
                    });
                    
                    
                    
                    
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


async function main() {
    try {
        await chrome.storage.local.get((user) => {
            try {
                user = user.user || user.response
                if (Object.entries(user).length != 0) {
                
                    alert(`<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Please Wait, Signing you in</span></div> Signing you in...`, 'success')
                    setTimeout(() => {
                    
                        login()
                    
                    }, 50)//2500
                }
            } catch (error) {
                return
            }
            console.log(user)
        })
    } catch (error) {
        console.log('No User Found!')
    }
    
    if (urlParams.get('failed')) {
        var loginAlert = document.getElementById('loginAlert')
        
    } else if (urlParams.get('user') === '' && urlParams.get('pass') != '' || urlParams.get('pass') === '' && urlParams.get('user') != '') {
        //error()
    } else if (urlParams.get('r') != "null") {
        try {
            JSON.parse(decodeURI(urlParams.get('r'))).role
            console.log('Wrong Role')
            document.getElementById('error').innerHTML = `
            
        `
            
        } catch {

            console.log('No URI Params')

        }



    } else if (urlParams.get('r') === 'null' && String(window.location.href).includes('?')) {
        console.log('Logged Out')
        document.getElementById('error').outerHTML = `<div class="toast position-absoulute bottom-0 end-0 text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true" id='loggedOutToast'>
            <div class="d-flex">
                <div class="toast-body">
                    You have been logged out.
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>`
            //loggedOutToast
    } else {

        console.log('No URI Params')

    }
}

document.getElementById('runas').innerHTML = `${chrome.runtime.id}`
main()




$(document).ready(function() {
    $('.toast').toast('show');
    setTimeout(() => {
        $('.toast').toast('hide');
    }, 2500)
});

$('#login').bind('submit', function(e) {
            e.preventDefault();
            console.log('jquery booom!');
            checkUser($('#floatingUsername').val(), $('#floatingPassword').val());
});