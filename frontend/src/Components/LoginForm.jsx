import {useNavigate} from 'react-router-dom';
import { useState, useEffect } from "react";
import api from "../../axios/api.js";

export function LoginForm() {
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  function getFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/login", formData);
      const userInfo = {
        id: res.data.user.id,
        role:res.data.user.role,
        token: res.data.accessToken,
        rtoken: res.data.refreshToken
      }
      // if(userInfo.status === "deactivated") return console.log('Your account has been deactivated')
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setUser(userInfo)
      if(userInfo.role === "admin"){
        navigate('/admin/dashboard',{user})
      }else{
        navigate('/dashboard',{user})
      }

    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <>
      <form onSubmit={handleLogin}>
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
    </>
  );
}
