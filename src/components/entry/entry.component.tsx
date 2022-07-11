import { Timestamp } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { UserData } from "../../contexts/user.context";

export type FoodEntry = {
  id: string;
  name: string;
  timestamp: Timestamp;
  calories: string;
};

type EntryProps = {
  entry: FoodEntry;
  userDisplayName: string;
  userId: string;
  handleDelete: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    entryData: { userId: string; foodId: string }
  ) => void;
  showEdit: (id: string) => void;
};

const Entry = ({
  entry,
  userDisplayName,
  userId,
  handleDelete,
  showEdit,
}: EntryProps) => {
  const { name, calories, id, timestamp } = entry;
  const date = new Date(timestamp.seconds * 1000);
  return (
    <tr>
      {userDisplayName != null && <td>{userDisplayName}</td>}
      <td>{name}</td>
      <td>{date.toLocaleString()}</td>
      <td>{calories}</td>
      {userDisplayName != null && (
        <td>
          <Button variant="primary" onClick={() => showEdit(id)}>
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={(event) =>
              handleDelete(event, { userId: userId, foodId: id })
            }
          >
            Delete
          </Button>
        </td>
      )}
    </tr>
  );
};

export default Entry;
