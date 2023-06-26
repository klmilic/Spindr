import React from 'react';


export default function Login(props) {

  const handleClick = () => {
    window.location.href = '/api/user/login';
  }

  return (
    <div className="loginContainer">
      <h1>Welcome to Spindr</h1>
      <button className="loginBtn" onClick={handleClick}>Login with Spotify</button>
    </div>
  )
}