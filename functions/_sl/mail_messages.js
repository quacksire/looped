
export async function onRequestGet(context) {
    try {
        let cookies = context.request.headers.get('Cookie') || ""
        if (!cookies.includes("sl-token") || !cookies.includes("sl-token")) {
            return new Response('Not logged in', {status: 401})
        }

        let cooks = cookies.split(';')
        let token = cooks[0].split('=')[1]
        let uid =  cooks[1].split('=')[1]

        //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"


        let response = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${uid}`,
            {
                headers: {
                    authorization: `Basic ${token}`
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
        return new Response(e, {status: 500})
    }

}
