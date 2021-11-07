function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
(async function() {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
    let user = JSON.parse(decodeURI(Cookies.get('slUser')))
    let auth = {
        headers: {
            'Authorization': `${user.auth}`,
        }
    }
    if (!localStorage.getItem(`mail-lastUpdated`) >= Date.now() + 10 * 60 || !localStorage.getItem(`mail-lastUpdated`) && online) {
        let loopmails = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}`, auth).then((response) => { return response })
        loopmails = await loopmails.json()
        localStorage.setItem('mail', JSON.stringify(loopmails))
            //console.log(courseInfo)
        localStorage.setItem(`mail-lastUpdated`, new Date().getTime()) //reduce waiting time in same session
    }
    let loopmails = JSON.parse(localStorage.getItem('mail'))
        //console.log(loopmails)
    if (loopmails.length >= 1) {
        document.getElementById('noItems').remove();
        document.getElementById('reason').remove()
    }
    //console.log(loopmails)
    let loop;
    for (let loop = 0; loop < loopmails.length; loop++) {
        const mail = loopmails[loop];
        if (!localStorage.getItem(`mail-message-${mail.ID}`) && online) {
            var message = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}&ID=${mail.ID}`, auth).then((response) => { return response })
            message = await message.json()
                //console.log(message)
            localStorage.setItem(`mail-message-${mail.ID}`, JSON.stringify(message)) //reduce waiting time in same session
        }
        var message = JSON.parse(localStorage.getItem(`mail-message-${mail.ID}`))
        let listItem = document.createElement('li')
        listItem.className = 'list-group-item d-flex justify-content-between align-items-start list-group-item-action'
        if (!message.read) listItem.className = 'list-group-item d-flex justify-content-between align-items-start list-group-item-action list-group-item-warning'
        listItem.innerHTML = `
                    <div class="ms-2 me-auto">
                    <div class="fw-bold">${mail.subject}</div>
                    ${String(mail.sender.name).split(', ')[1]} ${String(mail.sender.name).split(', ')[0]}
                    </div>
                    <span class="badge">${new Date(parseInt(String(mail.date))).toLocaleDateString()}</span>`
        document.getElementById('mail').appendChild(listItem)
        listItem.addEventListener('click', () => {
                new WinBox(`${mail.subject}`, {
                    url: `mail-view.html?msg=${mail.ID}`,
                    class: 'navbar-themed'
                })
            })
            //console.log(message)
    }
    feather.replace({ 'aria-hidden': 'true' })
    console.info(`Loaded Loopmail Page (${loopmails.length} messages)`)
    if (inIframe()) {
        let action = document.createElement('a')
        action.href = document.location.href.split('.html')[0]
        action.target = '_parent'
        action.innerHTML = 'Hide Sidebar'
        document.getElementById('embeddedAction').appendChild(action)
    } else {
        let action = document.createElement('a')
        action.href = document.location.origin + '/dashboard/?page=mail'
            //action.target = '_blank'
        action.innerHTML = 'Show Sidebar'
        document.getElementById('embeddedAction').appendChild(action)
    }
})()