import { useState, useEffect, useContext } from "react";
import {
  getCalorieLimit,
  getFoodEntries,
  addFoodEntry,
} from "../../utils/firebase/firebase.util";
import styles from "./journal.module.scss";
import { UserContext } from "../../contexts/user.context";
import { Button, Modal, Placeholder } from "react-bootstrap";
import FormInput from "../../components/form-input/form-input.component";
import ModalComponent from "../../components/modal/modal.component";
import Entry from "../../components/entry/entry.component";
import InviteComponent from "../../components/invite/invite.component";

const defaultFormFields = {
  name: "",
  calories: "",
};

function Journal() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [foodEntries, setEntries] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    ...JSON.parse(localStorage.getItem("user")),
  });
  const [showInvite, setShowInvite] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFoodEntries(currentUser, new Date());
        setEntries(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseInvite = () => setShowInvite(false);
  const handleShowInvite = () => setShowInvite(true);

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
      resetFormFields();
    } catch (error) {
      console.log("error adding food: ", error);
    }
  };

  const handlePickSuggestion = (food_name, calories) => {
    setFormFields({ ...formFields, name: food_name, calories: calories });
  };

  const handleSelect = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div style={{ margin: "2rem 0" }}>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <div style={{ flex: 1 }}>
          <Button variant="primary" onClick={handleShowInvite}>
            Invite a friend
          </Button>
        </div>
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
      <ModalComponent
        formFields={formFields}
        show={show}
        isAdmin={false}
        handleChange={handleChange}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleSelect={handleSelect}
        handlePickSuggestion={handlePickSuggestion}
        modalTitle="Add new entry"
      ></ModalComponent>
      <InviteComponent
        formFields={formFields}
        show={showInvite}
        handleClose={handleCloseInvite}
        modalTitle="Invite your friend"
      ></InviteComponent>
    </div>
  );
}

export default Journal;
