import { useState, useEffect } from "react";
import {
  getAllFoodEntries,
  getAllUsers,
  addFoodEntry,
  editFoodEntry,
  deleteFoodEntry,
} from "../../utils/firebase/firebase.util";
import Entry from "../../components/entry/entry.component";
import ModalComponent from "../../components/modal/modal.component";
import { Button } from "react-bootstrap";

const defaultFormFields = {
  userId: "",
  name: "",
  calories: "",
  timestamp: "",
};

function Admin() {
  // const [isLoading, setIsLoading] = useState(true);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [oldUserId, setOldUserId] = useState("");
  const [foodEntries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  // const { currentUser } = useContext(UserContext);
  const [currentUser, setCurrentUser] = useState({
    ...JSON.parse(localStorage.getItem("user")),
  });
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllFoodEntries();
        const users = await getAllUsers();
        setEntries(response);
        setUsers(users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseEdit = () => {
    setOldUserId("");
    setShowEdit(false);
    resetFormFields();
  };

  const handleShowEdit = (id) => {
    const food = foodEntries.find((val) => val.id === id);
    const timestamp = new Date(food.timestamp.seconds * 1000)
      .toISOString()
      .slice(0, 16);

    setOldUserId(food.userId);
    setFormFields({
      foodId: id,
      userId: food.userId,
      name: food.name,
      calories: food.calories,
      timestamp: timestamp,
    });
    setShowEdit(true);
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSelect = (event) => {
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

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const newEntry = await editFoodEntry(oldUserId, formFields);
      const newFoodEntries = foodEntries.filter(
        (val) => val.id !== formFields.foodId
      );
      newFoodEntries.push(newEntry);
      setEntries(newFoodEntries);

      setShowEdit(false);
      resetFormFields();
    } catch (error) {
      console.log("error editing food: ", error);
    }
  };

  const handleDelete = async (event, entryData) => {
    event.preventDefault();
    try {
      await deleteFoodEntry(entryData);
      const newFoodEntries = foodEntries.filter(
        (val) => val.id !== entryData.foodId
      );
      setEntries(newFoodEntries);
      setShowEdit(false);
      resetFormFields();
    } catch (error) {
      console.log("error deleting food: ", error);
    }
  };

  const handlePickSuggestion = (food_name, calories) => {
    setFormFields({ ...formFields, name: food_name, calories: calories });
  };

  return (
    <div style={{ margin: "2rem 0" }}>
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
            <th>User</th>
            <th>Food/Product Name</th>
            <th>Date time</th>
            <th>Calorie value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {foodEntries.map((val, index) => (
            <Entry
              key={val.id}
              name={val.name}
              timestamp={val.timestamp}
              calories={val.calories}
              id={val.id}
              showEdit={handleShowEdit}
              handleDelete={handleDelete}
              userId={val.userId}
              user={
                users.find((user, index) => user.id === val.userId).displayName
              }
            />
          ))}
        </tbody>
      </table>
      <ModalComponent
        formFields={formFields}
        show={show}
        isAdmin={true}
        handleChange={handleChange}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleSelect={handleSelect}
        handlePickSuggestion={handlePickSuggestion}
        users={users}
        modalTitle="Add new entry"
      ></ModalComponent>
      <ModalComponent
        formFields={formFields}
        show={showEdit}
        isAdmin={true}
        handleChange={handleChange}
        handleClose={handleCloseEdit}
        handleSubmit={handleEditSubmit}
        handleSelect={handleSelect}
        handlePickSuggestion={handlePickSuggestion}
        users={users}
        modalTitle="Edit entry"
      ></ModalComponent>
    </div>
  );
}

export default Admin;
