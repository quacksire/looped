(async function() {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
    let user = JSON.parse(decodeURI(Cookies.get('slUser')))
    let auth = {
        headers: {
            'Authorization': `${user.auth}`,
        }
    }
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
    document.getElementById('to').innerHTML = `${String(user.fullName).split(', ')[1]} ${String(user.fullName).split(', ')[0]}`
        //}
    feather.replace({ 'aria-hidden': 'true' })

})()