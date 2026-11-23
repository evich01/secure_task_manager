import api from "../../../axios/api.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function EditPost() {
  const [post, setPost] = useState([]);
  const [formData, setFormData] = useState({});
  const postId = localStorage.getItem("postId");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo.token;

  function getFormData(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function updatePost() {
    await api
      .patch(`/update/${postId}`, {
        post: formData.post,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }

  useEffect(() => {
    api
      .get(`/post/${postId}`)
      .then((res) => {
        console.log(res.data);
        setPost(res.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });

    console.log(token);
  }, []);

  return (
    <>
      <div>{post.post}</div>
      <form onSubmit={updatePost}>
        <input type="text" name="post" onChange={getFormData} />
        <input type="submit" value="Submit" />
      </form>
      <Link to="/view-posts">
        <button>
      View Posts
      </button>
      </Link>
    </>
  );
}
