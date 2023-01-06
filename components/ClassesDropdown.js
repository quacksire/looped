import useSWR from 'swr'
import {Dropdown, Link, Navbar} from '@nextui-org/react';

import {useRouter} from "next/router";
import {getCookie, hasCookie} from "cookies-next";
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function ClassesDropdown(props) {
    if (!hasCookie('sl-token') || !hasCookie('sl-uid')) {
        return null;
    }


    const {data, error} = useSWR('/api/sl/courses', fetcher)

    if (error) return <div>failed to load</div>
    if (!data) return <div>Loading...</div>

    console.log(data)


    const router = useRouter()

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

    console.log(data)

    const classes = []
    data.forEach((course, i) => {
        classes.push({ key: `${course.periodID}`, name: `${course.courseName}`, description: `Period ${course.period} | ${course.teacherName}`, i: `${i}`})
    })


    return (
        <Dropdown isBordered>
            <Navbar.Item {...props}>
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
            <Dropdown.Menu
                aria-label="ACME features"
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
                items={classes}
            >
                {(item) => (
                    <Dropdown.Item
                        key={item.key}
                        description={item.description}
                        command={`CTRL + ${item.i}`}
                        onPress={() => console.log('Pressed' + item.key)}
                        showFullDescription
                    >
                        <Link href={`/class/${item.key}`}>
                            {item.name}
                        </Link>
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    )
}




    /*

    return (
        <Dropdown isBordered>
            <Navbar.Item>
                <Dropdown.Button
                    auto
                    light
                    css={{
                        px: 0,
                        dflex: "center",
                        svg: { pe: "none" },
                    }}
                    ripple={false}
                >
                    Classes
                </Dropdown.Button>
            </Navbar.Item>
                <Dropdown.Menu>
                    {data.forEach((course) => (
                        <Dropdown.Item
                            key="supreme_support"
                            showFullDescription
                            description="Overcome any challenge with a supporting team ready to respond."
                            key={course.id}
                        >
                    +Supreme Support
                </Dropdown.Item>
                    ))}
                </Dropdown.Menu>


        </Dropdown>
    )
}
/*
<Dropdown.Item
                key="production_ready"
                showFullDescription
                description="ACME runs on ACME, join us and others serving requests at web scale."
            >
                Production Ready
            </Dropdown.Item>
 */
