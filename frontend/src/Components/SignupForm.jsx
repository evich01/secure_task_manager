import {useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../axios/api.js";

export function SignupForm() {
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  function getFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function createUser(e) {
    e.preventDefault();

    try {
      const res = await api.post("/signup", formData);
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <form onSubmit={createUser}>
      <div>
        <label>Name:</label>
        <input name="name" onChange={getFormData} />
      </div>

      <div>
        <label>Age:</label>
        <input type="number" name="age" onChange={getFormData} />
      </div>

      <div>
        <label>Email:</label>
        <input type="email" name="email" onChange={getFormData} />
      </div>

      <div>
        <label>Password:</label>
        <input type="password" name="password" onChange={getFormData} />
      </div>

      <input type="submit" value="Submit" />
    </form>
  );
}