import Head from 'next/head'
import {Grid, Text, Button, Link, Spacer, Tooltip} from "@nextui-org/react";
import {getCookie, hasCookie} from "cookies-next";
import Back from "../../components/util/Back";
import {getMailMessage} from "../api/_sl/mail_message/[id]";
import NextLink from 'next/link';
import {useEffect, useState} from 'react';
import {useLocalStorage} from "@react-hooks-library/core";
import { useRouter } from 'next/router';
import {usePWA} from "../../components/util/usePWA";




export default function MailMessage(props) {


    let content;

    if (!hasCookie("sl-token")) {
        content = (<div>
            <Text h1>Error</Text>
            <Text>You probably don't have access to this message</Text>
            <Text small>{props.message}</Text>
        </div>)
    }

    const router = useRouter();



    useEffect(() => {
        if (!localStorage.getItem(`readMail.${getCookie("sl-uid")}.${props.mail?.messageID}`)) {
            localStorage.setItem(`readMail.${getCookie("sl-uid")}.${props.mail?.messageID}`, "true")
        }
    }, [])

    if (props.error) {
        content = (<div>
            <Text h1>Error</Text>
            <Text>{props.message}</Text>
        </div>)
    }

    const isPWA = usePWA()    //{inPwa ? null : ' - Looped'}


    if (props.mail) {
        //console.log(props.mail)

        let recipient = ''
        let listOfOthers = ''

        if (props?.mail?.recipientList) {
            if (props?.mail?.recipientList?.length > 1) {
                props.mail.recipientList.forEach((recipient, index) => {
                    if (index === 0) return
                    if (index === props.mail.recipientList.length - 1) {
                        listOfOthers += 'and '
                    }
                    listOfOthers += String(recipient.name).split(', ')[1] + ' ' + String(recipient.name).split(', ')[0] + (index === props.mail.recipientList.length - 1 ? '' : ', ')
                })
                recipient = recipient = String(props.mail.recipientList[0].name).split(', ')[1] + ' ' + String(props.mail.recipientList[0].name).split(', ')[0]
            } else {
                recipient = String(props.mail.recipientList[0].name).split(', ')[1] + ' ' + String(props.mail.recipientList[0].name).split(', ')[0]
            }
        } else {
            recipient = `Me`
        }

        content = (
            <div>
                <Head>
                    <title>LoopMail Message {isPWA ? null : ' - Looped'}</title>
                    <meta name="description" content={`Sent by ${props.mail.authorName}`} />
                </Head>
                <Grid.Container>
                    <Grid xs={12} css={{topMargin: "10px"}}>
                        <Text h1>{props.mail.subject}</Text>
                    </Grid>
                </Grid.Container>
                    <h3>Sent by {String(props.mail.sender.name).split(', ')[1] + ' ' + String(props.mail.sender.name).split(', ')[0]} on {new Date(parseInt(String(props.mail.date))).toLocaleDateString()} at {new Date(parseInt(String(props.mail.date))).toLocaleTimeString()} to {recipient} {listOfOthers.length > 1 && (<>and <Tooltip content={listOfOthers} placement={"right"}> {props.mail.recipientList.length - 1} others </Tooltip></>)}</h3>
                <p dangerouslySetInnerHTML={{__html: props.mail.message}}></p>
                {props.mail.links && props.mail.links.length > 0 && (
                    <div>
                        <Spacer y={1}/>
                            {props.mail.links.map((link) => (
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
            <Spacer y={2}/>
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query

    if (!hasCookie("sl-token", context)) {
        return {
            redirect: {
                destination: `/login?path=/mail/${encodeURI(id)}`,
                permanent: false
            }
        }
    }

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



