(async function() {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
    let user = JSON.parse(decodeURI(Cookies.get('slUser')))
    if (urlParams.has('news')) {
        let message = JSON.parse(localStorage.getItem(`news`))[urlParams.get('news')]
        message.description = String(message.description).replace('&nbsp;', '')
        document.getElementById('message').innerHTML = message.description
        document.getElementById('from').innerHTML = `${message.authorName}`
        document.getElementById('sent-at').innerHTML = `${new Date(parseInt(message.createdDate)).toLocaleString()}`
    } else {
        var message = JSON.parse(localStorage.getItem(`mail-message-${urlParams.get('msg')}`))
            //console.log(message)
        if (message.links != null) {
            console.log(`There are ${message.links.length} link(s)`)
            let buttons = ''
            message.links.forEach(link => {
                buttons += `<button type="button" role="button" class="btn btn-primary" href="${link.URL}"><i data-feather="link2"></i><a href="${link.URL}" class="link-light" target="_blank">${link.Title}</a></button>`
            });
            message.message += `<br>${buttons}`
        }
        message.message = String(message.message).replace('&nbsp;', '')
        document.getElementById('message').innerHTML = message.message
        document.getElementById('from').innerHTML = `${String(message.sender.name).split(', ')[1]} ${String(message.sender.name).split(', ')[0]}`
        document.getElementById('sent-at').innerHTML = `${new Date(parseInt(message.date)).toLocaleString()}`
            //if (message.recipientsString != 'null') {
            //    document.getElementById('to').innerHTML = `${String(message.recipientsString[0].name).split(', ')[1]} ${String(message.recipientsString[0].name).split(', ')[0]}`
            //} else {

        //}
        feather.replace({ 'aria-hidden': 'true' })



    }
    document.getElementById('to').innerHTML = `${String(user.fullName).split(', ')[1]} ${String(user.fullName).split(', ')[0]}`
    if (urlParams.has('m')) document.getElementById('mBack').innerHTML = `<button type="button" class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
</svg>Back</button>`
})()