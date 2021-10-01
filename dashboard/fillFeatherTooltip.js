/* global bootstrap: false */
function getBrowserName() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        return 'Opera Extension';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
        return 'Chrome Extension';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        return 'Safari Web Extension';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        return 'Firefox Add-On';
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
    await chrome.storage.local.get(function(user) {
        user = user.user || user.response
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

        //schoolDomain
        let schoolDomain = document.getElementsByClassName('SLschoolDomain')
        schoolDomain[0].innerHTML = `${user.students[0].school.domainName}`

        //schoolName
        let schoolName = document.getElementsByClassName('SLschoolName')
        schoolName[0].innerHTML = `${user.students[0].school.name}`

        //schoolName
        let schoolDistrict = document.getElementsByClassName('SLschoolDistrict')
        schoolDistrict[0].innerHTML = `${user.students[0].school.districtName}`

        //schoolName
        let extVersion = document.getElementsByClassName('ext-version')
        extVersion[0].innerHTML = `${getBrowserName()}: <br> Version ${chrome.runtime.getManifest().version}<br> Manifest Version ${chrome.runtime.getManifest().manifest_version}`

    }); //SLrole


})() //ext-version


$('#username').click(function(e) {
    e.preventDefault();
    var myModal = new bootstrap.Modal(document.getElementById('userInfo'), {})
    myModal.toggle()
});
/*
<div class="modal-body">
                        <p>Name:<p class="SLname"></p><br>
                        Email: <p class="SLemail"><br>
                        Role: <p class="SLrole"></p><br>
                        UserID: <code class="SLuserID"></code><br>
                        Domain: <code class="SLschoolDomain"></code><br>
                        School Name: <code class="SLschoolName"></code><br>
                        School District: <code class="SLschoolDistrict"></code>

                        </p>
                    </div>
{
  "isParent": "false",
  "isUnverifiedParent": "false",
  "fullName": "Jeffs, Samuel",
  "email": "70532@cabrillo.k12.ca.us",
  "userName": "sjeffs24",
  "acceptedAgreement": "true",
  "hashedPassword": "null",
  "userID": "1593846838236",
  "role": "student",
  "students": [
    {
      "studentID": "1593846838236",
      "name": "Jeffs, Samuel",
      "school": {
        "paid": "false",
        "domainName": "hmbhs.schoolloop.com",
        "grades": "true",
        "districtName": "Cabrillo Unified School District",
        "name": "Half Moon Bay High School"
      }
    }
  ],
  "auth": "Basic c2plZmZzMjQ6amVmMjI4c2M="
}
*/