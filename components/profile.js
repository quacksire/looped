import { useLocalStorage } from "@react-hooks-library/core"
import { User, Navbar, Dropdown, Text} from "@nextui-org/react"
import { useRouter } from "next/router"
import { removeCookies, getCookie, setCookie } from "cookies-next"
import Load from "./util/Loading"
import { InfoCircledIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from "react"
import useHotkeys from "@reecelucas/react-use-hotkeys"


export default function Profile() {
    const [user] = useLocalStorage('sl-user', {loading: true})
    const [name] = useLocalStorage(`name.${getCookie("sl-uid")}`, null)

    const [menuItem, setMenuItem] = useState("")

    const router = useRouter()

    function logout() {
        localStorage.clear()
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
            router.push("/info")
        } else if (menuItem.currentKey === "changeName") {
            setCookie("set")
        }
    }, [menuItem])

    useHotkeys("Shift+L", () => {
        logout()
    });

    

    return (
                <Navbar.Link onPress={logout}>
                    <Dropdown placement="bottom-left">
                    {user.loading ? (<Load />) : (<Dropdown.Trigger><User
                        src={`https://api.dicebear.com/5.x/bottts/svg?seed=${user.email}`}
                        name={name ? name : `${String(user.fullName).split(', ')[1] + ' ' + String(user.fullName).split(', ')[0]}`}
                        description={`${user.email}`}
                        size="xs"
                        pointer
                        /></Dropdown.Trigger>)}
                    <Dropdown.Menu color="primary" aria-label="User Actions" selectionMode={"single"}  onSelectionChange={(key) => {
                        setMenuItem(key)
                    }}>
                        <Dropdown.Item key="settings" icon={<GearIcon />}>
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