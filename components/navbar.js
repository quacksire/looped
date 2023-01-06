// Using Nextui, create a navbar react component that will be used in all pages.

import {Navbar, Button, Dropdown, Link, Text} from '@nextui-org/react';
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
        localStorage.removeItem("sl-token");
        removeCookies("sl-token");
        router.reload();
    }

    return (
        <Navbar variant="floating">
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
                {!String(active).includes('class') ? <ClassesDropdown/> : <ClassesDropdown isActive/>}
                {!String(active).includes('mail') ? <Navbar.Link href="/mail">LoopMail</Navbar.Link> : <Navbar.Link href="/mail" isActive>LoopMail</Navbar.Link>}

                <Navbar.Link href="#">Company</Navbar.Link>
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
