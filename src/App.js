import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import SplashScreen from "./Components/SplashScreen"; // Import the splash screen
import MyActivity from "./Components/MyActivity";
import Footer from "./Components/Footer";
import UserProfile from "./Components/UserProfile";
import LeaderBoard from "./Components/LeaderBoard";
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import AboutUs from "./Components/AboutUs";
import Feed from "./Components/Feed";
import Chat from "./Components/Chat";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const userId = "user_1729172812032";

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route
            path="/Registration"
            element={<Registration userId={userId} />}
          />
          <Route path="/MyActivity" element={<MyActivity userId={userId} />} />
          <Route
            path="/UserProfile"
            element={<UserProfile userId={userId} />}
          />
          <Route path="/LeaderBoard" element={<LeaderBoard />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Feed" element={<Feed />} />
          <Route path="/Chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
      <SplashScreen />
    </div>
  );
}

export default App;
