
export async function onRequestGet(context) {

    try {
        let get_cookies = function(request) {
            let cookies = {};
            context.request.headers.get('Cookie').split(';').forEach(function(cookie) {
                let parts = cookie.match(/(.*?)=(.*)$/)
                cookies[ parts[1].trim() ] = (parts[2] || '').trim();
            });
            return cookies;
        };
        let cookie = get_cookies(context.request)
        if (!cookie['sl-token'] || !cookie['sl-uid']) {
            return new Response('Not logged in', {status: 401})
        }
        let token = cookie['sl-token']
        let uid = cookie['sl-uid']


        //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"


        let response = await fetch(`https://hmbhs.schoolloop.com/mapi/news?studentID=${uid}`,
            {
                headers: {
                    "Authorization": `Basic ${token}`
                }
            }
        )
        response = await response.json()

        return new Response(
            JSON.stringify(response),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                    "cache-control": `s-maxage=1200, stale-while-revalidate=600`
                },
            }
        )
    } catch (e) {
        return new Response(`${e} | token: ${token} | uid: ${uid}`, {status: 500})
    }
}
