// Using Nextui, create a navbar react component that will be used in all pages.

import {Navbar, Button, Dropdown, Link, Text, styled} from '@nextui-org/react';
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';
import ClassesDropdown from "./ClassesDropdown";
import {setCookie, removeCookies} from "cookies-next";





export default function NavBar() {


    const router = useRouter();
    const [active, setActive] = useState(router.pathname);

    useEffect(() => {
        setActive(router.pathname);
        console.log(active);
    }, [router.pathname]);



    function logout() {
        localStorage.clear()
        removeCookies("sl-token");
        router.reload();
    }



    return (
        <Navbar variant="sticky" isCompact css={{ zIndex: 10}}>
            <Navbar.Brand>
                <Text b color="inherit" hideIn="xs">
                    <Link href="/" color="text">Looped</Link>
                </Text>
            </Navbar.Brand>
            <Navbar.Content
                enableCursorHighlight
                activeColor="secondary"
                hideIn="xs"

            >
                {String(active) === '/' ? <Navbar.Link isActive>Home</Navbar.Link> : <Navbar.Link onPress={() => { router.push("/")}} >Home</Navbar.Link>}

                <ClassesDropdown></ClassesDropdown>
                {!String(active).includes('news') ? null : <Navbar.Link onPress={() => { router.push("/news")}} isActive>News</Navbar.Link>}
                {!String(active).includes('mail') ? <Navbar.Link onPress={() => { router.push("/mail")}}>LoopMail</Navbar.Link> : <Navbar.Link isActive onPress={() => { router.push("/mail")}}>LoopMail</Navbar.Link>}
                {!String(active).includes('calender') ? <Navbar.Link onPress={() => { router.push("/calender")}}>Calender</Navbar.Link> : <Navbar.Link isActive onPress={() => { router.push("/calender")}}>Calender</Navbar.Link>}
            </Navbar.Content>
            <Navbar.Content>
                <Navbar.Item>
                    <Button auto flat onPress={logout}>
                        Log Out
                    </Button>
                </Navbar.Item>
            </Navbar.Content>
        </Navbar>

    )
}

//write a getServerSideProps function

export async function getProps() {
    const res = await fetch('/api/sl/courses')
    const data = await res.json()

    console.log(data)

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data }, // will be passed to the page component as props
    }
}
