import React, {useEffect, useState} from "react";
import {Modal, Button, Text, Input, Row, Checkbox, Spacer} from "@nextui-org/react";
import { useLocalStorage } from "@react-hooks-library/core";
import { getCookie } from "cookies-next";
import Head from "next/head";
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

    const isPWA = usePWA()
    //{inPwa ? null : ' - Looped'}


    return (
        <div>
            <Head>
                <title>{isPWA ? null : 'Settings - Looped'}</title>
            </Head>

            <Text h1> Settings</Text>
            <Input
                labelLeft="Name"
                aria-label={"Change Name"}
                bordered
                fullWidth
                color="primary"
                size="lg"
                onChange={setVal}
                placeholder={name ? name : `${String(usr.fullName).split(', ')[1] + ' ' + String(usr.fullName).split(', ')[0]}`}
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
