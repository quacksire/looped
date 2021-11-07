(async function() {
    const QueryString = window.location.search;
    const urlParams = new URLSearchParams(QueryString);
    if (urlParams.has('reply')) {
        let replyToID = String(urlParams.get('reply'))
        replyingToMessage = JSON.parse(localStorage.getItem(`mail-message-${replyToID}`))
        document.getElementById('oldMsg').innerHTML = `
        <br>
        <div>
        On ${new Date(parseInt(String(replyingToMessage.date))).toLocaleDateString()} ${new Date(parseInt(String(replyingToMessage.date))).toLocaleTimeString()}, <b>${String(replyingToMessage.sender.name).split(', ')[1]} ${String(replyingToMessage.sender.name).split(', ')[0]}</b> wrote: <blockquote><br>
            ${replyingToMessage.message}
        </blockquote>
        </div>
        `
    }
    await ClassicEditor.create(document.querySelector('#editor'))
    document.getElementById('send').addEventListener('click', () => {
        document.getElementsByClassName('ck')[0].remove()
        document.getElementById('send').innerHTML = `<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>`
    })
})()