import React, {useEffect, useState} from "react";
import {Modal, Button, Text, Input, Row, Checkbox, Spacer} from "@nextui-org/react";
import { useLocalStorage } from "@react-hooks-library/core";
import { getCookie } from "cookies-next";
import Head from "next/head";
import {PaddingIcon, Share2Icon, DownloadIcon} from "@radix-ui/react-icons";
import {usePWA} from "../components/util/usePWA";

export default function App() {
    const [name, setName] = useLocalStorage(`name.${getCookie("sl-uid")}`, null)

    const [usr] = useLocalStorage(
        'sl-user',
        {loading: true}
    )

    const [val, setVal] = React.useState("")

    const changeHandler = () => {
        //console.log(val.target.value)
        setName(val.target.value);
        document.location.reload()
    };

    const inPWA = usePWA();
    //{inPwa ? null : ' - Looped'}


    return (
        <div>
            <Head>
                <title>{inPWA ? null : 'About - Looped'}</title>
            </Head>

            <Text h1> About</Text>
            <Spacer y={1}/>
            {/*About my web based School Loop (a CMS for tracking grades, attendance, and more) client, it is called Looped */}
            <Spacer y={1}/>
            <Text h3>What is this?</Text>
            <Spacer y={1}/>
            This is a web alternative client for School Loop, a CMS for tracking grades, attendance, and more. It is not affiliated with School Loop in any way.
            <Spacer y={1}/>
            <Text h3>How do I use this?</Text>
            <Spacer y={1}/>
            You can use this by going to the <a href="/">home page</a> and entering your School Loop credentials. Everything is saved locally on your device, so you can use this offline. No data is sent to any servers (except for the School Loop servers, of course).
            <Spacer y={1}/>
            <Text h3>How do I use this offline?</Text>
            <Spacer y={1}/>
            {/*PWA or website*/}
            {!inPWA ? <Text> You can get the app by going to the top bar and clicking the "<DownloadIcon /> Install App" button in the top URL bar of your browser. <br /> On iOS, you can add it by clicking the <Share2Icon /> at the bottom of your screen and pressing "Add to Home Screen". <br/> On Android, find the <Share2Icon></Share2Icon> (or the equalivant) and click "Add to Home Screen" (or the equlivant) </Text> : <Text> You are already setup! Just use the app normally and once you reconnect, your grades and other information will update accordingly</Text>}
            <Spacer y={1}/>
            <Text h3>How do I get the app?</Text>
            <Spacer y={1}/>

        </div>
    );
}
