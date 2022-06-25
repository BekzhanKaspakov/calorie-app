import { Button } from "react-bootstrap";

const Entry = ({
  id,
  name,
  timestamp,
  calories,
  user,
  handleDelete,
  showEdit,
  userId,
}) => {
  const date = new Date(timestamp.seconds * 1000);
  return (
    <tr>
      {user != null && <td>{user}</td>}
      <td>{name}</td>
      <td>{date.toLocaleString()}</td>
      <td>{calories}</td>
      {user != null && (
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
