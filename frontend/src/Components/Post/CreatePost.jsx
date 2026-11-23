import api from "../../../axios/api.js";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function CreatePost() {
  const [formData, setFormData] = useState({});
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token;
  function getFormData(e) {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  async function createPost() {
    api
      .post(
        "/create",
        {
          post: formData.post,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }

  useEffect(() => {
    console.log(formData.post);
  }, [formData]);
  return (
    <>
      <form onSubmit={createPost}>
        <textarea
          name="post"
          height="10"
          placeholder="Got anything you want to post...."
          onChange={getFormData}
        ></textarea>
        <input type="submit" value="Submit" />
      </form>
      <Link to="/dashboard">
        <button>
      back
      </button>
      </Link>{" "}
      <Link to="/view-posts">
        <button>
      View posts
      </button>
      </Link>
    </>
  );
}
