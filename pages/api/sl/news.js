import {getCookie, getCookies, hasCookie} from "cookies-next";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
export const config = {
    runtime: 'edge',
}
export default async function handler(req, res) {
    if (!hasCookie('sl-token', {req, res}) || !hasCookie('sl-uid', {req, res})) {
        return new Response('Not logged in', {status: 401})
    }
    //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"

    res.setHeader('cache-control', `s-maxage=1200, stale-while-revalidate=600`);

    let response = await fetch(`https://hmbhs.schoolloop.com/mapi/news?studentID=${getCookie('sl-uid', {req, res})}`,
        {
            headers: {
                authorization: `Basic ${getCookie('sl-token', {req, res})}`
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
