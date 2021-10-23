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
    let id = urlParams.get('id')
    if (!localStorage.getItem(`mail-lastUpdated`) >= Date.now() + 10 * 60 || !localStorage.getItem(`mail-lastUpdated`)) {
        let loopmails = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}`, auth).then((response) => { return response })
        loopmails = await loopmails.json()
        localStorage.setItem('mail', JSON.stringify(loopmails))
            //console.log(courseInfo)
        localStorage.setItem(`mail-lastUpdated`, new Date().getTime()) //reduce waiting time in same session
    }
    let loopmails = JSON.parse(localStorage.getItem('mail'))
        //console.log(loopmails)
    if (loopmails.length >= 1) document.getElementById('noItems').remove()
    loopmails.forEach(async mail => {

        if (!localStorage.getItem(`mail-message-${mail.ID}`)) {
            var message = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}&ID=${mail.ID}`, auth).then((response) => { return response })

            message = await message.json()
                //console.log(courseInfo)

            localStorage.setItem(`mail-message-${mail.ID}`, JSON.stringify(message)) //reduce waiting time in same session

        }
        /*
                try {
                    
                    document.getElementById('noItems').remove()
                } catch (error) {
                    document.getElementById('reason').innerText = 'Please try agin later '
                    return
                }
        */
        var message = JSON.parse(localStorage.getItem(`mail-message-${mail.ID}`))
            //Want to do more here, like a pi chart or something
        let listItem = document.createElement('li')
        listItem.className = 'list-group-item d-flex justify-content-between align-items-start list-group-item-action'
        listItem.innerHTML = `
                    <div class="ms-2 me-auto">
                    <div class="fw-bold">${mail.subject}</div>
                    ${String(mail.sender.name).split(', ')[1]} ${String(mail.sender.name).split(', ')[0]}
                    </div>
                    <span class="badge">${new Date(parseInt(String(mail.date))).toLocaleDateString()}</span>`
        document.getElementById('mail').appendChild(listItem)
        listItem.addEventListener('click', () => {


            var myModal = new bootstrap.Modal(document.getElementById(mail.ID))
            myModal.show()
        })


        //console.log(message)


        if (message.links != null) {
            //console.log(`There are ${message.links.length} links`)
            let buttons = ''
            message.links.forEach(link => {
                //console.log(link)
                buttons += `<button type="button" class="btn btn-primary" href="${link.URL}"><i data-feather="link2"></i><a href="${link.URL}" target="_blank">${link.Title}</a></button>`
            });

            message.message += `<br>${buttons}`
        }
        let messageWindow = document.createElement('div')
        messageWindow.className = `modal`
        messageWindow.id = `${mail.ID}`
        messageWindow.tabIndex = '-1'
        messageWindow.ariaHidden = 'true'
        messageWindow.innerHTML = `
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">${message.subject}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                ${message.message}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                
            
            </div>
        </div>
    </div>
    `
            //< button type = "button" class="btn btn-primary" > Save changes</ >
        document.getElementById('viewers').appendChild(messageWindow)
    })
    console.info(`Loaded Loopmail Page (${loopmails.length} messages)`)
    feather.replace({ 'aria-hidden': 'true' })


    if (inIframe()) {
        let action = document.createElement('a')
        action.href = document.location.href.split('.html')[0]
        action.target = '_parent'
        action.innerHTML = 'Hide Sidebar'
        document.getElementById('embeddedAction').appendChild(action)
    } else {
        let action = document.createElement('a')
        action.href = document.location.origin + '/looped/dashboard/?page=' + document.location.href.split('.html')[0].split('/')[4]
            //action.target = '_blank'
        action.innerHTML = 'Show Sidebar'
        document.getElementById('embeddedAction').appendChild(action)
    }
})()