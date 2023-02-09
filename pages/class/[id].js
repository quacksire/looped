import Head from 'next/head'
import {Card, Container, Grid, Text, Badge, Spacer} from "@nextui-org/react";
import {getCookie, hasCookie} from "cookies-next";
import Back from "../../components/util/Back";
import {getCourse} from "../api/_sl/course/[id]";
import {useEffect, useState} from "react";
import {usePWA} from "../../components/util/usePWA";
export default function NewsArticle(props) {
    let content;
    if (props.error) {
        content = (<div>
            <Text h1>Error</Text>
            <Text>You probaly aren't in this class.</Text>
            <Text small>{props.message}</Text>
        </div>)
    }

    const isPWA = usePWA()
    //{inPwa ? null : ' - Looped'}

    const colors = ["primary", "secondary", "success", "error", "warning", "info", "dark", "light", "neutral"]

    if (props.course) {
        if (props.course.date) props.course.lastUpdated = `${new Date(props.course.date).toDateString()} ${new Date(props.course.date).toLocaleTimeString()}`
        content = (
            <div>
                <Head>
                    <title>{props.course.course.name || 'My Class'}</title>
                    <meta name="description" content={`My ${props.course.course.name} class`}/>
                </Head>
                <Grid.Container>
                    <Grid xs={12} css={{topMargin: "10px"}}>

                    </Grid>
                </Grid.Container>
                <Text
                    h1>{props.course.course.name} with {String(props.course.teacher.name).split(', ')[1] + ' ' + String(props.course.teacher.name).split(', ')[0]}</Text>
                <h5>Last Updated on {props.course.lastUpdated}</h5>

                <Grid.Container gap={2}>
                    <Grid>
                <Card css={{ maxWidth: "700px", minHeight: "200px"}}>
                    <Card.Header>
                        <Text h3>Past Assignments</Text>
                    </Card.Header>
                    <Card.Divider/>
                    <Container>
                        {props.course?.grades?.length > 0 ? props.course.grades.map((grade, index) => {
                            let colorBadge = colors[props.course?.categories?.findIndex((category) => category.name === grade.assignment.categoryName)]

                            return (
                                <Card variant="flat" css={{p: "5px"}} key={grade.systemID}>
                                    <Card.Header>
                                        <Text b css={{display: "flex"}}>{grade.percentScore}</Text>
                                        <Grid.Container css={{pl: "$6"}}>
                                            <Grid xs={12}  css={{minWidth: "60px"}}>
                                                <Text css={{lineHeight: "$xs"}}>
                                                    {grade.assignment.title}

                                                </Text>
                                            </Grid>
                                            <Spacer y={0.1} />
                                            <Grid xs={12}>
                                                <Badge disableOutline variant="flat" color={colorBadge}>
                                                    {grade.assignment.categoryName}
                                                </Badge>
                                                <Spacer x={0.5}/>
                                                <Text
                                                    css={{color: "$accents8"}}>{new Date(grade.assignment.dueDate).toLocaleDateString()}</Text>

                                            </Grid>
                                        </Grid.Container>
                                    </Card.Header>
                                </Card>
                            )
                        }) : <Text>No grades</Text>}
                    </Container>
                </Card>
                    </Grid>
                    <Grid>
                <Card css={{ maxWidth: "300px", minHeight: "200px"}}>
                    <Card.Header>
                        <Text h3>Categories</Text>
                    </Card.Header>
                    <Card.Divider/>
                    <Container>
                        {props.course?.categories?.length > 0 ? props.course.categories?.map((category, index) => {
                            return (
                                <Card variant="flat" css={{p: "5px"}} key={category.name}>
                                    <Card.Header>
                                        <Badge color={colors[index]} disableOutline variant="flat" css={{display: "flex"}}>{parseFloat(category.weight).toFixed(2) * 100}%</Badge>
                                        <Grid.Container css={{pl: "$6"}}>
                                            <Grid xs={12}>
                                                <Text css={{lineHeight: "$xs"}}>
                                                    {category.name}
                                                </Text>
                                            </Grid>
                                            <Grid xs={12}>
                                                <Text css={{lineHeight: "$xs"}}>
                                                    Current: {parseFloat(category.score).toFixed(2) * 100}%
                                                </Text>
                                            </Grid>
                                        </Grid.Container>
                                    </Card.Header>
                                </Card>
                            )
                        }) : <Text>No Grading Scale</Text>}
                    </Container>
                </Card>
                        <Spacer y={1}/>
                        <Card css={{ maxWidth: "300px", minHeight: "200px"}}>
                            <Card.Header>
                                <Text h3>Scale</Text>
                            </Card.Header>
                            <Card.Divider/>
                            <Container>
                                {props.course?.GradingScale?.Cutoffs.length > 0 ? props.course.GradingScale?.Cutoffs.map((cutoff, index) => {
                                    let equalNameSpacing = 10 - cutoff.Name.length



                                    return (
                                        <Card variant="flat" css={{p: "5px"}} key={cutoff.Name}>
                                            <Card.Header>
                                                <Text b css={{maxWidth: "10px"}}>{cutoff.Name + ' '.repeat(equalNameSpacing)}</Text>
                                                <Spacer x={0.5}/>
                                                <Grid.Container css={{pl: "$6"}}>
                                                    <Grid xs={12}>
                                                        <Text css={{lineHeight: "$xs"}}>
                                                            {parseFloat(cutoff.Start).toFixed(0)}%
                                                        </Text>
                                                    </Grid>
                                                    {cutoff.description != 'null' && <Grid xs={12}>
                                                        <Text css={{lineHeight: "$xs"}}>
                                                            {cutoff.description}
                                                        </Text>
                                                    </Grid>}
                                                </Grid.Container>
                                            </Card.Header>
                                        </Card>
                                    )
                                }) : <Text>No Grading Scale</Text>}
                            </Container>
                        </Card>
                    </Grid>

                </Grid.Container>
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

    if (!hasCookie("sl-token", context)) {
        return {
            redirect: {
                destination: `/login?path=/class/${encodeURI(id)}`,
                permanent: false
            }
        }
    }

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
