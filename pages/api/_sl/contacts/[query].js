export const config = {
    runtime: 'edge', // this is a pre-requisite
    regions: ['sfo1'], // only execute this function on sfo1
};
import { RequestCookies } from '@edge-runtime/cookies'


export async function getContacts(token, uid, query) {
    let response = await fetch(`https://hmbhs.schoolloop.com/mapi/contacts?studentID=${id}&q=${encodeURI(query)}`,
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
        const { query } = req.query


        if (!cookies.has('sl-token') || !cookies.has('sl-uid')) {
            return new Response('Not logged in', {status: 401})
        }

        if (!id) {
            return new Response('ID Required', {status: 400})
        }
        let token = cookies.get('sl-token')?.value
        let uid = cookies.get('sl-uid')?.value
        token = decodeURI(token)


        //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"

        let contacts = await getContacts(token, uid, query)



        return new Response(
            JSON.stringify(contacts),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                    "Cache-Control": `public; s-maxage=1200, stale-while-revalidate=1200`
                },
            }
        )
    } catch (e) {
        return new Response(`${e} | token: ${token} | uid: ${uid}`, {status: 500})
    }
}
