// Using Nextui, create a navbar react component that will be used in all pages.

import {Navbar, Button, Dropdown, Text, styled, User, Link} from '@nextui-org/react';
import { useRouter } from 'next/router';
import {Suspense, useEffect, useState} from 'react';
import ClassesDropdown from "./ClassesDropdown";
import {setCookie, removeCookies} from "cookies-next";
import { useLocalStorage } from '@react-hooks-library/core';
import Load from '../components/util/Loading'
import { EnvelopeClosedIcon, HomeIcon, CalendarIcon } from '@radix-ui/react-icons';





export default function NavBar() {


    const router = useRouter();
    const [active, setActive] = useState(router.pathname);

    useEffect(() => {
        setActive(router.pathname);
        console.log(active);
    }, [router.pathname]);

    const [user] = useLocalStorage('sl-user', {loading: true})

    function logout() {
        localStorage.clear()
        removeCookies("sl-token");
        router.push(`/login?path=${encodeURI(router.pathname.replace("[id]", `${window.location.pathname.split("/")[2]}`))}`);
    }



    return (
        <Navbar variant="sticky" isCompact css={{ zIndex: 10}}>
            <Navbar.Brand>
                <Text b color="inherit">
                    <Link href="#" onPress={() => { router.push("/")}} style={{ textDecoration: "none"}}>Looped</Link>
                </Text>
            </Navbar.Brand>
            <Navbar.Content
                enableCursorHighlight
                activeColor="secondary"
                hideIn="xs"

            >
                {String(active) === '/' ? <Navbar.Link isActive><HomeIcon style={{paddingRight: "10px"}}/>Home</Navbar.Link> : <Navbar.Link onPress={() => { router.push("/")}} ><HomeIcon style={{paddingRight: "10px"}}/>Home</Navbar.Link>}

                <ClassesDropdown />
                {!String(active).includes('news') ? null : <Navbar.Link onPress={() => { router.push("/news")}} isActive>News</Navbar.Link>}
                {!String(active).includes('mail') ? <Navbar.Link onPress={() => { router.push("/mail")}}><EnvelopeClosedIcon style={{paddingRight: "10px"}}/>LoopMail</Navbar.Link> : <Navbar.Link isActive onPress={() => { router.push("/mail")}}><EnvelopeClosedIcon style={{paddingRight: "10px"}}/>LoopMail</Navbar.Link>}
                {!String(active).includes('calender') ? <Navbar.Link onPress={() => { router.push("/calender")}}><CalendarIcon style={{paddingRight: "10px"}} /> Calender</Navbar.Link> : <Navbar.Link isActive onPress={() => { router.push("/calender")}}><CalendarIcon style={{paddingRight: "10px"}}/> Calender</Navbar.Link>}
            </Navbar.Content>
            <Navbar.Content>
                <Navbar.Link onPress={logout}>
                    {user.loading ? (<Load />) : (<User onPress={logout}
                        src={`https://api.dicebear.com/5.x/bottts/svg?seed=${user.email}`}
                        name={`${String(user.fullName).split(', ')[1] + ' ' + String(user.fullName).split(', ')[0]}`}
                        description={`${user.email}`}
                        size="xs"
                        pointer
                        />)}

                </Navbar.Link>
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
