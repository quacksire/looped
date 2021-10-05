/* globals Chart:false, feather:false */





async function getEverything(user) {
    //console.log(user)
    if (user.role != 'student') logout({ 'role': user.role })
    let courses = await fetch(`https://hmbhs.schoolloop.com/mapi/report_card?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
    let assignments = await fetch(`https://hmbhs.schoolloop.com/mapi/assignments?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
    let news = await fetch(`https://hmbhs.schoolloop.com/mapi/news?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response.data })
    let loopmails = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
    if (courses.statusText != 'OK') console.warn(`School Loop API Response: ${courses.status} ${courses.statusText}`)
    let courseList = await courses.json().then((courses) => { return courses })
        //console.log(courseList)
    var count = 0
    courseList.forEach(course => {
        let link = document.location.origin + `/looped/dashboard/class?id=${course.periodID}`
        let card = document.createElement('li')
        if (course.grade === 'null') course.grade = 'N/A'
        card.innerHTML = `
        <a href="${link}" class="rounded">${course.grade || 'N/A'} - ${course.courseName}</a>`
        document.getElementById('classlist').appendChild(card)
    })


    assignments = await assignments.json()
        //console.log(assignments)
    assignments.forEach(assignment => {
            if (assignment.description === 'null') assignment.description = ''
            if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString()) var badge = '<span class="badge bg-danger">Due Today</span>'
            if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString() + (1 * 24 * 60 * 60 * 1000)) var badge = '<span class="badge bg-danger">Due Tomorrow</span>'
            if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString() + (2 * 24 * 60 * 60 * 1000)) var badge = '<span class="badge bg-danger">Due in two days</span>'
            if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString() + (3 * 24 * 60 * 60 * 1000)) var badge = '<span class="badge bg-danger">Due in three days</span>'
            if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString() + (4 * 24 * 60 * 60 * 1000)) var badge = '<span class="badge bg-danger">Due in four days</span>'
            if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString() + (5 * 24 * 60 * 60 * 1000)) var badge = '<span class="badge bg-danger">Due in five days</span>'
            if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString() + (6 * 24 * 60 * 60 * 1000)) var badge = '<span class="badge bg-danger">Due in six days</span>'
            if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString() + (7 * 24 * 60 * 60 * 1000)) var badge = '<span class="badge bg-danger">Due in seven days</span>'


            var badge = badge || 'Due:' + new Date(parseInt(String(assignment.dueDate))).toLocaleDateString()
            assignment.description = String(assignment.description).replace("\\n", '').replace('  ', '')
            let listItem = document.createElement('a')
            listItem.className = 'list-group-item list-group-item-action'
            listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1"> ${assignment.title}</h5>
            <small>${badge}</small>
        </div>
        <p class="mb-1">${assignment.description}</p>
        <small> ${assignment.courseName} - ${assignment.teacherName}</small>`
            document.getElementById('assignments').appendChild(listItem)
        })
        //1632121200.000 -> remove last three zeros
}
(async function() {
    'use strict'
    if (Cookies.get('slUser')) {
        console.info('School Loop User Cookie Found!')
    } else {

        logout()

    }

    let user = JSON.parse(decodeURI(Cookies.get('slUser')))

    document.getElementById('username').innerHTML = `<i data-feather="user"></i> ${String(user.fullName).split(', ')[1]} ${String(user.fullName).split(', ')[0]}`
    getEverything(user)
    setTimeout(() => {
        if (document.getElementById('username').innerHTML === 'Error') {
            logout()
        }
    }, 2000)
})()