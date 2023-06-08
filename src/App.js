import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import CreatePost from './pages/createPost';
import Post from './pages/post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import { AuthContext } from './helpers/AuthContext';
import axios from 'axios';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';

function App() {
  const [authState, setAuthState] = useState({
    username: '',
    id: 0,
    status: false,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/auth', {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        });
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      } catch (error) {
        console.log(error);
        setAuthState({ ...authState, status: false });
      }
    };

    checkAuthStatus();
  }, [authState]);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAuthState({ username: '', id: 0, status: false });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registration"> Registration</Link>
                </>
              ) : (
                <>
                  <Link to="/createPost">Create a Post</Link>
                  <Link to="/"> Home Page</Link>
                </>
              )}
              <div className="loggedInContainer">
                <h1>{authState.username} </h1>
                {authState.status && <button onClick={logout}> Logout</button>}
              </div>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
