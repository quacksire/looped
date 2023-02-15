import Head from 'next/head'
import {Card, Container, Grid, Text, Badge, Spacer, User} from "@nextui-org/react";
import {getCookie, hasCookie} from "cookies-next";
import Back from "../../components/util/Back";
import {getCourse} from "../api/_sl/course/[id]";
import {useEffect, useState} from "react";
import {usePWA} from "../../components/util/usePWA";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import {Line} from "victory";
import {ClockIcon} from "@radix-ui/react-icons";
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

    const RADIAN = Math.PI / 180;




    //https://hmbhs.schoolloop.com/loopmail/student_loop?&student_id=1593846838236&tourse_id=1660027318403


    if (props.course) {
        if (props.course.date) props.course.lastUpdated = `${new Date(props.course.date).toDateString()} ${new Date(props.course.date).toLocaleTimeString()}`
        const renderCustomizedCategoryLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
                <text x={x} y={y} fill={`var(--nextui-colors-text)`} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${percent === 99 ? `Assignemnt` : `${String(props.course.categories[index].name)}`}`}
                </text>
            );

        };

        console.log(props.course.categories)
        console.log(props.course)
        content = (
            <div>
                <Head>
                    <title>{props.course.course.name || 'My Class'}</title>
                    <meta name="description" content={`My ${props.course.course.name} class`}/>
                </Head>
                <Grid.Container>
                    <Grid xs={12} css={{topMargin: "10px"}}>
                        <Text h1>{props.course.course.name} {/**/}</Text>
                    </Grid>
                    <Grid>
                        <Text h5 color={"gray100"}><ClockIcon style={{topMargin: "10px"}}/> {props.course.lastUpdated}</Text>
                    </Grid>
                </Grid.Container>
                {/*"trendScores":[{"numberOfZeros":"2","dropped":"false","studentID":"1593846838236","grade":"F","periodID":"1660388478922","standardsBased":"false","score":"0.33","markIDString":"current","tourseID":"1376458793022","teacherID":"1102472042704","dayID":"1673337600000","ID":"1671985805968"},*/}


                <Spacer y={0.5}/>

                <Grid.Container gap={4}>
                    <Grid>
                        <Card variant={'flat'} css={{minWidth: "350px", maxWidth: "min-content", height: "min-content", backgroundColor: "var(--nextui-colors-background)"}}>
                            <Card.Header>
                                <Text h3>Grade</Text>
                            </Card.Header>
                            <Grid.Container gap={0.1} alignItems={"center"}>
                                <Grid><Spacer x={7.25}></Spacer> </Grid>
                                <Grid>
                                    <Text h1 css={{
                                        textGradient: "45deg, $blue600 -20%, $pink600 50%",
                                    }}
                                          weight="bold">{props.course.grade}</Text>
                                </Grid>
                            </Grid.Container>
                            <Card.Divider/>
                            <Spacer y={-2} />
                            <Container>
                                {props.course?.categories?.length > 0 && (
                                    <ResponsiveContainer width='100%' height={300} style={{zIndex: "1000" }}>
                                        <PieChart width={'50%'} height={'50%'}>
                                            <Pie data={props.course.categories} dataKey={(category) => { return (category.weight !== "0.0") ? category.weight * 100 : 100}} nameKey={"name"} cx="50%" cy="50%" outerRadius={100} label={renderCustomizedCategoryLabel} labelLine={false}>
                                                {
                                                    props.course.categories.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={`var(--nextui-colors-${colors[index]})`} strokeWidth={0.5} stroke={"var(--nextui-colors-backgroundContrast)"}/>
                                                    ))
                                                }
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                                <Spacer y={-2} />
                                {props.course?.categories?.length > 0 && (
                                    <Grid.Container gap={2}>
                                        {props.course.categories.map((category, index) => {
                                            return (
                                                <Grid xs={12} key={category.name}>
                                                    <Badge color={colors[index]} disableOutline variant="flat" css={{display: "flex"}}>{parseFloat((category.weight != "0.0") ? category.weight : "1.00").toFixed(2) * 100}%</Badge>
                                                    <Grid.Container css={{pl: "$6"}}>
                                                        <Grid xs={12}>
                                                            <Text>
                                                                {category.name}
                                                            </Text>
                                                        </Grid>
                                                    </Grid.Container>
                                                    <Text>
                                                        {parseFloat(category.score).toFixed(2) * 100}%
                                                    </Text>
                                                </Grid>
                                            )
                                        })}
                                    </Grid.Container>
                                )}
                                <Card.Divider/>
                                <Grid.Container gap={2}>
                                    <Grid xs={12}>
                                        <Grid.Container css={{pl: "$6"}}>
                                            <Grid xs={12}>
                                                Grade:
                                            </Grid>
                                        </Grid.Container>
                                        <Text>
                                            {parseFloat(props.course.score).toFixed(2) * 100}%
                                        </Text>
                                    </Grid>
                                </Grid.Container>



                                {/*props.course?.categories?.length > 0 ? props.course.categories?.map((category, index) => {
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
                        }) : <Text>No Grading Scale</Text> */}
                            </Container>
                        </Card>
                    </Grid>


                    <Grid>
                <Card variant={'flat'} css={{ minHeight: "140px", minWidth: "min-content", maxWidth: "max-content", backgroundColor: "var(--nextui-colors-background)"}}>
                    <Card.Header>
                        <Text h3>Past Assignments</Text>
                    </Card.Header>
                    <Container>
                        {props.course?.grades?.length > 0 ? props.course.grades.map((grade, index) => {
                            let colorBadge = colors[props.course?.categories?.findIndex((category) => category.name === grade.assignment.categoryName)]

                            return (
                                <Card variant="flat" css={{p: "5px"}} key={grade.systemID} style={{backgroundColor: "var(--nextui-colors-background)"}}>
                                    <Card.Header>
                                        <Text b css={{display: "flex", width: "50px"}}>{grade.score === '0.00' ? (
                                        <Badge enableShadow disableOutline color={'error'}>0%</Badge>
                                        ) : `${parseInt(grade.percentScore).toFixed(0) != 'NaN' ? `${parseInt(grade.percentScore).toFixed(0)}%` : "-"}`}</Text>
                                        <Grid.Container css={{pl: "$6", width: "300px"}}>
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

                    <Card variant="flat" css={{ height: "max-content", minWidth: "min-content", maxWidth: "min-content", backgroundColor: "var(--nextui-colors-background)"}}>
                        <Spacer y={1.125} />
                        <Container>
                            <Spacer y={0.5} />
                            <User
                                size="lg"
                                src={`https://api.dicebear.com/5.x/bottts/svg?seed=${props.course.teacher.systemID}`}
                                name={String(props.course.teacher.name).split(', ')[1] + ' ' + String(props.course.teacher.name).split(', ')[0]}
                            >
                                <User.Link href="https://nextui.org/">Send A Loopmail</User.Link>
                            </User>
                        </Container>
                    </Card>


                </Grid.Container>
                {/*JSON.stringify(props.course)*/}
            </div>
        )
    }


    return (
        <Container>
            <Grid>
                {content}
            </Grid>
        </Container>
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
