// Create React Component

import { Card, Spacer, Text } from "@nextui-org/react";
import { hasCookie } from "cookies-next";
import useSWR from "swr";
import { fetcher } from "../../libs/sl";
import Load from "../util/Loading";
import {Cell, Label, LabelList, Pie, PieChart, ResponsiveContainer} from "recharts";
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory';
import {useState} from "react";

export default function GPACard() {
    if (!hasCookie('sl-token') || !hasCookie('sl-uid')) {
        return null;
    }
    const { data, error } = useSWR('/api/_sl/courses', fetcher)
    let gpaElement = <Load />

    const [load, setLoad] = useState(true);

    if (error) gpaElement = <Text>Failed to load</Text>
    if (!data) gpaElement = <Load />

    if (data) {

        let gpaText = 0.0
        let simplified = 0.0
        let color = 'error';
        let gpa = 0
        let trueCourseCount = 0
        data.forEach((course) => {
            if (parseFloat(String(course.score).split('%')[0])) {
                gpa += parseFloat(String(course.score).split('%')[0])
                //console.log(parseFloat(String(course.score).split('%')[0]))
                trueCourseCount++
            }
        })

        gpaText = gpa / trueCourseCount
        simplified = ((((gpa / trueCourseCount) - 50) / 10).toFixed(1) - 0.5)
        simplified = simplified.toFixed(1);
        //console.log(simplified, gpaText, gpa, trueCourseCount)
        if (simplified >= 3.0 && simplified <= 4.5) {
            color = 'success'
        } else if (simplified <= 2.0) {
            color = 'error'
        } else if (simplified >= 4.5) {
            color = 'secondary'
        } else {
            color = 'error'
        }
        let chart = [{name: "GPA", value: gpaText}, {name: "GPA", value: 150 - gpaText}]
        gpaElement = (
            <Text h1 color={color}>
                {simplified}
            </Text>
        )
    }


    return (<Card isHoverable variant="flat" css={{ minWidth: "25px", maxWidth: "100%", height: "min-content", backgroundColor: "var(--nextui-colors-background)" }}>
        <Card.Header>
            <Text b>GPA</Text>
        </Card.Header>
        <Card.Body css={{ alignItems: "center" }}>
            {gpaElement}
        </Card.Body>
        <Card.Footer>
            <Text small>Calculated as an average from your grades</Text>
        </Card.Footer>
    </Card>)
}
