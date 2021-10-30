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
    if (!localStorage.getItem(`news-lastUpdated`) >= Date.now() + 10 * 60 || !localStorage.getItem(`news-lastUpdated`)) {
        let news = await fetch(`https://hmbhs.schoolloop.com/mapi/news?studentID=${user.students[0].studentID}`, auth).then((response) => { return response })
        news = await news.json()
        localStorage.setItem('news', JSON.stringify(news))
        localStorage.setItem(`news-lastUpdated`, new Date().getTime()) //reduce waiting time in same session
    }
    let news = JSON.parse(localStorage.getItem('news'))


    news.forEach(async article => {
        try {
            document.getElementById('noItems').remove();
            document.getElementById('reason').remove()
        } catch (e) {
            //nada
        }
        //Want to do more here, like a pi chart or something
        let listItem = document.createElement('li')
        listItem.className = 'list-group-item d-flex justify-content-between align-items-start list-group-item-action'
        listItem.innerHTML = `
                    <div class="ms-2 me-auto">
                    <div class="fw-bold">${article.title}</div>
                    ${String(article.authorName)}
                    </div>
                    <span class="badge">${new Date(parseInt(String(article.createdDate))).toLocaleDateString()}</span>`
        document.getElementById('news').appendChild(listItem)
        listItem.addEventListener('click', () => {

                var myModal = new bootstrap.Modal(document.getElementById(article.iD))
                myModal.show()
            })
            //let message = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${user.students[0].studentID}&ID=${mail.ID}`, auth).then((response) => { return response })
            //message = await message.json()
            //console.log(message)

        let messageWindow = document.createElement('div')
        messageWindow.className = `modal`
        messageWindow.id = `${article.iD}`
        messageWindow.tabIndex = '-1'
        messageWindow.ariaHidden = 'true'
        messageWindow.innerHTML = `
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">${article.title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                ${article.description}
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

    console.info(`Loaded LoopNews Page (${news.length} messages)`)
    feather.replace({ 'aria-hidden': 'true' })

    if (inIframe()) {
        let action = document.createElement('a')
        action.href = document.location.href.split('.html')[0]
        action.target = '_parent'
        action.innerHTML = 'Hide Sidebar'
        document.getElementById('embeddedAction').appendChild(action)
    } else {
        let action = document.createElement('a')
        action.href = document.location.origin + '/dashboard/?page=' + document.location.href.split('.html')[0].split('/')[3]
            //action.target = '_blank'
        action.innerHTML = 'Show Sidebar'
        document.getElementById('embeddedAction').appendChild(action)
    }


})()