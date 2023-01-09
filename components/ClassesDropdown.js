import useSWR from 'swr'
import {Dropdown, Link, Loading, Navbar} from '@nextui-org/react';

import {useRouter} from "next/router";
import {getCookie, hasCookie} from "cookies-next";
import useHotkeys from "@reecelucas/react-use-hotkeys"
import {fetcher} from "../libs/sl";
import {useEffect, useState} from "react";
export default function ClassesDropdown() {
    if (!hasCookie('sl-token') || !hasCookie('sl-uid')) {
        return null;
    }


    const {data, error} = useSWR('/api/_sl/courses', fetcher)

    const router = useRouter()
    const [a, setA] = useState(false)
    useEffect(() => {
        if (router.pathname.includes('class')) {
            setA(true)
        } else {
            setA(false)
        }
    }, [router.pathname]);

    if (error) return null
    if (!data) return (
        <Dropdown isBordered>
            <Navbar.Item isActive={a}>
                <Dropdown.Button
                    auto
                    light
                    css={{
                        px: 0,
                        dflex: "center",
                        svg: {pe: "none"},
                    }}
                    ripple={false}
                >
                    Classes
                </Dropdown.Button>
            </Navbar.Item>
        </Dropdown>
    )




        /*
        (
                <Dropdown.Item
                showFullDescription
                description={`Period ${course.period} | ${course.teacherName}`}
                href={`/class/${course.periodID}`}
                key={course.periodID}
                command={`CTRL + ${i}`}
                onPress={() => console.log('Pressed' + course.periodID)}
                >
                    {course.courseName}
                </Dropdown.Item>)
    );
*/

    const classes = []
    data.forEach((course, i) => {
        //useHotkeys(`Alt+${i + 1}`, () => router.push(`/class/${course.periodID}`))
        classes.push({ key: `${course.periodID}`, name: `${course.courseName}`, description: `Period ${course.period} | ${course.teacherName}`, i: `${i}`})
    })
    return (
                <Dropdown>
                    {!router.pathname.includes('class') ? ( //isActive
                        <Navbar.Item>
                        <Dropdown.Button
                            auto
                            light
                            css={{
                                px: 0,
                                dflex: "center",
                                svg: {pe: "none"},
                            }}
                            ripple={false}
                        >
                            Classes
                        </Dropdown.Button>
                    </Navbar.Item>
                    ) : (
                        <Navbar.Item isActive activeColor={'primary'}>
                        <Dropdown.Button
                            auto
                            light
                            css={{
                                px: 0,
                                dflex: "center",
                                svg: {pe: "none"},
                            }}
                            ripple={false}
                            color={'secondary'}
                        >
                            Classes
                        </Dropdown.Button>
                    </Navbar.Item>
                    )}
                    <Dropdown.Menu
                        aria-label="Looped"
                        css={{
                            $$dropdownMenuWidth: "340px",
                            $$dropdownItemHeight: "70px",
                            "& .nextui-dropdown-item": {
                                py: "$4",
                                // dropdown item left icon
                                svg: {
                                    color: "$secondary",
                                    mr: "$4",
                                },
                                // dropdown item title
                                "& .nextui-dropdown-item-content": {
                                    w: "100%",
                                    fontWeight: "$semibold",
                                },
                            },
                        }}
                        onAction={(key) => {
                            router.push(`/class/${key}`)
                        }}
                        items={classes}
                    >
                        {(item) => (
                            <Dropdown.Item
                                key={item.key}
                                description={item.description}
                                command={`ALT + ${item.i + 1}`}
                                showFullDescription
                            >
                                    {item.name}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
    )
}
