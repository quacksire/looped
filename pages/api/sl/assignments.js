import {getCookie, getCookies, hasCookie} from "cookies-next";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

export default async function handler(req, res) {
    if (!hasCookie('sl-token', {req, res}) || !hasCookie('sl-uid', {req, res})) {
        res.status(401).json({error: "Not logged in"});
        return;
    }
    //"https://\(domainName)/mapi/report_card?studentID=\(studentID)"

    res.setHeader('cache-control', `s-maxage=1200, stale-while-revalidate=600`);

    let response = await fetch(`https://hmbhs.schoolloop.com/mapi/assignments?studentID=${getCookie('sl-uid', {req, res})}`,
        {
            headers: {
                authorization: `Basic ${getCookie('sl-token', {req, res})}`
            }
        }
    )
    response = await response.json()

    res.status(200).json(response)
}
