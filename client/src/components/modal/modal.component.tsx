import { Button, Modal, Form } from "react-bootstrap";
import { useState, useCallback, ChangeEvent } from "react";
import {
  getSuggestions,
  Suggestion,
} from "../../utils/nutritionix/nutritionix.util";
import { FormFields } from "../../routes/journal/journal.component";
import { AdminFormFields } from "../../routes/admin/admin.component";
import { UserDoc } from "../../contexts/user.context";

function debounce<Params extends any[]>(
  fn: (...args: Params) => any,
  timeout: number
): (...args: Params) => void {
  let timerId: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), timeout);
  };
}

export function isTypeAdminFormFields(
  formFields: AdminFormFields | FormFields
): formFields is AdminFormFields {
  return (formFields as AdminFormFields).userId !== undefined;
}

type ModalProps = {
  formFields: AdminFormFields | FormFields;
  show: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClose: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePickSuggestion: (foodName: string, calories: number) => void;
  isAdmin: boolean;
  users: UserDoc[];
  modalTitle: string;
};

function ModalComponent({
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
}: ModalProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [options, setOptions] = useState<Suggestion[]>([]);

  const onKeyDown = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.key === "Enter" || key.key === "Tab") {
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (query && query.length > 0) {
      const res = await getSuggestions(query);
      if (res != null) {
        setShowSuggestions(true);
        setOptions([...res]);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandler = useCallback(debounce(handleSearch, 200), []);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onClick={() => setShowSuggestions(false)}
    >
      <form onSubmit={(event) => handleSubmit(event)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isAdmin && isTypeAdminFormFields(formFields) && (
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
          {isAdmin && isTypeAdminFormFields(formFields) && (
            <Form.Group className="mb-3" controlId="formDatetime">
              <Form.Label>Date and time</Form.Label>
              <Form.Control
                type="datetime-local"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
                name="timestamp"
                placeholder="Enter Calorie Amount"
                value={formFields.datePickerTimestamp}
              ></Form.Control>
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="formFood">
            <Form.Label>Food/Product name</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="Enter Food Name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
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
          <Button type="submit" variant="primary">
            Add
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ModalComponent;
