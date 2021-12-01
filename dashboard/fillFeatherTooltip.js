/* global bootstrap: false */
function getBrowserName() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
        return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
        return 'Internet Explorer (how??)';
    } else {
        return 'Not sure!';
    }
}



(async function() {
    feather.replace({ 'aria-hidden': 'true' })

    'use strict'
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(function(tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl)
        })
        /*
            document.getElementById('id').addEventListener('click' () => {

                username



            })
        */

    let user = JSON.parse(decodeURI(Cookies.get('slUser')))
    var first = String(user.fullName).split(', ')[1]
    var last = String(user.fullName).split(', ')[0]
    user.fullName = `${first} ${last}`

    //Name
    let name = document.getElementsByClassName('SLname')
    name[0].innerHTML = `${user.fullName}`


    //Email
    let email = document.getElementsByClassName('SLemail')
    email[0].innerHTML = `${user.email}`

    //Role
    let role = document.getElementsByClassName('SLrole')
    role[0].innerHTML = `${user.role}`

    //userID
    let userID = document.getElementsByClassName('SLuserID')
    userID[0].innerHTML = `${user.userID}`
    gtag('set', 'user_properties','MEASUREMENT_ID', {
        'user_id': `${user.userID}`
    });

    //schoolDomain
    let schoolDomain = document.getElementsByClassName('SLschoolDomain')
    schoolDomain[0].innerHTML = `${user.students[0].school.domainName}`

    //schoolName
    let schoolName = document.getElementsByClassName('SLschoolName')
    schoolName[0].innerHTML = `${user.students[0].school.name}`

    //schoolName
    let schoolDistrict = document.getElementsByClassName('SLschoolDistrict')
    schoolDistrict[0].innerHTML = `${user.students[0].school.districtName}`


    let lastCommit = await fetch(`https://api.github.com/repos/child-duckling/looped/commits/main`).then(response => { return response })
    lastCommit = await lastCommit.json()
    document.getElementById('lastCommit').innerHTML = `Commit <a href="${lastCommit.html_url}" target="_blank"><code> ${String(lastCommit.sha).slice(0, 7)}</code></a> ${lastCommit.commit.message}`
        //schoolName

    //let extVersion = document.getElementsByClassName('ext-version')
    //extVersion[0].innerHTML = `${getBrowserName()}: <br> Version ${chrome.runtime.getManifest().version}<br> Manifest Version ${chrome.runtime.getManifest().manifest_version}`
    //SLrole

    //lastCommit
})() //ext-version




/*
$('#username').click(function(e) {
    e.preventDefault();
    var myModal = new bootstrap.Modal(document.getElementById('userInfo'), {})
    myModal.toggle()
});
*/

$('#info').click(function(e) {
    e.preventDefault();
    var myModal = new bootstrap.Modal(document.getElementById('userInfo'), {})
    myModal.toggle()
});
