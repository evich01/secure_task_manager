import api from "../../axios/api.js";
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

export function Settings() {
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState({});
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo.id) return <h1>Loading....</h1>;

  function getFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function updateUser(e) {
    e.preventDefault();

    await api
      .patch(`/user/${userInfo.id}`, formData)
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }

  useEffect(() => {
    api
      .get(`/user/${userInfo.id}`)
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
      <form onSubmit={updateUser} method="POST?_method=PATCH">
        <div>
          <label>Name:</label>
          <input name="name" onChange={getFormData} placeholder={user.name} />
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            onChange={getFormData}
            placeholder={user.age}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            onChange={getFormData}
            placeholder={user.email}
          />
        </div>

        <div>
          <label>Role:</label>
          <input type="text" value={user.role} disabled />
        </div>

        <div>
          <label>Status:</label>
          <input type="text" value={user.status} disabled />
        </div>
        <input type="submit" value="Submit" />
      </form>

      <h3>Update password</h3>
         <form onSubmit={updateUser} method="POST?_method=PATCH">
        
        <div>
          <label>Enter your current password:</label>
          <input
            type="password"
            name="current_password"
            onChange={getFormData}
            // placeholder={user.password}
          />
        </div>
           
        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="new_password"
            onChange={getFormData}
            // placeholder={user.email}
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
