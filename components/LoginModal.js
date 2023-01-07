import React, {useEffect} from "react";
import {Modal, Button, Text, Input, Row, Checkbox, Loading} from "@nextui-org/react";
import Link from "next/link";
import {getCookie, hasCookie, setCookie} from "cookies-next";
import {useRouter} from "next/router";

export default function App() {
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [usernameTarget, setUsername] = React.useState("");
    const [passwordTarget, setPassword] = React.useState("");
    const router = useRouter();

    useEffect(() => {
        console.log(hasCookie("sl-token"))
        if (!hasCookie("sl-token")) {
            if (!router.pathname.includes("login")) {
                router.push("/login");
            }
            setVisible(true);
        }
    }, []);


    const handler = () => setVisible(true);
    const closeHandler = () => {
        setVisible(false);
        console.log("closed");
    };

    const signInHandler = async () => {
        console.log("sign in");
        setLoading(true);
        let username = usernameTarget.target.value;
        let password = passwordTarget.target.value;

        console.log(username, password);

        console.log(`Basic ${btoa(`${encodeURI(username)}:${encodeURI(password)}`)}`)

        let response = await fetch(`https://hmbhs.schoolloop.com/mapi/login?version=3&devToken=${encodeURI('Looped')}&devOS=${encodeURI(navigator.platform)}&year=${new Date().getFullYear()}`, {
            headers: {
                authorization: `Basic ${btoa(`${encodeURI(username)}:${encodeURI(password)}`)}`
            }
        })

        if (!response.ok) {
            setLoading(false);
            console.log("error");
            //error
            return;
        }

        response = await response.json()

        setCookie("sl-token", btoa(`${encodeURI(username)}:${encodeURI(password)}`), { expires: new Date(new Date().setHours(720)) });
        setCookie('sl-uid', response.userID, { expires: new Date(new Date().setHours(720)) });
        localStorage.setItem("sl-token", btoa(`${encodeURI(username)}:${encodeURI(password)}`));
        localStorage.setItem("sl-user", JSON.stringify(response));
        setLoading(false);
        setVisible(false);

        router.push("/");
    }

    return (
        <div>
            <Modal
                preventClose
                aria-labelledby="modal-title"
                open={visible}
                blur
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Welcome to Looped
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text>Login with School Loop</Text>
                    <Input
                        onChange={setUsername}
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Username"
                        aria-label="Username"
                    />
                    <Input
                        onChange={setPassword}
                        clearable
                        aria-label="Password"
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        type="password"
                        placeholder="Password"
                    />
                    <Row justify="space-between">
                        <Checkbox>
                            <Text size={14}>Remember me</Text>
                        </Checkbox>
                        <Link href="https://looped.schoolloop.com/portal/forgot_password" target={'_blank'} referrer={"blank"}>
                            <Text size={14}>Forgot password?</Text>
                        </Link>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Close
                    </Button>
                    <Button auto onClick={signInHandler}>
                        {loading ? <Loading type="gradient" color={"white"} /> : "Sign in"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
