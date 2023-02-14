import React, {useEffect, useState} from "react";
import {Modal, Button, Text, Input, Row, Checkbox, Spacer, User} from "@nextui-org/react";
import { useLocalStorage } from "@react-hooks-library/core";
import { getCookie } from "cookies-next";
import Head from "next/head";
import {usePWA} from "../components/util/usePWA";
import Profile from "../components/profile";
export default function App() {
    const [name, setName] = useLocalStorage(`name.${getCookie("sl-uid")}`, null)
    const [seed, setSeed] = useLocalStorage(`seed.${getCookie("sl-uid")}`, null)

    const [usr] = useLocalStorage(
        'sl-user',
        {loading: true}
    )

    const [nameval, setnameVal] = React.useState("")
    const [seedval, setseedVal] = React.useState("")

    const changeHandler = () => {
        //console.log(val.target.value)
        if (seedval?.target?.value) setSeed(seedval.target.value);
        if (nameval?.target?.value) setName(nameval.target.value);
        document.location.reload()
    };

    const isPWA = usePWA()
    //{inPwa ? null : ' - Looped'}

    useEffect(() => {
        if (usr.email && !seed) {
            console.log("[settings] setting profile pic seed...")
            setSeed(usr.email)
            setseedVal({target: {value: usr.email}})
        }
    }, [usr])


    return (
        <div>
            <Head>
                <title>{isPWA ? null : 'Settings - Looped'}</title>
            </Head>

            <Text h1> Settings</Text>
            <Input
                labelLeft="Name:"
                aria-label={"Change Name"}
                labelLeft={"Name:"}
                bordered
                fullWidth
                color="primary"
                size="lg"
                onChange={setnameVal}
                placeholder={name ? name : `${String(usr.fullName).split(', ')[1] + ' ' + String(usr.fullName).split(', ')[0]}`}
            />
            <Spacer y={1}/>
            <Input
                labelLeft={(<><User
                    src={`https://api.dicebear.com/5.x/bottts/svg?seed=${seedval?.target?.value || seed || usr.email}`}
                    size="xs"
                /> Profile Seed</>)}
                aria-label={"Change Profile Picture"}
                bordered
                fullWidth
                color="primary"
                size="lg"
                onChange={setseedVal}
                initialValue={seed}
                placeholder={seed ? seed : `${usr.email}`}
            />
            <Spacer y={1}/>
            <Button
                color="primary"
                size="lg"
                fullWidth
                onClick={changeHandler}>
                Save
            </Button>
        </div>
    );
}
