import api from "../../../axios/api.js";
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

export function EditUser() {
  const [formData, setFormData] = useState({ });
  const [user, setUser] = useState({});
  const userId = localStorage.getItem("editId");

  if (!userId) return <h1>Loading....</h1>;

  function getFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function updateUser(e) {
    e.preventDefault();

    await api
      .patch(`/user/${userId}`,formData)
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }

  async function resetPassword(e){
    e.preventDefault();
    await api.patch(`/admin/reset/${userId}`, formData)
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.error('error:', error);
      
    })
  }

  useEffect(() => {
    api
      .get(`/user/${userId}`)
      .then((res) => {
        console.log(res.data.user);
        setUser(res.data.user);
      })
      .catch((error) => {
        console.error("error:", error);
      });

    console.log(user);
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <>
      <form onSubmit={updateUser}>
        <div>
          <label>Name:</label>
          <input name="name" onChange={getFormData} value={formData.name || user.name } />
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            onChange={getFormData}
            value={formData.age ||user.age}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            onChange={getFormData}
            value={formData.email ||user.email}
          />
        </div>

        <div>
          <label>Role:</label>
          <select name="role" onChange={getFormData} value={formData.role ||user.role}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div>
          <label>Status:</label>
          <select name="status" onChange={getFormData} value={formData.status ||user.status}>
            <option value="activated">Activated</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
        <input type="submit" value="Submit" />
      </form>

       <h3>Reset User password</h3>
         <form onSubmit={resetPassword} method="POST?_method=PATCH">
  
        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="new_password"
            onChange={getFormData}
          />
        </div>

                <input type="submit" value="Submit" />
      </form>

      <Link to='/dashboard'>
      <button>

      Back
      </button>
      </Link>
    </>
  );
}
