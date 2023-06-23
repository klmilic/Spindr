import React from 'react';


export default function Login(props) {

  const handleClick = () => {
    // const currentHost = window.location.host;
    // const redirectUrl = currentHost + '/login';
    // console.log('currenthost: ', currentHost);
    // console.log('redirect url: ', redirectUrl);
    window.location.href = '/login';
  }

  return (
    <div className="loginContainer">
      <h1>Welcome to Spindr</h1>
      <button className="loginBtn" onClick={handleClick}>Login with Spotify</button>
    </div>
  )
}