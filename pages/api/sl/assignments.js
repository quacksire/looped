import { parse } from 'cookie';

export const config = {
    runtime: 'edge',
}


export default async function handler(req, res) {
    const cookie = parse(request.headers.get('Cookie') || '');
    if (!cookie['sl-token'] || !cookie['sl-uid']) {
        return new Response('Not logged in', {status: 401})
    }
    //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"


    let response = await fetch(`https://hmbhs.schoolloop.com/mapi/assignments?studentID=${cookie['sl-uid']}`,
        {
            headers: {
                authorization: `Basic ${cookie['sl-token']}`
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
