// Using Nextui, create a navbar react component that will be used in all pages.

import {Navbar, Button, Dropdown, Text, styled, User, Link} from '@nextui-org/react';
import { useRouter } from 'next/router';
import {Suspense, useEffect, useState} from 'react';
import ClassesDropdown from "./ClassesDropdown";
import {setCookie, removeCookies} from "cookies-next";
import { useLocalStorage } from '@react-hooks-library/core';
import Load from '../components/util/Loading'
import { EnvelopeClosedIcon, HomeIcon, CalendarIcon, ReaderIcon, ChevronLeftIcon} from '@radix-ui/react-icons';
import Profile from './profile';
import Share from "./util/Share";





export default function NavBar() {
    const router = useRouter();
    const [active, setActive] = useState(router.pathname || "");


    useEffect(() => {
        setActive(router.pathname);
        console.log(active);
    }, [router.pathname]);


    const [inPwa, setInPwa] = useState(false);
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setInPwa(true);
        }
    }, [])

    useEffect(() => {
        document.getElementById('navbar').style.setProperty('-webkit-app-region', `drag`);
        document.getElementById('profile')?.style?.setProperty('padding-right', `env(titlebar-area-width, 25%)`);
    }, [])

    const [canShare, setCanShare] = useState(false);
    useEffect(() => {
        if (navigator.canShare) {
            setCanShare(true);
        }
    }, []);

    const [pageTitle, setPageTitle] = useState("")
    useEffect(() => {
            setPageTitle(document.title);
    }, []);



    return (
        <Navbar variant="sticky" isCompact css={{ zIndex: 10, webkitAppRegion: "drag", paddingRight: "env(--titlebar-area-y)"}} id={'navbar'}>

            {inPwa ? null : <Navbar.Brand hideIn="xs">
                <Text b color={"foreground"}>
                    <Link href="#" onPress={() => { router.push("/")}} style={{ textDecoration: "none"}} >Looped</Link>
                </Text>
            </Navbar.Brand>}

            <Navbar.Content
                enableCursorHighlight
                activeColor="secondary"
                hideIn="xs"

            >
                {String(active) === '/' ? <Navbar.Link isActive><HomeIcon style={{paddingRight: "10px"}}/>Home</Navbar.Link> : <Navbar.Link onPress={() => { router.push("/")}} ><HomeIcon style={{paddingRight: "10px"}}/>Home</Navbar.Link>}

                <ClassesDropdown />
                {!String(active).includes('news') ? null : <Navbar.Link onPress={() => { router.push("/news")}} isActive><ReaderIcon style={{paddingRight: "10px"}} />   News</Navbar.Link>}
                {!String(active).includes('mail') ? <Navbar.Link onPress={() => { router.push("/mail")}}><EnvelopeClosedIcon style={{paddingRight: "10px"}}/>LoopMail</Navbar.Link> : <Navbar.Link isActive onPress={() => { router.push("/mail")}}><EnvelopeClosedIcon style={{paddingRight: "10px"}}/>LoopMail</Navbar.Link>}
                {!String(active).includes('calender') ? <Navbar.Link onPress={() => { router.push("/calender")}}><CalendarIcon style={{paddingRight: "10px"}} /> Calender</Navbar.Link> : <Navbar.Link isActive onPress={() => { router.push("/calender")}}><CalendarIcon style={{paddingRight: "10px"}}/> Calender</Navbar.Link>}
            </Navbar.Content>

            <Navbar.Content
                enableCursorHighlight
                activeColor="secondary"
                showIn="xs"
            >
                {String(active) != '/' ? <Navbar.Link onPress={() => { router.push("/")}} ><ChevronLeftIcon style={{paddingRight: "10px"}}/></Navbar.Link> : null}
                {String(active) === '/' ? <Navbar.Link isActive><HomeIcon style={{paddingRight: "10px"}}/>Home</Navbar.Link> : <Navbar.Link onPress={() => { router.push("/")}} ><HomeIcon style={{paddingRight: "10px"}}/></Navbar.Link>}

            </Navbar.Content>



            <Navbar.Content>
            {canShare && <Navbar.Item>
                    <Share />
                </Navbar.Item>}
            <Profile   />
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
