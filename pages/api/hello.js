// Next.js API route support: https://nextjs.org/docs/api-routes/introduction



import {getCookies} from "cookies-next";

export default function handler(req, res) {
  res.status(200).json(getCookies({req, res}))
}
