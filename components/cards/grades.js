import {Card, Loading, Text, Table} from "@nextui-org/react";
import {hasCookie} from "cookies-next";
import useSWR from "swr";
import {fetcher} from "../../libs/sl";

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



    const {data, error} = useSWR('/api/_sl/courses', fetcher)
    let gradeElement = <Loading />
    let rows = []
    if (error) gradeElement = <Text>Failed to load</Text>
    if (data) {
        if (data.length > 0) {
            rows = data.map((course, index) => {
                let g = (course.grade != "null") ? `${course.grade} (${course.score})` : ''
                return {
                    period: course.period,
                    courseName: course.courseName,
                    key: course.periodID,
                    grade: g,
                    teacherName: course.teacherName
                }
            })
            gradeElement = null
        } else {
            gradeElement = <Text>No Classes</Text>
        }

    }

    return (<Card isHoverable variant="flat" css={{ minWidth: "250px"}} >
        <Card.Header css={{ marginBottom: "-50px", position: "relative"}}>
            <Text b css={{ userSelectable: "none"}}>Classes</Text>
        </Card.Header>
        <Card.Body css={{alignItems: "center", marginBottom: "-30px"}}>
            {gradeElement ? gradeElement : (
                <Table css={{ marginTop: "-10px", position: "relative"}}>
                    <Table.Header columns={columns}>
                        {(column) => (
                            <Table.Column key={column.key} css={{height: "0px", topPadding: "-20px"}}></Table.Column>
                        )}
                    </Table.Header>
                    <Table.Body items={rows}>
                        {(item) => (
                            <Table.Row key={item.key}>
                                <Table.Cell> <Text small > {item.period} </Text></Table.Cell>
                                <Table.Cell>{item.courseName}</Table.Cell>
                                <Table.Cell>{item.grade}</Table.Cell>
                                <Table.Cell>{item.teacherName}</Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            )}
        </Card.Body>

    </Card>)
}
