import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import {
  getAllFoodEntries,
  getUsers,
  addFoodEntry,
  editFoodEntry,
  deleteFoodEntry,
} from "../../utils/firebase/firebase.util";
import Entry, { FoodEntry } from "../../components/entry/entry.component";
import ModalComponent from "../../components/modal/modal.component";
import { Button } from "react-bootstrap";
import { UserDoc } from "../../contexts/user.context";
import { FormFields } from "../journal/journal.component";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";

export type AdminFoodEntry = FoodEntry & {
  userId: string;
};

export function isTypeAdminFoodEntry(
  formFields: AdminFoodEntry | FoodEntry
): formFields is AdminFoodEntry {
  return (formFields as AdminFoodEntry).userId !== undefined;
}

export type AdminFormFields = FormFields & {
  datePickerTimestamp?: string;
  userId?: string;
  id: string;
};

const defaultFormFields: AdminFormFields = {
  userId: "",
  name: "",
  calories: 0,
  datePickerTimestamp: "",
  id: "",
};

function Admin() {
  // const [isLoading, setIsLoading] = useState(true);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [oldUserId, setOldUserId] = useState("");
  const [foodEntries, setEntries] = useState<AdminFoodEntry[]>([]);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [lastDocument, setLastDocument] = useState<FoodEntry>();
  // const [currentUser] = useState<UserData>({
  // ...JSON.parse(localStorage.getItem("user") || "{}"),
  // });
  const currentUser = useSelector(selectCurrentUser);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const listInnerRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        fetchData();
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllFoodEntries(lastDocument);
      const userDocs: UserDoc[] = await getUsers();
      setLastDocument(response[response.length - 1]);
      setEntries([...foodEntries, ...response]);
      setUsers(userDocs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setShow(false);
    resetFormFields();
  };
  const handleShow = () => setShow(true);

  const handleCloseEdit = () => {
    setOldUserId("");
    setShowEdit(false);
    resetFormFields();
  };

  const handleShowEdit = (id: string) => {
    const food = foodEntries.find((val) => val.id === id);
    if (food == null) {
      console.log("Something wrong at find handleShowEdit");
      return;
    }
    const timestamp = new Date(food.timestamp.seconds * 1000)
      .toISOString()
      .slice(0, 16);

    setOldUserId(food.userId);
    setFormFields({
      id: id,
      userId: food.userId,
      name: food.name,
      calories: food.calories,
      datePickerTimestamp: timestamp,
    });
    setShowEdit(true);
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      formFields.name === "" ||
      formFields.calories === 0 ||
      formFields.datePickerTimestamp === "" ||
      formFields.userId === ""
    ) {
      alert("One of the fields is empty");
      return;
    }

    try {
      const newEntry = await addFoodEntry(currentUser, formFields);
      if (newEntry != null && isTypeAdminFoodEntry(newEntry)) {
        setEntries([newEntry, ...foodEntries]);
      } else {
        console.log("Something went wrong adding new food entry");
      }
      setShow(false);
      resetFormFields();
    } catch (error) {
      console.log("error adding food: ", error);
    }
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      formFields.name === "" ||
      formFields.calories === 0 ||
      formFields.datePickerTimestamp === "" ||
      formFields.userId === ""
    ) {
      alert("One of the fields is empty");
      return;
    }
    try {
      const newEntry = (await editFoodEntry(
        oldUserId,
        formFields
      )) as AdminFoodEntry;
      const newFoodEntries = foodEntries.filter(
        (val) => val.id !== formFields.id
      );
      if (newEntry != null) {
        newFoodEntries.unshift(newEntry);
        setEntries(newFoodEntries);
      } else {
        console.log(
          "Something went wrong submitting edited entry: HandleEditSubmit"
        );
      }

      setShowEdit(false);
      resetFormFields();
    } catch (error) {
      console.log("error editing food: ", error);
    }
  };

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    entryData: FoodEntry
  ) => {
    event.preventDefault();
    try {
      await deleteFoodEntry(entryData);
      const newFoodEntries = foodEntries.filter(
        (val) => val.id !== entryData.id
      );
      setEntries(newFoodEntries);
      setShowEdit(false);
      resetFormFields();
    } catch (error) {
      console.log("error deleting food: ", error);
    }
  };

  const handlePickSuggestion = (food_name: string, calories: number) => {
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
      <div
        onScroll={onScroll}
        ref={listInnerRef}
        style={{ height: "500px", overflowY: "auto" }}
      >
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Food/Product Name</th>
              <th>Date time</th>
              <th>Calorie value</th>
              <th style={{ width: "150px" }}></th>
            </tr>
          </thead>
          <tbody>
            {/* {foodEntriesHtml} */}
            {foodEntries.map((val, index) => (
              <Entry
                key={val.id}
                entry={val}
                showEdit={handleShowEdit}
                handleDelete={handleDelete}
                userDisplayName={
                  users.find((user, index) => user.id === val.userId)
                    ?.displayName || ""
                }
              />
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={(e) => {
          fetchData();
        }}
      >
        Load More
      </button>
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
