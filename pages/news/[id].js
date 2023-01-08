import Head from 'next/head'
import {Text} from "@nextui-org/react";
import { getArticle} from "../api/_sl/news/[id]";

import { RequestCookies } from '@edge-runtime/cookies'
import {getCookie, hasCookie} from "cookies-next";
import {NextRequest} from "next/server";
import {useRouter} from "next/router";





export default function NewsArticle(props) {
    let content;

    if (props.error) {
        content = (<div>
            <Text h1>Error</Text>
            <Text>{props.message}</Text>
        </div>)
    }


    if (props.article) {

        content = (
            <div>
                <Head>
                    <title>Looped - {props.article.title}</title>
                    <meta name="description" content={`Sent by ${props.article.authorName}`} />
                </Head>
                <h1>{props.article.title}</h1>
                <h3>Sent by {props.article.authorName} on {new Date(parseInt(String(props.article.createdDate))).toLocaleDateString()}</h3>
                <p dangerouslySetInnerHTML={{__html: props.article.description}}></p>
            </div>
        )
    }

    return (
        <div>
            {content}
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query


    let article
    try {
        article = await getArticle(getCookie('sl-token', context), getCookie('sl-uid', context), id);
        return {
            props: {
                error: false,
                article: article
            }, // will be passed to the page component as props
        }
    } catch (e) {
        return {
            props: {
                error: true,
                message: e.message
            }
        }
    }







}


