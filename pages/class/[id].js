import Head from 'next/head'
import {Grid, Text} from "@nextui-org/react";
import { getArticle} from "../api/_sl/news/[id]";

import { RequestCookies } from '@edge-runtime/cookies'
import {getCookie, hasCookie} from "cookies-next";
import {NextRequest} from "next/server";
import {useRouter} from "next/router";
import Back from "../../components/util/Back";
import {getCourse} from "../api/_sl/course/[id]";





export default function NewsArticle(props) {
    let content;

    if (props.error) {
        content = (<div>
            <Text h1>Error</Text>
            <Text>{props.message}</Text>
        </div>)
    }


    if (props.course) {
        if (props.course.date) props.course.lastUpdated = `${new Date(props.course.date).toDateString()} ${new Date(props.course.date).toLocaleTimeString()}`
        content = (
            <div>
                <Head>
                    <title>Looped - {props.course.courseName}</title>
                    <meta name="description" content={`My ${props.course.courseName} class`} />
                </Head>
                <Grid.Container>
                    <Grid xs={0.75}>
                        <Back/>
                    </Grid>
                    <Grid xs={12} css={{topMargin: "10px"}}>
                        <Text h1>{props.course.courseName}</Text>
                    </Grid>
                </Grid.Container>
                <h3>{props.course.teacherName}</h3>
                <h5>Last Updated on {props.course.lastUpdated}</h5>
                <small>Coming soon</small>

                ignore this:
                {JSON.stringify(props.course)}
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
        'private, s-maxage=4800'
    )

    let course;
    try {
        course = await getCourse(getCookie('sl-token', context), getCookie('sl-uid', context), id);
        return {
            props: {
                error: false,
                course: course
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
