import React from 'react';


export default function Login(props) {

  return (
    <div className="loginContainer">
      <h1>Welcome to Spindr</h1>
      <button className="loginBtn" ><a href="http://localhost:3000/login">Login with Spotify</a></button>
    </div>
  )
}