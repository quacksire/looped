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
    })


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

    document.getElementById('homeClick').addEventListener('click', () => {

        togglePage()

    })
    document.getElementById('inbox').addEventListener('click', () => {

        togglePage('mail')

    })
    document.getElementById('layout').addEventListener('click', () => {

        togglePage('news')

    })
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
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