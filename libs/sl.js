import {getCookie} from "cookies-next";
import axios from "axios";
export const fetcher = (url) =>
    axios
        .get(url, { headers: {
                'X-SL-User': `${getCookie('sl-token')}:${getCookie('sl-uid')}`
            }})
        .then((res) => res.data);


