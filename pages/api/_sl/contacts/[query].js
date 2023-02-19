export const config = {
    runtime: 'edge', // this is a pre-requisite
    regions: ['sfo1'], // only execute this function on sfo1
};
import { RequestCookies } from '@edge-runtime/cookies'


export async function getContacts(token, uid, query) {
    let response = await fetch(`https://hmbhs.schoolloop.com/mapi/contacts?studentID=${uid}&q=${encodeURI(query)}`,
        {
            headers: {
                "Authorization": `Basic ${token}`
            }
        }
    )

    //console.log(response)

    if (!response.ok) {
        return []
    }

    response = await response.json()

    return response
}

export default async function handler(req, res) {
    let query = req.url.split('?')[1]
    query = new URLSearchParams(query).get('query')
    const cookies = new RequestCookies(req.headers)

    let token = cookies.get('sl-token').value
    let uid = cookies.get('sl-uid').value


    if (!cookies.has('sl-token') || !cookies.has('sl-uid')) {
        return new Response('Not logged in', {status: 401})
    }

    try {
        if (!uid) {
            return new Response('ID Required', {status: 400})
        }


        //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"

        let contacts = await getContacts(token, uid, query)



        return new Response(
            JSON.stringify(contacts),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                    "Cache-Control": `public`
                },
            }
        )
    } catch (e) {
        return new Response(`${e} | token: ${token} | uid: ${uid}`, {status: 500})
    }
}
