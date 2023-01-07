import useSWR from 'swr'
import {Dropdown, Link, Navbar, Table} from '@nextui-org/react';

import {useRouter} from "next/router";
import {fetcher} from "../libs/sl";
export default function MailView(props) {
    const {data, error} = useSWR('/api/_sl/mail_messages', fetcher)

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    let table = data.map((mail) => (
        <Table.Row
            key={mail.ID}
        >
            <Table.Cell>{mail.subject}</Table.Cell>
            <Table.Cell>{mail.sender.name}</Table.Cell>
            <Table.Cell>{new Date((parseInt(mail.date) / 1000).toFixed(0)).toLocaleString()}</Table.Cell>
        </Table.Row>
    ))

    return (<Table
        aria-label="Example static collection table"
        compact
        selectionMode="single"
        css={{zIndex: '1'}}
    >
        <Table.Header>
            <Table.Column>Subject</Table.Column>
            <Table.Column>From</Table.Column>
            <Table.Column>Sent</Table.Column>
        </Table.Header>
        <Table.Body>
            {table}
    </Table.Body>
    </Table>)
}
