import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home, JobSearch, SkillSearch, Login, 
  Profile, CreateAccount } from "./pages";
import { Navbar, PrivateRoute } from "./components";
import AuthProvider from "./context/AuthProvider";
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />

          <Routes>
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/skill-search" element={<SkillSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/" element={<Home />} />
            <Route path="create-account" element={<CreateAccount />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
