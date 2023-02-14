import { Card, Text, Table, Grid, Link } from "@nextui-org/react";
import { hasCookie } from "cookies-next";
import useSWR from "swr";
import { fetcher } from "../../libs/sl";
import No from "../util/no";
import Load from "../util/Loading";
import { CardStackIcon } from "@radix-ui/react-icons";
export default function GradesCard() {
    if (!hasCookie('sl-token') || !hasCookie('sl-uid')) {
        return null;
    }

    const columns = [
        {
            key: 'period',
            label: '',
        },
        {
            key: "courseName"
        },
        {
            key: "grade",
            label: "",
        },
        {
            key: "teacherName",
            label: "",
        }
    ];



    const { data, error } = useSWR('/api/_sl/courses', fetcher)
    let gradeElement = <Load />
    let rows = []
    if (error) gradeElement = <Text>Failed to load</Text>
    if (data) {
        if (data.length > 0) {
            gradeElement = data.map((course, index) => {

                let g = (course.grade != "null") ? `${String(course.grade) + ' '.repeat(4 - String(course.grade).length)}` : null
                if (g == null) {
                    return null
                }

                return (
                    <Link href={`/class/${course.periodID}`} key={`class-${course.periodID}`}>
                        <Card isPressable variant="flat" css={{ p: "5px" }}>
                            <Card.Header>
                                <Text h3 css={{ display: "flex" }}>{g}</Text>
                                <Grid.Container css={{ pl: "$6" }}>
                                    <Grid xs={12}>
                                        <Text h4 css={{ lineHeight: "$xs" }}>
                                            {course.courseName}
                                        </Text>
                                    </Grid>
                                    <Grid xs={12}>
                                        <Text css={{ color: "$accents8" }}>{course.teacherName}</Text>
                                    </Grid>
                                </Grid.Container>
                            </Card.Header>
                        </Card>
                    </Link>
                )


                /*
                return {
                    period: course.period,
                    courseName: course.courseName,
                    key: course.periodID,
                    grade: g,
                    teacherName: course.teacherName
                }
                *.
                 */
            })
        } else {
            gradeElement = <No thing={"Classes"} />
        }

    }

    return (<Card isHoverable variant="flat" css={{ minWidth: "250px", maxHeight: "auto", maxWidth: "100%", height: 'min-content' }} >
        <Card.Header css={{ marginBottom: "-20px", position: "relative" }}>
            <Text b css={{ userSelectable: "none" }}>Current Grades</Text>
        </Card.Header>
        <Card.Body css={{ marginBottom: "-30px", paddingLeft: 20 }}>
            {gradeElement}
        </Card.Body>

    </Card>)
}
