export const config = {
    runtime: 'edge',
}


export default async function handler(req, res) {
    let cookies = req.headers.get('Cookie') || ""
    if (!cookies.includes("sl-token") || !cookies.includes("sl-token")) {
        return new Response('Not logged in', {status: 401})
    }

    let token = cookies.split("sl-token=")[1].split(";")[0]
    let uid = cookies.split("sl-uid=")[1].split(";")[0]

    //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"


    let response = await fetch(`https://hmbhs.schoolloop.com/mapi/assignments?studentID=${uid}`,
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
}
