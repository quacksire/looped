import React from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { useLocalStorage } from "@react-hooks-library/core";
import { getCookie, removeCookie, setCookie } from "cookies-next";
export default function App() {
  const [visible, setVisible] = React.useState(false);
  const [nameTarget, setNameTarget] = React.useState("");
  const handler = () => setVisible(true);

  const [name, setName] = useLocalStorage(`name.${getCookie("sl-uid")}`, null)

  const [usr, setUsr] = useLocalStorage(
    'sl-user',
    {loading: true}
  )

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  const changeHandler = () => {
    setName(nameTarget.target.value);
    removeCookie("action-changeName");
    setVisible(false);
  };

  useEffect(() => {
    if (hasCookie("action-changeName")) {
      setVisible(true);
    } else {
        setVisible(false);
    }
  }, []);

  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Name Change
          </Text>
        </Modal.Header>
        <Modal.Body>
            <Text>This will only affect this device.</Text>

          <Input
            onChange={setNameTarget}
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder={name ? name : usr.fullName}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto onPress={changeHandler}>
            Change
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}