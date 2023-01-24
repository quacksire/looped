import Head from 'next/head'
import {Card, Container, Grid, Text} from "@nextui-org/react";
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
                    <title>{props.course.course.name || 'My Class'} - Looped</title>
                    <meta name="description" content={`My ${props.course.course.name} class`} />
                </Head>
                <Grid.Container>
                    <Grid xs={0.75}>
                        <Back/>
                    </Grid>
                    <Grid xs={12} css={{topMargin: "10px"}}>

                    </Grid>
                </Grid.Container>
                <Text h1>{props.course.course.name} with {String(props.course.teacher.name).split(', ')[1] + ' ' + String(props.course.teacher.name).split(', ')[0]}</Text>
                <h5>Last Updated on {props.course.lastUpdated}</h5>



                <Card>
                    <Card.Header>
                        <Text h3>Past Assignments</Text>
                    </Card.Header>
                    <Card.Divider />
                    <Container>
                        {props.course?.grades?.length > 0 ? props.course.grades.map((grade, index) => {
                            return (
                                <Card variant="flat" css={{ p: "5px" }}>
                                    <Card.Header>
                                        <Text b css={{display: "flex"}}>{grade.percentScore}</Text>
                                        <Grid.Container css={{ pl: "$6" }}>
                                            <Grid xs={12}>
                                                <Text css={{ lineHeight: "$xs" }}>
                                                    {grade.assignment.title}
                                                </Text>
                                            </Grid>
                                            <Grid xs={12}>
                                                <Text css={{ color: "$accents8" }}>{new Date(grade.assignment.dueDate).toLocaleDateString()}</Text>
                                            </Grid>
                                        </Grid.Container>
                                    </Card.Header>
                                </Card>
                            )
                        }) : <Text>No grades</Text>}


                    </Container>

                </Card>
                {JSON.stringify(props.course.grades)}
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
