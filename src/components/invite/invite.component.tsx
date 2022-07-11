import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { inviteFriend } from "../../utils/firebase/firebase.util";

export type InviteFriendFormFields = {
  displayName: string;
  email: string;
  calories: number;
};

const defaultFormFields: InviteFriendFormFields = {
  displayName: "",
  email: "",
  calories: 0,
};

type InviteComponentProps = {
  show: boolean;
  handleClose: () => void;
  modalTitle: string;
};

function InviteComponent({
  show,
  handleClose,
  modalTitle,
}: InviteComponentProps) {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newUser = await inviteFriend(formFields);
      console.log(newUser);
      handleClose();
      resetFormFields();
    } catch (error) {
      console.log("error adding food: ", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formFood">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Enter Full Name"
              name="displayName"
              value={formFields.displayName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFood">
            <Form.Control
              type="email"
              onChange={handleChange}
              value={formFields.calories}
              name="email"
              placeholder="Enter Email"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default InviteComponent;
