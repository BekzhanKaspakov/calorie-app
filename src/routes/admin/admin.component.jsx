import { useState, useEffect } from "react";
import {
  getAllFoodEntries,
  getAllUsers,
  addFoodEntry,
} from "../../utils/firebase/firebase.utils";
import Entry from "../../components/entry/entry.component";
import ModalComponent from "../../components/modal/modal.component";
import { Button } from "react-bootstrap";

const defaultFormFields = {
  userId: null,
  name: "",
  calories: "",
  timestamp: "",
};

function Admin() {
  // const [isLoading, setIsLoading] = useState(true);
  const [formFields, setFormFields] = useState(defaultFormFields);
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
        console.log(users, response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSelect = (event) => {
    const { name, value } = event.target;
    console.log(event.target, name, value);

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
      console.log("user sign in failed", error);
    }
  };

  const handleEdit = async (event, entryId, newData) => {
    event.preventDefault();

    // try {
    //   const newEntry = await addFoodEntry(currentUser, formFields);
    //   setEntries([...foodEntries, newEntry]);
    //   setShow(false);
    // resetFormFields();
    // } catch (error) {
    //   console.log("user sign in failed", error);
    // }
  };

  const handleDelete = async (event, entryId) => {
    event.preventDefault();

    // try {
    //   const newEntry = await addFoodEntry(currentUser, formFields);
    //   setEntries([...foodEntries, newEntry]);
    //   setShow(false);
    // resetFormFields();
    // } catch (error) {
    //   console.log("user sign in failed", error);
    // }
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
              handleEdit={handleEdit}
              handleDelete={handleDelete}
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
        users={users}
      ></ModalComponent>
      <ModalComponent
        formFields={formFields}
        showEdit={showEdit}
        isAdmin={true}
        handleChange={handleChange}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleSelect={handleSelect}
        users={users}
      ></ModalComponent>
    </div>
  );
}

export default Admin;
