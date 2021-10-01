/* globals Chart:false, feather:false */



async function getEverything(user) {
    console.log(user)
    if (user.role != 'student') logout({ 'role': user.role })
    let courses = await fetch(`https://hmbhs.schoolloop.com/mapi/report_card?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
    let assignments = await fetch(`https://hmbhs.schoolloop.com/mapi/assignments?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
    let news = await fetch(`https://hmbhs.schoolloop.com/mapi/news?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response.data })
    let loopmails = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
    console.log(courses.statusText)
    let courseList = await courses.json().then((courses) => { return courses })
    console.log(courseList)
    var count = 0
    courseList.forEach(course => {
        let link = document.location.origin + `/schoolloop/redesign/dashboard/class.html?id=${course.periodID}`
        let card = document.createElement('li')
        if (course.grade === 'null') course.grade = 'N/A'
        card.innerHTML = `
        <a href="${link}" class="link-dark rounded">${course.grade || 'N/A'} - ${course.courseName}</a>`
        document.getElementById('classlist').appendChild(card)
    })


    assignments = await assignments.json()
    console.log(assignments)
    assignments.forEach(assignment => {
            if (assignment.description === 'null') assignment.description = ''
            assignment.description = String(assignment.description).replace("\\n", '').replace('  ', '')
            let listItem = document.createElement('a')
            listItem.className = 'list-group-item list-group-item-action'
            listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1"> ${assignment.title}</h5>
            <small>Due: ${new Date(parseInt(String(assignment.dueDate))).toLocaleDateString()}</small>
        </div>
        <p class="mb-1">${assignment.description}</p>
        <small> ${assignment.courseName} - ${assignment.teacherName}</small>`
            document.getElementById('assignments').appendChild(listItem)
        })
        //1632121200.000 -> remove last three zeros
}
(async function() {
    'use strict'
    await chrome.storage.local.get(function(user) {
        user = user.user || user.response
        var first = String(user.fullName).split(', ')[1]
        var last = String(user.fullName).split(', ')[0]
        document.getElementById('username').innerHTML = `<i data-feather="user"></i> ${String(user.fullName).split(', ')[1]} ${String(user.fullName).split(', ')[0]}`
        getEverything(user)
    });
    setTimeout(() => {
        if (document.getElementById('username').innerHTML === 'Error') {
            logout()
        }
    }, 2000)
})()