import { useState, useEffect } from "react";
import {
  getFoodEntries,
  addFoodEntry,
} from "../../utils/firebase/firebase.util";
import { Button } from "react-bootstrap";
import ModalComponent from "../../components/modal/modal.component";
import Entry, { FoodEntry } from "../../components/entry/entry.component";
import InviteComponent from "../../components/invite/invite.component";

export type FormFields = {
  name: string;
  calories: number;
};

const defaultFormFields = {
  name: "",
  calories: "",
};

function makeDates(foodEntries: FoodEntry[]) {
  let dates = foodEntries.filter(onlyUnique).map((val, index) => {
    return new Date(val.timestamp.seconds * 1000).setHours(0, 0, 0, 0);
  });
  const datesSet = [...new Set(dates)];
  const timestamps = datesSet.map((val, index) => {
    return { timestamp: val };
  });
  const timestampsWithCalories: { timestamp: number; calories: number }[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    timestampsWithCalories.push({
      calories: foodEntries
        .filter((val, index) =>
          compareDates(val.timestamp, timestamps[i].timestamp)
        )
        .reduce((prev, curr) => {
          return prev + Number(curr.calories);
        }, 0),
      timestamp: timestamps[i].timestamp,
    });
  }
  dates = Array.from(dates);
  return dates;
}

function compareDates(d1, d2) {
  const date1 = new Date(d1.seconds * 1000);
  const date2 = new Date(d2);
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function Journal() {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [foodEntries, setEntries] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    ...JSON.parse(localStorage.getItem("user")),
  });
  const [showInvite, setShowInvite] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFoodEntries(currentUser, new Date());

        setDates(makeDates(response));
        setEntries(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setShow(false);
    resetFormFields();
  };
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
    if (formFields.name === "" || formFields.calories === "") {
      alert("One of the fields is empty");
      return;
    }

    try {
      const newEntry = await addFoodEntry(currentUser, formFields);
      setEntries([newEntry, ...foodEntries]);
      setDates(makeDates([newEntry, ...foodEntries]));
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
    <>
      <div style={{ margin: "2rem 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
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
      </div>
      <div style={{ margin: "2rem 0" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Calories</th>
              <th>Over Limit</th>
            </tr>
          </thead>
          <tbody>
            {dates.map((val, index) => {
              const date = new Date(val.timestamp);
              return (
                <tr key={index}>
                  <td>
                    {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
                  </td>
                  <td>{val.calories}</td>
                  <th>
                    {val.calories > currentUser.dailyCalorieLimit
                      ? "Yes"
                      : "No"}
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
    </>
  );
}

export default Journal;
