import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./mainPage";
import ExplorePage from "./explore";
import Login from "./login";

function App() {

  return (
    <div>
      <Routes>
        <Route exact path='/' element={<Login/>}/>
        <Route path='/home' element={<ExplorePage/>}/>
        <Route path='/songs' element={<MainPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
