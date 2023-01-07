import {getCookie} from "cookies-next";


export const fetcher = (url) => fetch(url, {
    headers: {
        'X-SL-User': `${getCookie('sl-token')}:${getCookie('sl-uid')}`
    },
    }).then((res) => res.json());
