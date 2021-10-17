/* globals Chart:false, feather:false */




function togglePage(page = null) {
    $('.page').attr("hidden", true)
    console.log(page)
    if (page != null) {
        document.getElementById('home').hidden = true
        $('#home').attr("hidden", true);
        $('#mainView').css({ 'overflow': 'hidden' });
        $(`#${page}`).removeAttr('hidden');
    } else {
        $('#mainView').css({ 'overflow': 'scroll' });
        document.location.href = '/looped/dashboard' //Fixes Cache
    }
}





async function getEverything(user) {
    if (!navigator.onLine) {
        console.info('Offline!')
            /*
            PWA Mode
            */
    }


    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);

    if (user.role != 'student') logout(user.role)
    if (parseInt(localStorage.getItem('sl-lastUpdated')) >= Date.now() + 10 * 60) Cookies.remove('sl') //
    if (!Cookies.get('sl')) {
        console.warn('Refreshing Data')
        let courses = await fetch(`https://hmbhs.schoolloop.com/mapi/report_card?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
        let assignments = await fetch(`https://hmbhs.schoolloop.com/mapi/assignments?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
        let news = await fetch(`https://hmbhs.schoolloop.com/mapi/news?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response.data })
        let loopmails = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
        console.info(`School Loop API Response: ${courses.status} ${courses.statusText}`)
        let slLoopmail = await loopmails.json().then((data) => { return data })
        let slAssignments = await assignments.json().then((data) => { return data })
        let slCourses = await courses.json().then((data) => { return data })
        Cookies.set('sl', 'true')
        localStorage.setItem('sl-lastUpdated', encodeURI(new Date().getTime()))
        localStorage.setItem('sl-loopmail', JSON.stringify(slLoopmail))
        localStorage.setItem('sl-assignments', JSON.stringify(slAssignments))
        localStorage.setItem('sl-courses', JSON.stringify(slCourses))
    }


    let courseList = JSON.parse(localStorage.getItem('sl-courses'))
        //console.log(courseList)
        //console.log(JSON.parse(localStorage.getItem('sl-loopmail')))
    var count = 0
    let gpa = 0
    let trueClassCount = 0
    courseList.forEach(course => {
        let link = '#'
        let card = document.createElement('li')
        card.id = 'classSelector'
        card.onclick = `togglePage(${course.periodID})`
        if (course.grade === 'null') course.grade = 'N/A'
        card.innerHTML = `
        <a href="#" onclick="togglePage(${course.periodID})" class="rounded">${course.grade || 'N/A'} - ${course.courseName}</a>`
        card.addEventListener('click', () => {

            togglePage(`${course.periodID}`)

        })
        document.getElementById('classlist').appendChild(card)


        let iframe = document.createElement('iframe')
        iframe.src = `class.html?id=${course.periodID}`
        iframe.hidden = true
            //iframe.style.display = 'none'
        iframe.width = '100%'
        iframe.height = '100%'
        iframe.frameBorder = '0'
        iframe.id = `${course.periodID}`
        iframe.className = 'page'

        document.getElementById('mainView').appendChild(iframe)
            //console.log(course)

        if (course.score != 'null') {
            //console.log(parseFloat(String(course.score).slice(0, String(course.score).length - 1)))
            gpa = gpa + parseFloat(String(course.score).slice(0, String(course.score).length - 1))
            trueClassCount++
        }
    })


    //------------------------ GPA ------------------------//
    gpa = gpa / trueClassCount
    gpa = gpa.toFixed(2)
    let simplified = ((gpa - 50) / 10).toFixed(1)
    if (urlParams.has('gpa')) simplified = parseFloat(urlParams.get('gpa'))
    let color = 'text-primary'
        //add some ✨spice✨
    if (simplified >= 3.0) { color = 'text-success' } else if (simplified <= 2.0) { color = 'text-danger' } else if (simplified >= 4.5) { color = 'text-info' } else { color = 'text-warning' }
    document.getElementById('gpa').innerHTML = `<strong class="${color} center" data-bs-toggle="tooltip" data-bs-placement="right" title="${gpa}">${simplified}</strong>`
    console.log(`GPA: ${gpa}`)

    //------------------------ Static Pages ------------------------//
    let mailPage = document.createElement('iframe')
    mailPage.src = `mail.html`
    mailPage.hidden = true
        //iframe.style.display = 'none'
    mailPage.width = '100%'
    mailPage.height = '100%'
    mailPage.frameBorder = '0'
    mailPage.id = `mail`
    mailPage.className = 'page'
    document.getElementById('mainView').appendChild(mailPage)

    let newsPage = document.createElement('iframe')
    newsPage.src = `news.html`
    newsPage.hidden = true
        //iframe.style.display = 'none'
    newsPage.width = '100%'
    newsPage.height = '100%'
    newsPage.frameBorder = '0'
    newsPage.id = `news`
    newsPage.className = 'page'
    document.getElementById('mainView').appendChild(newsPage)



    //------------------------ Click Events ------------------------//
    document.getElementById('homeClick').addEventListener('click', () => {

        togglePage()

    })
    document.getElementById('inbox').addEventListener('click', () => {

        togglePage('mail')

    })
    document.getElementById('layout').addEventListener('click', () => {

        togglePage('news')

    })

    if (urlParams.get('page')) togglePage(urlParams.get('page'))







    //------------------------Page Content------------------------
    assignments = JSON.parse(localStorage.getItem('sl-assignments'))
        //console.log(assignments)
    assignments.forEach(assignment => {
        if (assignment.description === 'null') assignment.description = ''
        if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date().toLocaleDateString()) var badge = '<span class="badge bg-danger">Due today</span>'
        if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()) var badge = '<span class="badge bg-warning">Due tomorrow</span>'
        if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()) var badge = '<span class="badge bg-warning">Due in two days</span>'
        if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()) var badge = '<span class="badge bg-success">Due in three days</span>'
        if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()) var badge = '<span class="badge bg-success">Due in four days</span>'
        if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()) var badge = '<span class="badge bg-primary">Due in five days</span>'
        if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() === new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()) var badge = '<span class="badge bg-primary">Due in six days</span>'
        if (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString() >= new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()) var badge = `<span class="badge bg-secondary">Due ${new Date(parseInt(String(assignment.dueDate))).toLocaleDateString()}</span>`
        var badge = badge || 'Due:' + new Date(parseInt(String(assignment.dueDate))).toLocaleDateString()
        assignment.description = String(assignment.description).replace("\\n", '').replace('  ', '')
        let listItem = document.createElement('a')
        listItem.className = 'list-group-item list-group-item-action assignment'
        listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1"> ${assignment.title}</h5>
            <small>${badge}</small>
        </div>
        <p class="mb-1">${assignment.description}</p>
        <small> ${assignment.courseName} - ${assignment.teacherName}</small>`
        document.getElementById('assignments').appendChild(listItem)
    })
    $('.assignment').click(function(e) {
        e.preventDefault();
        this.hidden = true
    });



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
/*
[
  {
    "teacherName": "Hees, Gerhardt",
    "teacherRegistered": "true",
    "periodID": "1593846839423",
    "period": "1",
    "courseName": "Advisory 9th",
    "teacherID": "1486205533181",
    "grade": "N/A",
    "score": "null",
    "coTeacherID": "0",
    "coTeacherName": "null",
    "lastUpdated": "null"
  },
  {
    "teacherName": "Olson, Pat",
    "teacherRegistered": "true",
    "periodID": "1593846839236",
    "period": "2",
    "courseName": "Broadcasting",
    "teacherID": "1102472042704",
    "grade": "A-",
    "score": "90%",
    "coTeacherID": "0",
    "coTeacherName": "null",
    "lastUpdated": "10/15/21 6:02 PM"
  },
  {
    "teacherName": "Centoni, Joseph",
    "teacherRegistered": "true",
    "periodID": "1593846839225",
    "period": "3",
    "courseName": "Biology",
    "teacherID": "1102472042650",
    "grade": "B+",
    "score": "88%",
    "coTeacherID": "0",
    "coTeacherName": "null",
    "lastUpdated": "10/15/21 9:38 AM"
  },
  {
    "teacherName": "Galvin, Thomas",
    "teacherRegistered": "true",
    "periodID": "1593847208539",
    "period": "4",
    "courseName": "World History",
    "teacherID": "1593846837961",
    "grade": "A+",
    "score": "97.75%",
    "coTeacherID": "0",
    "coTeacherName": "null",
    "lastUpdated": "10/13/21 11:24 AM"
  },
  {
    "teacherName": "Toner, James",
    "teacherRegistered": "true",
    "periodID": "1629184066249",
    "period": "5",
    "courseName": "Adv English II",
    "teacherID": "1563866882363",
    "grade": "B",
    "score": "83.58%",
    "coTeacherID": "0",
    "coTeacherName": "null",
    "lastUpdated": "10/14/21 7:23 PM"
  },
  {
    "teacherName": "Taylor, Dustin",
    "teacherRegistered": "true",
    "periodID": "1593846838898",
    "period": "6",
    "courseName": "Core PE 10th gr",
    "teacherID": "1470120028673",
    "grade": "A-",
    "score": "92.93%",
    "coTeacherID": "0",
    "coTeacherName": "null",
    "lastUpdated": "10/13/21 9:52 AM"
  },
  {
    "teacherName": "Jones, David",
    "teacherRegistered": "true",
    "periodID": "1633162354743",
    "period": "7",
    "courseName": "Geometry",
    "teacherID": "1249846191673",
    "grade": "A+",
    "score": "98.11%",
    "coTeacherID": "0",
    "coTeacherName": "null",
    "lastUpdated": "10/15/21 10:34 AM"
  }
]
*/