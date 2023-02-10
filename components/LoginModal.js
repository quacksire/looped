import React, {useEffect} from "react";
import {Modal, Button, Text, Input, Row, Checkbox, Loading} from "@nextui-org/react";
import Link from "next/link";
import {getCookie, hasCookie, setCookie} from "cookies-next";
import {useRouter} from "next/router";
import {useLocalStorage} from "@react-hooks-library/core";
import useHotkeys from "@reecelucas/react-use-hotkeys";


export default function App() {
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [usernameTarget, setUsername] = React.useState("");
    const [passwordTarget, setPassword] = React.useState("");
    const [tokenTarget, setToken] = React.useState("");
    const router = useRouter();

    const [usr, setUsr] = useLocalStorage(
        'sl-user',
        {loading: true}
    )

    const [token, setToken] = useLocalStorage(
        'sl-token',
        0
    )

    useEffect(() => {
        console.log(hasCookie("sl-token"))
        if (!hasCookie("sl-token")) {
            if (!router.pathname === '/login') {
                router.push(`/login?path=${encodeURI(router.pathname.replace("[id]", `${window.location.pathname.split("/")[2]}`))}`);
            }
            setVisible(true);
        } else {
            setVisible(false);
            
        }
    }, [router.pathname]);


    const handler = () => setVisible(true);
    const closeHandler = () => {
        setVisible(false);
        console.log("closed");
    };

    const [tokenLogin, setTokenLogin] = useState(false)
    useHotkeys("Alt+T", () => {
        setTokenLogin(!tokenLogin)
    });


    const signInHandler = async () => {
        console.log("sign in");
        setLoading(true);
        
        
        if (tokenLogin) {
                let token = tokenTarget.target.value;
                let response = await fetch(`https://hmbhs.schoolloop.com/mapi/login?version=3&devToken=${encodeURI('Looped')}&devOS=${encodeURI(navigator.platform)}&year=${new Date().getFullYear()}`, {
                headers: {
                    authorization: `Basic ${token}`
                }
            })
            if (!response.ok) {
                setLoading(false);
                console.log("error");
                //error
                return;
            }
            //tokenTarget
            response = await response.json()
            setCookie("sl-token", `${token}`), { expires: new Date(new Date().setHours(720)) });
            setCookie('sl-uid', response.userID, { expires: new Date(new Date().setHours(720)) });
            setUsr(response);
            setToken(`${token}`);
        } else {
        
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
            setUsr(response);
            setToken(btoa(`${encodeURI(username)}:${encodeURI(password)}`));
            
        }
        setLoading(false);
        setVisible(false);

        router.query.path ? router.push(router.query.path) : router.push('/');
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
                    {!tokenLogin ? (<>
                        <Input
                        onChange={setUsername}
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Username"
                        aria-label="Username"
                    />
                    <Input
                        onChange={setPassword}
                        aria-label="Password"
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        type="password"
                        placeholder="Password"
                    />
                    </>) : (<>
                        <Input
                        onChange={tokenTarget}
                        aria-label="Token"
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        type="password"
                        placeholder="Token"
                    />
                    </>)}
                    <Row justify="space-between">
                        <Checkbox>
                            <Text size={14} id="rm">Remember me</Text>
                        </Checkbox>
                        <Link href="https://looped.schoolloop.com/portal/forgot_password" target={'_blank'} referrer={"blank"}>
                            <Text size={14}>Forgot password?</Text>
                        </Link>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {loading ? (<Button disabled auto bordered color="warning" css={{ px: "$13" }}>
                        <Loading type="points-opacity" color="currentColor" size="sm" />
                    </Button>) : (
                        <Button auto onClick={signInHandler}>
                         Sign in
                    </Button>
                    )}
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
}
