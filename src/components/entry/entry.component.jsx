import { Button } from "react-bootstrap";

const Entry = ({ name, timestamp, calories, user, handleDelete, showEdit }) => {
  const date = new Date(timestamp.seconds * 1000);
  return (
    <tr>
      {user != null && <td>{user}</td>}
      <td>{name}</td>
      <td>{date.toLocaleString()}</td>
      <td>{calories}</td>
      {user != null && (
        <td>
          <Button variant="primary" onClick={showEdit}>
            Edit
          </Button>
          <Button variant="danger">Delete</Button>
        </td>
      )}
    </tr>
  );
};

export default Entry;
