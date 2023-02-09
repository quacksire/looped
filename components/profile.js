import { useLocalStorage } from "@react-hooks-library/core"
import { User, Navbar, Dropdown, Text} from "@nextui-org/react"
import { useRouter } from "next/router"
import { removeCookies, getCookie, setCookie } from "cookies-next"
import Load from "./util/Loading"
import {InfoCircledIcon, GearIcon, ExitIcon, Share2Icon} from '@radix-ui/react-icons';
import { useEffect, useState } from "react"
import useHotkeys from "@reecelucas/react-use-hotkeys"


export default function Profile() {
    const [user] = useLocalStorage('sl-user', {loading: true})
    let [name] = useLocalStorage(`name.${getCookie("sl-uid")}`, null)

    const [menuItem, setMenuItem] = useState("")

    const router = useRouter()

    function logout() {
        localStorage.removeItem("sl-user")
        localStorage.removeItem("sl-token")
        removeCookies("sl-token");
        router.push(`/login?path=${encodeURI(router.pathname.replace("[id]", `${window.location.pathname.split("/")[2]}`))}`);
    }


    useEffect(() => {
        //window.alert(menuItem.currentKey)
        if (menuItem.currentKey === "logout") {
            logout()
        } else if (menuItem.currentKey === "settings") {
            router.push("/settings")
        } else if (menuItem.currentKey === "info") {
            router.push("/about")
        } else if (menuItem.currentKey === "share") {
                navigator.share({
                    title: `${document.title}`,
                    text: 'Check out this paged on Looped',
                    url: `${window.location.href}`,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }
    }, [menuItem])

    useHotkeys("Shift+L", () => {
        logout()
    });

    const [canShare, setCanShare] = useState(false);
    useEffect(() => {
        if (navigator.canShare) {
            setCanShare(true);
        }
    }, []);


    /*name=
    description={`${user.email}`}*/

    return (
                <Navbar.Link onPress={logout} css={{"left": 'env(titlebar-area-x, 0)'}}>
                    <Dropdown placement="bottom-left">
                    {user.loading ? (<Load />) : (<Dropdown.Trigger id={'profile'}><User
                        src={`https://api.dicebear.com/5.x/bottts/svg?seed=${user.email}`}
                        size="xs"
                        pointer
                        color="primary"
                        /></Dropdown.Trigger>)}
                    <Dropdown.Menu color="primary" aria-label="User Actions" selectionMode={"single"}  onSelectionChange={(key) => {
                        setMenuItem(key)
                    }} disabledKeys={["profile"]}>
                        <Dropdown.Item key="profile">
                            <User
                            src={`https://api.dicebear.com/5.x/bottts/svg?seed=${user.email}`}
                            size="xs"
                            pointer
                            color="primary"
                            name={name ? name : `${String(user.fullName).split(', ')[1]} ${String(user.fullName).split(', ')[0]}`}
                            description={`${user.email}`}
                            />
                        </Dropdown.Item>
                        <Dropdown.Item key="share" icon={<Share2Icon />} withDivider={canShare}>
                            Share
                        </Dropdown.Item>
                        <Dropdown.Item key="settings" icon={<GearIcon />} withDivider={!canShare}>
                        Settings
                        </Dropdown.Item>
                        <Dropdown.Item key="info" icon={<InfoCircledIcon />}>
                        Info
                        </Dropdown.Item>
                        <Dropdown.Item key="logout" color="error" icon={<ExitIcon />} command="Ctrl+Shift+L" withDivider>
                        Log Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Link>
    )
}
