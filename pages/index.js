import Head from 'next/head'
import Image from 'next/image'
import LoginModal from '../components/LoginModal'
import Layout from "../components/layout";
import {Container, Grid, Spacer, Card, Text} from "@nextui-org/react";
import NavBar from "../components/navbar";
import GPA from "../components/cards/GPA";
import AssignmentCard from "../components/cards/assignments";
import NewsCard from "../components/cards/news";
import GradesCard from "../components/cards/grades";

export default function Home() {
  return (
    <>
      <Head>
        <title>Looped</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Grid.Container gap={3} justify="center" css={{ userSelectable: "none"}}>
            <Grid>
                <GPA/>
            </Grid>
            <Grid>
                <GradesCard />
            </Grid>
            <Grid>
                <AssignmentCard />
            </Grid>

            <Grid>
                <NewsCard />
            </Grid>
            {/*<Grid>
                <GradesCard/>
            </Grid> */}
            {/*<Grid>
                <Card variant="bordered">
                    <Card.Header>
                        <Text b>Calender</Text>
                    </Card.Header>
                    <Card.Body>
                        <Text>Bordered card.</Text>
                    </Card.Body>
                </Card>
            </Grid>*/}
        </Grid.Container>

    </>
  )
}
