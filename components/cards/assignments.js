import {Card, Loading, Checkbox, Text, Grid, Spacer} from "@nextui-org/react";
import {hasCookie} from "cookies-next";
import useSWR from "swr";
import {fetcher} from "../../libs/sl";
import {useEffect, useState} from "react";

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



    let assignments = <Loading />
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
                           <Checkbox isRounded defaultSelected lineThrough value={assignment.iD}>
                               <Text size="$md">{assignment.courseName} - {assignment.title}</Text>
                               <Spacer y={0.5} />
                               <Text size="$xs">{due}</Text>
                           </Checkbox>
                           ) : (<Checkbox isRounded lineThrough value={assignment.iD}>
                           <Text size="$md">{assignment.courseName} - {assignment.title}</Text>
                           <Spacer y={0.5} />
                           <Text size="$xs">{due}</Text>
                       </Checkbox>
                       )}
                   </>
               )
           })
       } else {
            let assignments = <Text>No assignments</Text>
       }
    }

    return (<Card isHoverable variant="flat" css={{ minWidth: "250px"}}>
        <Card.Header css={{ marginBottom: "-20px", position: "relative"}}>
            <Text b>Assignments</Text>
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
