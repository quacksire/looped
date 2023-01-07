import {Card, Loading, Text, Table} from "@nextui-org/react";
import {hasCookie} from "cookies-next";
import useSWR from "swr";
import {fetcher} from "../../libs/sl";

export default function NewsCard() {
    if (!hasCookie('sl-token') || !hasCookie('sl-uid')) {
        return null;
    }

    const columns = [
        {
            key: "title",
            label: "Title",
        },
    ];



    const {data, error} = useSWR('/api/_sl/news', fetcher)
    let newsElement = <Loading />
    let rows = []
    if (error) newsElement = <Text>Failed to load</Text>
    if (data) {
        if (data.length > 0) {
            rows = data.map((news, index) => {
                if (index >= 5) return null;
                return {
                    title: news.title,
                    date: news.createdDate,
                    key: news.iD
                }
            })
            newsElement = null
        } else {
            newsElement = <Text>No news</Text>
        }

    }

    return (<Card isHoverable variant="flat" css={{ minWidth: "250px", height: "auto", manWidth: "80%"}}>
        <Card.Header css={{ marginBottom: "-50px", position: "relative"}}>
            <Text b>News</Text>
        </Card.Header>
        <Card.Body css={{alignItems: "center", marginBottom: "-30px", position: "relative"}}>
            {newsElement ? newsElement : (
                <Table css={{height: "auto", manWidth: "80%", overflow: "hidden", textOverflow: "ellipsis"}}>
                    <Table.Header columns={columns}>
                        {(column) => (
                            <Table.Column key={column.key} css={{height: "0px", topPadding: "-20px", overflow: "hidden", textOverflow: "ellipsis"}}></Table.Column>
                        )}
                    </Table.Header>
                    <Table.Body items={rows}>
                        {(item) => (
                            <Table.Row key={item.key}>
                                {(columnKey) => <Table.Cell css={{ overflow: "hidden", textOverflow: "ellipsis"}}>{item[columnKey]}</Table.Cell>}
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            )}
        </Card.Body>

    </Card>)
}
