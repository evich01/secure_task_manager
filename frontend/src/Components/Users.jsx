import api from "../../axios/api.js";
import { useEffect, useState } from "react";

export function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });      
  }, []);

  return (
    <>
      {users.map((user) => (
        <h1 key={user._id}>{user.name}</h1>
      ))}
    </>
  );
}
