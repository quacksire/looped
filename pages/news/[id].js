import Head from 'next/head'
import {Grid, Text, Button, Link} from "@nextui-org/react";
import { getArticle} from "../api/_sl/news/[id]";

import { RequestCookies } from '@edge-runtime/cookies'
import {getCookie, hasCookie} from "cookies-next";
import {NextRequest} from "next/server";
import {useRouter} from "next/router";
import Back from "../../components/util/Back";
import NextLink from 'next/link';
import {useEffect, useState} from "react";





export default function NewsArticle(props) {
    let content;

    if (props.error) {
        content = (<div>
            <Text h1>Error</Text>
            <Text>You probaly don't have access to this article</Text>
            <Text small>{props.message}</Text>
        </div>)
    }

    const [inPwa, setInPwa] = useState(false);
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setInPwa(true);
        }
    }, [])
    //{inPwa ? null : ' - Looped'}

    if (props.article) {

        content = (
            <div>
                <Head>
                    <title>{props.article.title}{inPwa ? null : ' - Looped'}</title>
                    <meta name="description" content={`Sent by ${props.article.authorName}`} />
                </Head>
                <Grid.Container>
                    <Grid xs={0.75}>
                        <Back/>
                    </Grid>
                    <Grid xs={12} css={{topMargin: "10px"}}>
                        <Text h1>{props.article.title}</Text>
                    </Grid>
                </Grid.Container>
                <h3>Sent by {props.article.authorName} on {new Date(parseInt(String(props.article.createdDate))).toLocaleDateString()}</h3>
                <p dangerouslySetInnerHTML={{__html: props.article.description}} style={{ color: 'white'}}></p>
                {props.article.links && props.article.links.length > 0 && (
                    <div>
                            {props.article.links.map((link) => (
                                <NextLink href={link.URL} passHref target={'_blank'} referrerPolicy={"no-referrer"}>
                                <Link isExternal color={"primary"}>
                                {link.Title}
                                </Link>
                                </NextLink>
                            ))}
                    </div>
                )}
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

    if (!hasCookie("sl-token", context)) {
        return {
            redirect: {
                destination: `/login?path=/news/${encodeURI(id)}`,
                permanent: false
            }
        }
    }

    // Cache it, cause I don't want to grab it again lol.
    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=604800'
    )



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



