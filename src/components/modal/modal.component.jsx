import { Button, Modal, Form } from "react-bootstrap";
import FormInput from "../../components/form-input/form-input.component";

function ModalComponent({
  children,
  formFields,
  show,
  handleChange,
  handleClose,
  handleSubmit,
  handleSelect,
  isAdmin,
  users,
  modalTitle,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isAdmin && (
            <Form.Group className="mb-3" controlId="formUserSelect">
              <Form.Label>User</Form.Label>
              <Form.Select
                name="userId"
                onChange={handleSelect}
                aria-label="Select User"
                value={formFields.userId}
              >
                <option value={""} disabled>
                  Select user
                </option>
                {users.map((val, index) => (
                  <option key={val.id} value={val.id}>
                    {val.displayName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          {isAdmin && (
            <Form.Group className="mb-3" controlId="formDatetime">
              <Form.Label>Date and time</Form.Label>
              <Form.Control
                type="datetime-local"
                onChange={handleChange}
                name="timestamp"
                placeholder="Enter Calorie Amount"
                value={formFields.timestamp}
              ></Form.Control>
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="formFood">
            <Form.Label>Food/Product name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Food Name"
              onChange={handleChange}
              name="name"
              value={formFields.name}
            />
            <Form.Text>
              Start typing to see suggested product calories value
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFood">
            <Form.Control
              type="number"
              min={1}
              max={5000}
              onChange={handleChange}
              value={formFields.calories}
              name="calories"
              placeholder="Enter Calorie Amount"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalComponent;
