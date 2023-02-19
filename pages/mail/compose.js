import {getCookie, hasCookie} from "cookies-next";
import {useCallback, useState, useEffect} from "react";
import {Input, Popover, Spacer, Table, Text, Grid} from "@nextui-org/react";
import {getContacts} from "../api/_sl/contacts/[query]";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export default function Compose(props) {
    const [subject, setSubject] = useState("New Message");
    const [to, setTo] = useState([]);
    const [toSearch, setToSearch] = useState("");
    const [cc, setCc] = useState([]);
    const [autocomplete, setAutocomplete] = useState([]);
    const [body, setBody] = useState("");



    const onToChange = useCallback(async (e) => {
        setToSearch(e.target.value)

            try {
                let contacts = await axios.get('/api/_sl/contacts/' + e.target.value)
                if (contacts.status !== 200) {
                    setAutocomplete([])
                    return
                }

                setAutocomplete(contacts.data)
                console.log(contacts.data)
            } catch (e) {
                console.log(e)
                setAutocomplete([])
            }


        }, []);


    useEffect(() => {
        console.log(new Set(to))

        const iterator1 = new Set(to).values();

        for (let i = 0; i < new Set(to).size; i++) {
            console.log(iterator1.next().value)
        }
    }, [to]);


    return (
        <>
        <Text h1>{subject}</Text>
            <Spacer y={1} />
            <Grid.Container gap={2}>
                {to.size > 0 && (
                    <Grid xs={12}>
                        <Text h3>To:</Text>
                        <Spacer y={0.5} />
                        <Text h3>{ new Set(to).keys()}</Text>
                    </Grid>
                )}
                <Grid xs={12}>
                    <Input
                        id="to"
                        clearable
                        bordered
                        labelPlaceholder="To:"
                        initialValue=""
                        onChange={onToChange}
                        onFocus={(e) => {
                            console.log("focus")
                        }}
                        aria-label="To"
                    />
                </Grid>

            </Grid.Container>



            <Spacer y={1} />
            <Table
                width={"25%"}
                selectionMode={"multiple"}
               onSelectionChange={(key) => {
                    console.log(key.currentKey)

                   const iterator2 = new Set(key).values();
                   let newKeys = []
                   for (let i = 0; i < new Set(to).size; i++) {
                          newKeys.push(String(iterator2.next().value).split("__")[0])
                   }

                   console.log(newKeys)
                   setTo(newKeys)
               }}

            >
                <Table.Header>
                    <Table.Column>
                        Name
                    </Table.Column>
                    <Table.Column>
                        Role
                    </Table.Column>

                </Table.Header>
                <Table.Body>
                    {autocomplete.map((contact) => (
                        <Table.Row key={`${contact.name}__${uuidv4()}`} aria-label={`${contact.name}`}>
                            <Table.Cell>
                                {contact.name}
                            </Table.Cell>
                            <Table.Cell>
                                {contact.role} {contact.desc ? `- ${contact.desc}` : ""}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )


}
export async function getServerSideProps(context) {
    const { to } = context.query

    if (!hasCookie("sl-token", context)) {
        return {
            redirect: {
                destination: `/login?path=/mail/compose`,
                permanent: false
            }
        }
    }

    // Cache it, cause I don't want to grab it again lol.
    context.res.setHeader(
        'Cache-Control',
        'private, s-maxage=604800'
    )

    return {
        props: {
            to: to || null
        }
    }

}
