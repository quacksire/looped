function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
let demoUser = {
    "isParent": "false",
    "isUnverifiedParent": "false",
    "fullName": "User, Demo",
    "role": "student",
    "email": "definitlyreal@email.of.user.com",
    "userName": "u$erN@me",
    "acceptedAgreement": "true",
    "hashedPassword": "null",
    "userID": "1593846838236",
    "students": [{
        "studentID": "1593846838236",
        "name": "Jeffs, Samuel",
        "school": {
            "paid": "false",
            "domainName": "domainName",
            "districtName": "DistrictName",
            "grades": "true",
            "name": "A High School"
        }
    }],
    "auth": "Basic c2plZmZzMjQ6MTIwMzIwMDU="
}
setCookie('slUser', encodeURI(JSON.stringify(demoUser)), 1)
setCookie('sl', "demo", 1)
document.location.replace(document.location.origin)