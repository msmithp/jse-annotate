import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom"
import {
  Home,
  JobSearch,
  SkillSearch,
  Login,
  Profile
} from "./pages";
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/job-search">Job Search</Link></li>
            <li><Link to="/skill-search">Skill Search</Link></li>
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/skill-search" element={<SkillSearch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
