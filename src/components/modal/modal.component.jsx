import { Button, Modal, Form } from "react-bootstrap";
import SuggestionsList from "../suggestions-list/suggestions-list.component";
import { useState, useCallback, useMemo } from "react";
import { getSuggestions } from "../../utils/nutritionix/nutritionix.util";

const debounce = (fn, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

function ModalComponent({
  children,
  formFields,
  show,
  handleChange,
  handleClose,
  handleSubmit,
  handleSelect,
  handlePickSuggestion,
  isAdmin,
  users,
  modalTitle,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [options, setOptions] = useState([]);

  const onKeyDown = (key) => {
    if (key.keyCode === 13 || key.keyCode === 9) {
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (query) => {
    if (query && query.length > 0) {
      const res = await getSuggestions(query);
      setShowSuggestions(true);
      setOptions([...res.branded]);
    }
  };

  const debouncedHandler = useCallback(debounce(handleSearch, 200), []);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onClick={() => setShowSuggestions(false)}
    >
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
              autoComplete="off"
              placeholder="Enter Food Name"
              onChange={(event) => {
                handleChange(event);
                debouncedHandler(event.target.value);
              }}
              onKeyDown={onKeyDown}
              onFocus={(e) => {
                setShowSuggestions(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              name="name"
              value={formFields.name}
            />
            {showSuggestions &&
              formFields.name &&
              // <SuggestionsList options={options} />
              (options.length > 0 ? (
                <ul className="suggestions">
                  {options.map((suggestion, index) => {
                    return (
                      <li
                        className="d-flex"
                        key={index}
                        onClick={(event) => {
                          handlePickSuggestion(
                            suggestion.food_name,
                            suggestion.nf_calories
                          );
                          setShowSuggestions(false);
                        }}
                      >
                        <div style={{ flex: 1 }}>{suggestion.food_name} </div>
                        <div className="text-primary">
                          {suggestion.nf_calories} cal
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="no-suggestions">
                  <em>No suggestions, you're on your own!</em>
                </div>
              ))}
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
