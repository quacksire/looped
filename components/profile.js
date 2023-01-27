import { useLocalStorage } from "@react-hooks-library/core"
import { User, Navbar, Dropdown, Text} from "@nextui-org/react"
import { useRouter } from "next/router"
import { removeCookies } from "cookies-next"
import Load from "./util/Loading"
import { InfoCircledIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from "react"

export default function Profile() {
    const [user] = useLocalStorage('sl-user', {loading: true})

    const [menuItem, setMenuItem] = useState("")

    const router = useRouter()


    useEffect(() => {
        //window.alert(menuItem.currentKey)
        if (menuItem.currentKey === "logout") {
            logout()
        }
    }, [menuItem])

    function logout() {
        localStorage.clear()
        removeCookies("sl-token");
        router.push(`/login?path=${encodeURI(router.pathname.replace("[id]", `${window.location.pathname.split("/")[2]}`))}`);
    }

    return (
                <Navbar.Link onPress={logout}>
                    <Dropdown placement="bottom-left">
                    {user.loading ? (<Load />) : (<Dropdown.Trigger><User
                        src={`https://api.dicebear.com/5.x/bottts/svg?seed=${user.email}`}
                        name={`${String(user.fullName).split(', ')[1] + ' ' + String(user.fullName).split(', ')[0]}`}
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
                        <Dropdown.Item key="logout" color="error" icon={<ExitIcon />} command="Ctrl+Shift+J" withDivider>
                        Log Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Link>
    )
}