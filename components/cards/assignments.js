import {Card, Checkbox, Text, Grid, Spacer} from "@nextui-org/react";
import {hasCookie} from "cookies-next";
import useSWR from "swr";
import {fetcher} from "../../libs/sl";
import {useEffect, useState} from "react";
import No from "../util/no";
import Load from "../util/Loading";

export default function AssignmentCard() {
    if (!hasCookie('sl-token') || !hasCookie('sl-uid')) {
        return null;
    }
    const [selected, setSelected] = useState([]);


    useEffect(() => {
        return () => {
            setSelected(JSON.parse(localStorage.getItem('finishedAssignments')))
        };
    }, []);


    useEffect(() => {
        localStorage.setItem('finishedAssignments', JSON.stringify(selected));
    }, [selected]);



    const {data, error} = useSWR('/api/_sl/assignments', fetcher)



    let assignments = <Load />
    if (error) assignments = <Text>Failed to load</Text>
    if (data) {
        if (data.length > 0) {
            assignments = data.map((assignment) => {
                if (new Date(parseInt(String(assignment.dueDate))).getUTCSeconds <= new Date().getUTCSeconds()) return null
                let due;
                switch (new Date(parseInt(String(assignment.dueDate))).toLocaleDateString()) {
                    case new Date().toLocaleDateString():
                        due = 'Due today'
                        break
                    case new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString():
                        due = '>Due tomorrow'
                        break
                    case new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString():
                        due = 'Due in two days'
                        break
                    case new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString():
                        due = 'Due in three days'
                        break
                    case new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString():
                        due = 'Due in four days'
                        break
                    case new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString():
                        due = 'Due in five days'
                        break
                    case new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString():
                        due = 'Due in six days'
                        break
                    default:
                        return null
                }



               return (
                   <>
                       { selected.includes(assignment.iD) ? (
                           <Checkbox isRounded defaultSelected value={assignment.iD}>
                               <Grid.Container css={{ pl: "$6" }}>
                                   <Grid xs={12}>
                                       <Text css={{ lineHeight: "10px" }}>
                                           <Text del size="$md" css={{ color: "$accents8" }}>{assignment.courseName} - {assignment.title}</Text>
                                       </Text>
                                   </Grid>
                                   <Grid xs={6}>
                                       <Text del size="$xs" css={{ color: "$accents8" }}>{due}</Text>
                                   </Grid>
                               </Grid.Container>
                           </Checkbox>
                           ) : (<Checkbox isRounded lineThrough value={assignment.iD}>
                               <Grid.Container css={{ pl: "$6" }}>
                                   <Grid xs={12}>
                                       <Text css={{ lineHeight: "10px" }}>
                                           <Text size="$md">{assignment.courseName} - {assignment.title}</Text>
                                       </Text>
                                   </Grid>
                                   <Grid xs={6}>
                                       <Text size="$xs">{due}</Text>
                                   </Grid>
                               </Grid.Container>
                       </Checkbox>
                       )}
                   </>
               )
           })
       } else {
            let assignments = <No thing={"Assignments"} />
       }
    }

    return (<Card isHoverable variant="flat" css={{ minWidth: "250px", height: "auto"}}>
        <Card.Header css={{ marginBottom: "-20px", position: "relative"}}>
            <Text b css={{alignItems: "center", position: "flex"}}>Assignments</Text>
        </Card.Header>
        <Card.Body css={{alignItems: "center"}}>
            <Checkbox.Group
                color="success"
                value={selected}
                onChange={setSelected}
            >
                {assignments}
            </Checkbox.Group>
        </Card.Body>

    </Card>)
}