import { useState, useEffect, useRef } from "react";
import { FoodEntry } from "../../components/entry/entry.component";
import { UserDoc } from "../../contexts/user.context";
import {
  getLastUsers,
  getUsersFoodEntries,
} from "../../utils/firebase/firebase.util";

function AdminReport() {
  const [foodEntries, setEntries] = useState<FoodEntry[]>([]);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [lastUser, setLastUser] = useState<UserDoc>();
  const listInnerRef = useRef<HTMLDivElement | null>(null);
  const [endReached, setEndReached] = useState(false);

  const fetchData = async () => {
    try {
      const newUsers = await getLastUsers(lastUser);
      if (newUsers.length === 0) {
        setEndReached(true);
        return;
      }
      const response = await getUsersFoodEntries(
        newUsers.map((val, index) => val.id)
      );
      setLastUser(newUsers[newUsers.length - 1]);
      setEntries([...foodEntries, ...response]);
      setUsers([...users, ...newUsers]);
    } catch (err) {
      console.error(err);
    }
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (!endReached && scrollTop + clientHeight === scrollHeight) {
        console.log("reached bottom");
        fetchData();
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onScroll={onScroll}
      ref={listInnerRef}
      style={{ height: "150px", overflowY: "auto", margin: "2rem 0" }}
    >
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
              <tr key={user.id}>
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
                  {thisWeekEntries.length
                    ? Math.floor(
                        thisWeekEntries.reduce(
                          (prev, curr) => prev + Number(curr.calories),
                          0
                        ) / thisWeekEntries.length
                      )
                    : 0}
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
