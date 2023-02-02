// Using Nextui, create a navbar react component that will be used in all pages.

import {Navbar, Button, Dropdown, Text, styled, User, Link, Spacer} from '@nextui-org/react';
import { useRouter } from 'next/router';
import {Suspense, useEffect, useState} from 'react';
import ClassesDropdown from "./ClassesDropdown";
import {setCookie, removeCookies} from "cookies-next";
import { useLocalStorage } from '@react-hooks-library/core';
import Load from '../components/util/Loading'
import { EnvelopeClosedIcon, HomeIcon, CalendarIcon, ReaderIcon, ChevronLeftIcon} from '@radix-ui/react-icons';
import Profile from './profile';





export default function NavBar() {
    const router = useRouter();
    const [active, setActive] = useState(router.pathname || "");


    useEffect(() => {
        setActive(router.pathname);
        console.log(active);
    }, [router.pathname]);

//
    const [inPwa, setInPwa] = useState(false);
    const [displayControls, setDisplayControls] = useState(false)
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: window-controls-overlay)').matches) {
            setInPwa(true);
        }
        if (window.matchMedia('(display-mode: window-controls-overlay)').matches) {
            setDisplayControls(true)
        }
    }, [])

    useEffect(() => {
        //document.getElementById('navbar').style.setProperty('-webkit-app-region', `drag`);
        document.getElementById('profile')?.style?.setProperty('padding-right', `env(titlebar-area-width)`);
    }, [])

    const [pageTitle, setPageTitle] = useState("")
    useEffect(() => {
        setPageTitle(document.title);
    }, []);


    const [titlebarGapAdjust, setTitlebarGapAdjust] = useState(null);
    const [integratedTitlebar, setIntegratedTitlebar] = useState(false);
    useEffect(() => {
        const mediaQueryList = window.matchMedia('(display-mode: window-controls-overlay)');

        // Add the callback function as a listener to the query list.
        mediaQueryList.addEventListener('change', (q) => {
            //document.location.reload();
            if (q.matches) {
                setIntegratedTitlebar(true);
                setTitlebarGapAdjust((window.innerWidth - navigator.windowControlsOverlay.getTitlebarAreaRect().width));
            } else {
                setIntegratedTitlebar(false);
                setTitlebarGapAdjust(null);
            }
        });
    }, []);

    const [titlebarHeight, setTitlebarHeight] = useState(null);
    useEffect(() => {
        if ('windowControlsOverlay' in navigator) {
            //navigator.windowControlsOverlay.getTitlebarAreaRect().height
            setTitlebarHeight(navigator.windowControlsOverlay.visible ? navigator.windowControlsOverlay.getTitlebarAreaRect().height * 1.5 : null);
            if(navigator.windowControlsOverlay.visible) setIntegratedTitlebar(true);
        }
    }, [])



    return (
        <Navbar
            variant="sticky"
            isCompact
            height={titlebarHeight ? titlebarHeight : 50}
            maxWidth={"fluid"}
            id={'navbar'}
            css={integratedTitlebar ? { backgroundColor: "black", webkitAppRegion: "drag"} : null}
            style={integratedTitlebar ? {"-webkit-app-region": "drag", "app-region": "drag"} : null}
            >

            {(inPwa || displayControls) ? null : <Navbar.Brand hideIn="xs">
                <Text b color={"foreground"}>
                    <Link href="#" onPress={() => { router.push("/")}} style={{ textDecoration: "none"}} >Looped</Link>
                </Text>
            </Navbar.Brand>}

            <Navbar.Content
                enableCursorHighlight
                activeColor="secondary"
                hideIn="xs"
                style={integratedTitlebar ? {"-webkit-app-region": "no-drag", "app-region": "no-drag"} : null}

            >
                {String(active) === '/' ? <Navbar.Link isActive><HomeIcon style={{paddingRight: "10px"}}/>Home</Navbar.Link> : <Navbar.Link onPress={() => { router.push("/")}} ><HomeIcon style={{paddingRight: "10px"}}/>Home</Navbar.Link>}

                <ClassesDropdown />
                {!String(active).includes('news') ? null : <Navbar.Link onPress={() => { router.push("/news")}} isActive><ReaderIcon style={{paddingRight: "10px"}} />   News</Navbar.Link>}
                {!String(active).includes('mail') ? <Navbar.Link onPress={() => { router.push("/mail")}}><EnvelopeClosedIcon style={{paddingRight: "10px"}}/>LoopMail</Navbar.Link> : <Navbar.Link isActive onPress={() => { router.push("/mail")}}><EnvelopeClosedIcon style={{paddingRight: "10px"}}/>LoopMail</Navbar.Link>}
                {!String(active).includes('calender') ? <Navbar.Link onPress={() => { router.push("/calender")}} hideIn={'sm'}><CalendarIcon style={{paddingRight: "10px"}} /> Calender</Navbar.Link> : <Navbar.Link isActive onPress={() => { router.push("/calender")}} hideIn={'sm'}><CalendarIcon style={{paddingRight: "10px"}}/> Calender</Navbar.Link>}
            </Navbar.Content>

            <Navbar.Content
                enableCursorHighlight
                activeColor="secondary"
                showIn="xs"
                style={integratedTitlebar ? {"-webkit-app-region": "no-drag", "app-region": "no-drag"} : null}
            >
                {String(active) === '/' ? <Navbar.Link isActive><HomeIcon style={{paddingRight: "10px"}}/>Home</Navbar.Link> : <Navbar.Link onPress={() => { router.push("/")}} ><HomeIcon style={{paddingRight: "10px"}}/></Navbar.Link>}
                {String(active) != '/' ? <Navbar.Link onPress={() => { router.back() }} ><ChevronLeftIcon style={{paddingRight: "10px"}}/></Navbar.Link> : null}

                {String(active) != '/' ? <Navbar.Item isDisabled={true}>
                    {String(pageTitle).split(' - Looped')[0]}
                </Navbar.Item> : null}
            </Navbar.Content>

            <Spacer x={2.3}/>

            <Navbar.Content style={integratedTitlebar ? {"-webkit-app-region": "no-drag", "app-region": "no-drag"} : null} css={{marginRight: titlebarGapAdjust}}>
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
