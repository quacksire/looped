import {Text} from "@nextui-org/react";


/**
 *
 * @param {string} props.thing
 * @returns {JSX.Element}
 * @constructor
 */
export default function No(props) {
  return (
      <Text css={{ padding: "10px", marginBottom: "20px"}}>No {props.thing}</Text>
  )
}

