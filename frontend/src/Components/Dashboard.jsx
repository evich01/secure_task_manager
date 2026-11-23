import api from "../../axios/api.js";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Dashboard() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    navigate("/login");
    return null;
  }

  const rtoken = userInfo.rtoken;

  async function handleLogout() {
    await api
      .delete("/logout", {
        data: {
          token: rtoken,
        },
      })
      .then((res) => {
        localStorage.removeItem("userInfo");
        navigate("/login");
        console.log(res.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }

  useEffect(() => {
    function getUser() {
      api
        .get(`/user/${userInfo.id}`)
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((error) => {
          console.error("error:", error);
        });
    }

    getUser();
  }, []);

  return (
    <>
      <div>Welcome, {user.name}</div>
      <div>You are {user.age} years old</div>
      <div>Your email: {user.email}</div>

      <div className="tasks">
        <Link to="/view-posts">
        <button>
        View Post

        </button>
        </Link>{" "}
        <Link to="/create-post">
        <button>
        Create Post
        </button>
        </Link>
        <Link to="/settings">
        <button>
        Settings
        </button>
        </Link>

        <input
          type="button"
          value="Logout"
          onClick={handleLogout}
        />
      </div>
    </>
  );
}