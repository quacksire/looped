
export async function onRequestGet(context) {

    try {
        if (!context.request.headers.get('X-SL-User')) {
            return new Response('Not logged in', {status: 401})
        }
        let token = context.request.headers.get('X-SL-User').split(':')[0]
        let uid = context.request.headers.get('X-SL-User').split(':')[1]
        token = decodeURI(token)


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
