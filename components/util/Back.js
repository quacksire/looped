import {Button, Loading} from "@nextui-org/react";
import {useRouter} from "next/router";


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Back() {
    const router = useRouter();

    return (
        <Button light color="primary" auto onPress={() => { router.back() }}>
            &lt; Back
        </Button>
    )
}
