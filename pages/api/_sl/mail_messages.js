export const config = {
    runtime: 'edge', // this is a pre-requisite
    regions: ['sfo1'], // only execute this function on sfo1
};
import { RequestCookies } from '@edge-runtime/cookies'


export async function getMail(token, uid) {
    let response = await fetch(`https://hmbhs.schoolloop.com/mapi/mail_messages?studentID=${uid}`,
        {
            headers: {
                "Authorization": `Basic ${token}`
            }
        }
    )
    response = await response.json()

    return response
}

export default async function handler(req, res) {
    try {
        const cookies = new RequestCookies(req.headers)


        if (!cookies.has('sl-token') || !cookies.has('sl-uid')) {
            return new Response('Not logged in', {status: 401})
        }

        let token = cookies.get('sl-token')?.value
        let uid = cookies.get('sl-uid')?.value
        token = decodeURI(token)


        //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"

        let article = await getMail(token, uid)



        return new Response(
            JSON.stringify(article),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                    "Cache-Control": `s-maxage=10, stale-while-revalidate=30`
                },
            }
        )
    } catch (e) {
        return new Response(`${e} | token: ${token} | uid: ${uid}`, {status: 500})
    }
}
