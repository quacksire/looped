export const config = {
    runtime: 'edge', // this is a pre-requisite
    regions: ['sfo1'], // only execute this function on sfo1
};

import { RequestCookies } from '@edge-runtime/cookies'


export default async function handler(req, res) {
    const cookies = new RequestCookies(req.headers)

    if (!cookies.has('sl-token') || !cookies.has('sl-uid')) {
        return new Response('Not logged in', {status: 401})
    }
    let token = cookies.get('sl-token')?.value
    let uid = cookies.get('sl-uid')?.value
    token = decodeURI(token)

    try {


        //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"

        let response = await fetch(`https://hmbhs.schoolloop.com/mapi/assignments?studentID=${uid}`,
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
                    "Cache-Control": `s-maxage=1200, stale-while-revalidate=600`
                },
            }
        )
    } catch (e) {
        return new Response(`${e} | token: ${token} | uid: ${uid}`, {status: 500})
    }

}
