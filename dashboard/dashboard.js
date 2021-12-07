/* globals Chart:false, feather:false */
const QueryString = window.location.search;
const urlParams = new URLSearchParams(QueryString);



function togglePage(page = null) {
    $('.page').attr("hidden", true)
    $('.active').removeClass('active');
    //$('.page').attr("visibility", 'hidden')
    console.log(page)

    var myCollapse = document.getElementById('sidebarMenu')
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
        toggle: false
    })
    if (page != null) {
        document.getElementById('home').hidden = true
        $('#home').attr("hidden", true);
        $('#mainView').css({ 'overflow': 'hidden' });
        $('body').css({ 'overflow': 'hidden' });
        $(`#${page}`).removeAttr('hidden');
        $(`#page-button-${page}`).addClass('active');
        //$(`#${page}`).removeAttr('visibility');
    } else {
        $('#mainView').css({ 'overflow': 'scroll' });
        document.location.reload()
            //Fixes Cache

    }
}
//if (isFirefox()) 
function visibility(iframe) {
    //if (getBrowserName() != "Firefox") {
    //iframe.style.visibility = 'hidden'
    //} else {
    iframe.hidden = true
        //}
    return iframe
}

function isFirefox() {
    if (getBrowserName() != "Firefox") return false
    return true
}

async function spin(e, degrees) {
    //console.log(e)
    for (let loop = 0; loop < degrees; loop++) {
        setTimeout(() => {
            e.style.transform = `rotate(-${loop}deg)`
        }, degrees + loop)
    }
}


async function cache(f = null) {
    console.group('CACHE')
    let user = JSON.parse(decodeURI(Cookies.get('slUser')))
    if (localStorage.getItem('sl-lastUpdated')) console.log(`Last Updated on ${new Date(parseInt(localStorage.getItem('sl-lastUpdated'))).toLocaleString()}\nWill Update at ${new Date(parseInt(localStorage.getItem('sl-updateAt'))).toLocaleString()}`)
    if (parseInt(localStorage.getItem('sl-updateAt')) <= Date.now() && online || f && online || urlParams.has('f') || localStorage.length <= 1) {
        console.warn('Attempting to Refresh Data...')
        let courses = await fetch(`https://hmbhs.schoolloop.com/mapi/report_card?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
        let assignments = await fetch(`https://hmbhs.schoolloop.com/mapi/assignments?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
        let news = await fetch(`https://hmbhs.schoolloop.com/mapi/news?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response.data })
        let loopmails = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}`, { headers: { 'Authorization': `${user.auth}` } }).then((response) => { return response })
        console.info(`School Loop API Response: ${courses.status} ${courses.statusText}`)
        try {
            //localStorage.clear()
            Cookies.set('sl', 'true')
            localStorage.setItem('sl-lastUpdated', encodeURI(new Date().getTime()))
            localStorage.setItem('sl-updateAt', encodeURI(new Date().setMinutes(new Date().getMinutes() + 10)))
            localStorage.setItem('sl-loopmail', JSON.stringify(await loopmails.json().then((data) => { return data })))
            localStorage.setItem('sl-assignments', JSON.stringify(await assignments.json().then((data) => { return data })))
            localStorage.setItem('sl-courses', JSON.stringify(await courses.json().then((data) => { return data })))
        } catch (error) {
            console.log(error)
            console.warn('Attempt to Refresh Data Failed')
            Cookies.set('sl', 'offline')
            offline()
        }
    } else {
        console.log(`Updating in ${new Date(parseInt(localStorage.getItem('sl-updateAt'))).getMinutes() - new Date().getMinutes()} minutes(s)`)
    }
    gtag('set', 'user_properties', { 'crm_id': `${user.students[0].studentID}` });
    console.groupEnd()
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
    setTimeout(() => {
        if (document.getElementById('username').innerHTML === 'Error') {
            logout()
        }
    }, 2000)
    if (urlParams.has('f')) console.warn('FORCE CLEAR param')
    if (user.role != 'student') logout(user.role)

    await cache()
    setInterval(cache(), 600000)
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
            if (course.grade === 'null') {
                course.grade = '-&nbsp;&nbsp;&nbsp;&nbsp;'
            } else {
                let space = 5
                let spaced = space - String(course.grade).length
                    //console.log(spaced)
                course.grade = course.grade + '&nbsp;'.repeat(spaced)
            }
            card.innerHTML = `
        <li class="nav-item" >
            <a class="nav-link"  id="page-button-${course.periodID}" href="#" ${mobileCollapse() || ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>${course.grade} ${course.courseName}
            </a>
        </li>`
            card.addEventListener('click', () => {

                togglePage(`${course.periodID}`)

            })
            document.getElementById('classlist').appendChild(card)
            let iframe = document.createElement('iframe')
            iframe.src = `class.html?id=${course.periodID}`
            iframe = visibility(iframe)
            iframe.width = '100%'
            iframe.height = '100%'
            iframe.frameBorder = '0'
            iframe.id = `${course.periodID}`
            iframe.className = 'page min-vh-100'
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
    if (simplified >= 3.0 && simplified <= 4.5) { color = 'text-success' } else if (simplified <= 2.0) { color = 'text-danger' } else if (simplified >= 4.5) { color = 'text-info' } else { color = 'text-warning' }
    document.getElementById('gpa').innerHTML = `<strong class="${color} center" data-bs-toggle="tooltip" data-bs-placement="right" title="${gpa}">${simplified}</strong>`
    console.log(`GPA: ${gpa}`)
        //------------------------ Static Pages ------------------------//
        /*
         * 'id' is used to "open" the page
         */
    let mailPage = document.createElement('iframe')
    mailPage.src = `/mail/index.html`
    mailPage = visibility(mailPage)
    mailPage.width = '100%'
    mailPage.height = '100%'
    mailPage.frameBorder = '0'
    mailPage.id = `mail`
    mailPage.className = 'page min-vh-100'
    document.getElementById('mainView').appendChild(mailPage)

    let newsPage = document.createElement('iframe')
    newsPage.src = `news.html`
    newsPage = visibility(newsPage)
    newsPage.width = '100%'
    newsPage.height = '100%'
    newsPage.frameBorder = '0'
    newsPage.id = `news`
    newsPage.className = 'page min-vh-100'
    document.getElementById('mainView').appendChild(newsPage)
        //------------------------ Page Events ------------------------//
    document.getElementById('homeClick').addEventListener('click', () => {
            togglePage()
        })
        //------------------------
    if (mobileCollapse(true)) $('#page-button-mail').attr("data-bs-toggle", "collapse").attr("data-bs-target", "#sidebarMenu").attr("aria-controls", "sidebarMenu").attr("aria-expanded", false)
    document.getElementById('page-button-mail').addEventListener('click', () => {
            togglePage('mail')
        })
        //------------------------
    if (mobileCollapse(true)) $('#page-button-news').attr("data-bs-toggle", "collapse").attr("data-bs-target", "#sidebarMenu").attr("aria-controls", "sidebarMenu").attr("aria-expanded", false)
    document.getElementById('page-button-news').addEventListener('click', () => {
            togglePage('news')
        })
        //------------------------
    if (urlParams.get('page')) {
        if (!document.getElementById(urlParams.get('page'))) { //Check if page exists
            window.location.search = ''
        } else {
            togglePage(urlParams.get('page'))
        }
    }
    //------------------------Page Content------------------------
    let assignments = JSON.parse(localStorage.getItem('sl-assignments'))
        //console.log(assignments)
    assignments.forEach((assignment, index) => {
        if (assignment.description === 'null') assignment.description = ''
        var badge
        switch (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString()) {
            case new Date().toLocaleDateString():
                badge = '<span class="badge bg-danger">Due today</span>'
                break
            case new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString():
                badge = '<span class="badge bg-warning text-dark">Due tomorrow</span>'
                break
            case new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString():
                badge = '<span class="badge bg-warning text-dark">Due in two days</span>'
                break
            case new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString():
                badge = '<span class="badge bg-success">Due in three days</span>'
                break
            case new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString():
                badge = '<span class="badge bg-success">Due in four days</span>'
                break
            case new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString():
                badge = '<span class="badge bg-primary">Due in five days</span>'
                break
            case new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString():
                badge = '<span class="badge bg-primary">Due in six days</span>'
                break
            default:
                badge = `<span class="badge bg-secondary">Due ${new Date(parseInt(String(assignment.dueDate))).toLocaleDateString()}</span>`
        }
        assignment.description = String(assignment.description).replace("\\n", '').replace('  ', '')
        let listItem = document.createElement('a')
        listItem.className = 'list-group-item list-group-item-action assignment'
        listItem.id = `assignment-${assignment.iD}`
        listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1"> ${assignment.title}</h5>
            <small>${badge}</small>
        </div>
        <p class="mb-1">${assignment.description}</p>
        <small> ${assignment.courseName} - ${assignment.teacherName}</small>`
        listItem.addEventListener('click', () => {
            listItem.hidden = true
            console.log(`Hide assignment ${assignment.iD}`)

        })
        document.getElementById('assignments').appendChild(listItem)
    })



    $('.assignment').click(function(e) {
        e.preventDefault();
        this.hidden = true
    });
    $('.reload').click(function(e) {
        let el = e.target
        spin(el, 360)
        cache('force').then(() => {
            setTimeout(window.location.reload(), 2000)
        })
    })
})()