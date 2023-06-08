import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from '../helpers/AuthContext';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  const pushToRoute = (routePath) => {
    navigate(routePath, { replace: false });
  };

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:3001/posts', {
          headers: { accessToken: localStorage.getItem('accessToken') },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(response.data.likedPosts.map((like) => like.PostId));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        'http://localhost:3001/likes',
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem('accessToken') } }
      )
      .then((response) => {
        setListOfPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0], Liked: true };
              } else {
                const likesArray = post.Likes.slice(0, -1);
                return { ...post, Likes: likesArray, Liked: false };
              }
            } else {
              return post;
            }
          })
        );

        setLikedPosts((prevLikedPosts) => {
          if (prevLikedPosts.includes(postId)) {
            return prevLikedPosts.filter((id) => id !== postId);
          } else {
            return [...prevLikedPosts, postId];
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      {listOfPosts.map((value, key) => (
        <div className="post" key={key}>
          <div className="title"> {value.title} </div>
          <div
            className="body"
            onClick={() => {
              pushToRoute(`/post/${value.id}`);
            }}
          >
            {value.postText}
          </div>
          <div className="footer">
            <div className="username">{value.username}</div>
            <div className="buttons">
              <FavoriteIcon
                onClick={() => {
                  likeAPost(value.id);
                }}
                className={likedPosts.includes(value.id) ? 'unlikeBttn' : 'likeBttn'}
              />
              <label> {value.Likes.length}</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
