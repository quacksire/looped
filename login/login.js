const QueryString = window.location.search;
const urlParams = new URLSearchParams(QueryString);
var platform = window['platform-detect']



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
    if (urlParams.has('p')) {
        document.location.replace(document.location.origin + `/dashboard/?page=${urlParams.get('p')}`)
    } else {
        document.location.replace(document.location.origin + `/dashboard/`)
    }
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
                //document.getElementById('runas').innerHTML = response
                if (response.role == 'student') { //Student Support only (for now)
                    response.auth = `Basic ${btoa(`${encodeURI(user)}:${encodeURI(pass)}`)}` //Save Auth header in auth cookie cause there's iframes involved
                    //response.role = 'admin'
                    setCookie('slUser', encodeURI(JSON.stringify(response)), 7)
                    $('#signin-button').removeClass('btn-primary').addClass('btn-success')
                    document.getElementById('signin-button').innerHTML = "✓"
                    //alert(`<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Please Wait, Signing you in</span></div> Signing you in...`, 'success')
                    if (urlParams.has('f')) localStorage.clear()
                    setTimeout(() => {
                        login()
                    }, 2000)//2500
                    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                } else {
                    $('#signin-button').removeClass('btn-primary').addClass('btn-danger')
                    $('#wrongRoleButton').click(function(e) {
                        e.preventDefault();
                        $('#signin-button').removeClass('btn-danger').addClass('btn-primary')
                        document.getElementById('signin-button').innerHTML = "Sign In"
                    });
                    incorrectRole(response.role)
                    return
                }
            } else {
                //alert('Something Went Wrong! Check Username and Password', 'danger')
                $('#signin-button').removeClass('btn-primary').addClass('btn-danger')
                document.getElementById('signin-button').innerHTML = 'Check Username/Password'
                return
            }
        } catch(e) {
            alert(`Error ${e}`, 'danger')
            return
        }
        //login()
}


//Entire Script
let crosWarning = new bootstrap.Toast(document.getElementById('crosWarning'))
let loggedOut = new bootstrap.Toast(document.getElementById('loggedOutToast'))
document.getElementById('runas').innerHTML = whatIsSiteBeingRunAs
if (urlParams.has('r')) incorrectRole(urlParams.get('r'))
if (urlParams.has('out')) loggedOut.show()
if (platform.chromeos) crosWarning.show()



//if (isMobile()) document.


//JQuery Stuff
$('#login').bind('submit', function (e) {
    $('#signin-button').removeClass('btn-danger').removeClass('btn-secondary').addClass('btn-primary')
    document.getElementById('signin-button').innerHTML = `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`
    e.preventDefault();
    console.log('Welcome!');
    checkUser($('#floatingUsername').val(), $('#floatingPassword').val());
});