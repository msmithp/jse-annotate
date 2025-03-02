import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home, JobSearch, SkillSearch, Login, 
  Profile, CreateAccount } from "./pages";
import { Navbar } from "./components";
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Navbar isLoggedIn={false} />

        <Routes>
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/skill-search" element={<SkillSearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
          <Route path="create-account" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
