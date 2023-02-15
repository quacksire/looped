import { Card, Text, Table } from "@nextui-org/react";
import { hasCookie } from "cookies-next";
import useSWR from "swr";
import ScaleText from "react-scale-text";
import { fetcher } from "../../libs/sl";
import No from "../util/no";
import Load from "../util/Loading";
import Link from "next/link";
export default function NewsCard() {
    if (!hasCookie('sl-token') || !hasCookie('sl-uid')) {
        return null;
    }




    const { data, error } = useSWR('/api/_sl/news', fetcher)
    let newsElement = <Load />
    if (error) newsElement = <Text>Failed to load</Text>
    if (data) {
        if (data.length > 0) {
            newsElement = data.map((news, index) => {
                if (index >= 5) return null;
                return (
                    <Link href={`/news/${news.iD}`} key={`news-${news.iD}`}>
                        <Card
                            isPressable
                            variant="flat"
                            style={{backgroundColor: "var(--nextui-colors-background)"}}
                        >
                            <Card.Body>
                                <Text>{news.title}</Text>
                            </Card.Body>
                        </Card>
                    </Link>
                )
            })
        } else {
            newsElement = <No thing={"News"} />
        }

    }

    return (<Card isHoverable variant="flat" css={{ minWidth: "250px", height: "min-content", maxWidth: "100%", backgroundColor: "var(--nextui-colors-background)" }}>
        <Card.Header css={{ marginBottom: "-50px", position: "relative" }}>
            <Text b>News</Text>
        </Card.Header>
        <Card.Body css={{ marginBottom: "-15px", position: "relative", paddingLeft: 20 }}>
            {newsElement}
        </Card.Body>
    </Card>)
}
