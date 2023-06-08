import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from "../helpers/AuthContext";

function App() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();
  const [LikedPosts, setLikedPosts] = useState([]);
  const authState = useContext(AuthContext);

  const pushToRoute = (routePath) => {
    navigate(routePath, { replace: false });
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios.post("http://localhost:3001/likes", {PostId: postId}, {headers: {accessToken: localStorage.getItem("accessToken")}})
    .then((response) => {
      setListOfPosts(listOfPosts.map((post) => {
        if (post.id === postId){
          if (response.data.liked){
            return{...post, Likes: [...post.Likes, 0], Liked: true};
          }else{
            const likesArray = post.Likes
            likesArray.pop()
            return{...post, Likes: likesArray, Liked: false}
          }
        }else{
          return post;  
        }
      }))

      if (LikedPosts.includes(postId)){
        setLikedPosts(LikedPosts.filter((id) => {return id !== postId;}))
      }else{
        setLikedPosts([...LikedPosts, postId])
      }
    })
  }
  return (
    <div className="App">
      {listOfPosts.map((value, key) => {
        return (
          <div className="post">
          <div className="title"> {value.title} </div>
           <div className="body" onClick={ () => {pushToRoute(`/post/${value.id}`)}}>{value.postText}</div>
           <div className="footer">
              <div className="username">{value.username}</div>
              <div className="buttons">
                <FavoriteIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    LikedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>          
        );
      })}
    </div>
  );
}

export default App;