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

function AdminReport() {
  const [foodEntries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);

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

  return (
    <div style={{ margin: "2rem 0" }}>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th># of entries last 7 days</th>
            <th># of entries 7 days before that</th>
            <th>Average calories per day in last 7 days</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const usersEntries = foodEntries.filter(
              (entry) => entry.userId === user.id
            );
            const thisWeekEntries = usersEntries.filter(
              (entry) =>
                entry.timestamp.seconds > new Date().getTime() / 1000 - 604800
            );
            return (
              <tr>
                <td>{user.displayName}</td>
                <td>{thisWeekEntries.length}</td>
                <td>
                  {
                    usersEntries
                      //Check if entry is between last 7 and 14 days
                      .filter(
                        (entry) =>
                          entry.timestamp.seconds >
                            new Date().getTime() / 1000 - 604800 * 2 &&
                          entry.timestamp.seconds <
                            new Date().getTime() / 1000 - 604800
                      ).length
                  }
                </td>
                <td>
                  {Math.floor(
                    thisWeekEntries.reduce(
                      (prev, curr) => prev + Number(curr.calories),
                      0
                    ) / thisWeekEntries.length
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReport;
