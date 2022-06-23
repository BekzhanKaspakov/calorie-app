import { useState, useEffect, useContext } from "react";
import {
  getCalorieLimit,
  getFoodEntries,
  addFoodEntry,
} from "../../utils/firebase/firebase.utils";
import styles from "./journal.module.scss";
import { UserContext } from "../../contexts/user.context";
import { Button, Modal, Placeholder } from "react-bootstrap";
import FormInput from "../../components/form-input/form-input.component";

const Entry = ({ name, timestamp, calories }) => {
  const date = new Date(timestamp.seconds * 1000);
  return (
    <tr>
      <td>{name}</td>
      <td>{date.toLocaleString()}</td>
      <td>{calories}</td>
    </tr>
  );
};

const defaultFormFields = {
  name: "",
  calories: 0,
};

function Journal() {
  // const [isLoading, setIsLoading] = useState(true);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [foodEntries, setEntries] = useState([]);
  const { currentUser } = useContext(UserContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log(currentUser);
    getFoodEntries(currentUser, new Date()).then((value) => {
      setEntries(value);
    });
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newEntry = await addFoodEntry(currentUser, formFields);
      setEntries([...foodEntries, newEntry]);
      setShow(false);
    } catch (error) {
      console.log("user sign in failed", error);
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        {currentUser.dailyCalorieLimit && (
          <div style={{ margin: "0 2rem" }}>
            Daily calorie limit: {currentUser.dailyCalorieLimit}
          </div>
        )}
        <Button variant="primary" onClick={handleShow}>
          Add New Food Entry
        </Button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Food/Product Name</th>
            <th>Date time</th>
            <th>Calorie value</th>
          </tr>
        </thead>
        <tbody>
          {foodEntries.map((val, index) => (
            <Entry
              key={val.id}
              name={val.name}
              timestamp={val.timestamp}
              calories={val.calories}
            />
          ))}
        </tbody>
      </table>
      <Modal show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add new entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormInput
              label="Enter Food Name"
              type="text"
              required
              onChange={handleChange}
              name="name"
              value={formFields.name}
            />

            <FormInput
              label="Enter Calorie Amount"
              type="number"
              required
              onChange={handleChange}
              name="calories"
              value={formFields.calories}
            />
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
    </>
  );
}

export default Journal;
