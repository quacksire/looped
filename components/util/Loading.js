import {Loading} from "@nextui-org/react";


/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Load() {
    return (
        <Loading css={{ padding: "10px", marginBottom: "20px"}} type="points-opacity" color={'currentColor'}></Loading>
    )
}
