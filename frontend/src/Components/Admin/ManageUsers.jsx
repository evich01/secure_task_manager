import api from "../../../axios/api.js";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function ManageUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // if (users.length === 0) return <h1>Loading......</h1>;

  async function deleteUser(id) {
    await api
      .delete(`/user/${id}`)
      .then((res) => {
        window.location.reload();
        console.log(res.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }

async function updateUserStatus(id, currentStatus) {
  const newStatus =
    currentStatus === "activated"
      ? "deactivated"
      : "activated";

  try {
    const res = await api.patch(`/user/${id}`, {
      status: newStatus,
    });

    console.log(res.data);

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id
          ? { ...user, status: newStatus }
          : user
      )
    );
  } catch (error) {
    console.error("error:", error);
  }
}
  function directEdit(id) {
    localStorage.setItem("editId", id);
    navigate("/admin/edit-user");
  }

  useEffect(() => {
    api
      .get("/")
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }, []);
  return (
    <>
      <table border="2">
        <thead>
          <th>users</th>
          <th>role</th>
          <th>email</th>
          <th>action</th>
        </thead>
        <tbody>
          {users.map((user) => (
            <>
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>

                <td className="action-btns">
                  <input
                    type="button"
                    value="Edit"
                    onClick={() => {
                      directEdit(user._id);
                    }}
                  />
                  <input
                    type="button"
                    value={
                      (user.status === "activated" && "Deactivate") ||
                      (user.status === "deactivated" && "Activate")
                    }
                    onClick={() => {
                      updateUserStatus(user._id, user.status);
                    }}
                  />

                  <input
                    type="button"
                    value="Delete"
                    onClick={() => {
                      deleteUser(user._id);
                    }}
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <Link to="/admin/dashboard">back</Link>
    </>
  );
}
