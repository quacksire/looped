import Head from 'next/head'
import {Grid, Text, Button} from "@nextui-org/react";
import {getCookie} from "cookies-next";
import Back from "../../components/util/Back";
import {getMailMessage} from "../api/_sl/mail_message/[id]";
import Link from 'next/link';
import { useEffect } from 'react';
import {useLocalStorage} from "@react-hooks-library/core";



export default function MailMessage(props) {
    let content;

    const [read, setRead] = useLocalStorage(
        'readMails',
        []
    )

    useEffect(() => {
        if (!read.includes(`${props.mail.id}`)) {
            setRead([...read, `${props.mail.id}`])
        }
    }, [])

    if (props.error) {
        content = (<div>
            <Text h1>Error</Text>
            <Text>{props.message}</Text>
        </div>)
    }


    if (props.mail) {
        console.log(props.mail)
        content = (
            <div>
                <Head>
                    <title>Looped - Mail</title>
                    <meta name="description" content={`Sent by ${props.mail.authorName}`} />
                </Head>
                <Grid.Container>
                    <Grid xs={0.75}>
                        <Back/>
                    </Grid>
                    <Grid xs={12} css={{topMargin: "10px"}}>
                        <Text h1>{props.mail.subject}</Text>
                    </Grid>
                </Grid.Container>
                    <h3>Sent by {props.mail.sender.name} on {new Date(parseInt(String(props.mail.date))).toLocaleDateString()}</h3>
                <p dangerouslySetInnerHTML={{__html: props.mail.message}}></p>
                {props.mail.links && props.mail.links.length > 0 && (
                    <div>
                            {props.mail.links.map((link) => (
                                <Link href={link.URL} target={'_blank'} referrerPolicy={"no-referrer"}>
                                    <Button light color="primary" auto>
                                        {link.Title}
                                    </Button>
                                </Link>
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

    // Cache it, cause I don't want to grab it again lol.
    context.res.setHeader(
        'Cache-Control',
        'private, s-maxage=604800'
    )

    let mail
    try {
        mail = await getMailMessage(getCookie('sl-token', context), getCookie('sl-uid', context), id);
        console.log(mail)
        return {
            props: {
                error: false,
                mail: mail
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



