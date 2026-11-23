import api from "../../../axios/api.js";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function ViewPosts() {
  const [posts, setPosts] = useState([]);
  // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // const token = userInfo.token;
  const navigate = useNavigate();

  async  function deletePost(id) {
    await api.delete(`/delete/${id}`)
     .then((res) => {
       console.log((res.data));
       location.reload();
    })
    .catch((error) => {
      console.error("error:", error);
    });
  }

   function editPost(id){
    localStorage.setItem('postId', id);
    navigate('/edit-post');
  }

  useEffect(() => {

    api
      .get("/posts")
      .then((res) => {
        setPosts(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });

    console.log(posts);
  }, []);
  if(posts.length === 0) return <h1>Nothing to see here <Link to="/create-post">Create one</Link> </h1>

  return (
    <>
      {posts.map((post) => {
        return (
          <div key={post._id} id={post._id}>
            {post.post}
              <input type="button" value="Edit" onClick={
                () => editPost(post._id)
              }/>
              <input type="button" value="Delete"  onClick= {
                () => deletePost(post._id)
              }/>

          </div>
        );
      })}
      <Link to="/dashboard">
        <button>
      Home
      </button>
      </Link> 
    </>
  );
}
