import React from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
    isLoggedIn: boolean;
}

function Navbar({ isLoggedIn }: NavbarProps) {
    return (
        <div>
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/job-search">Job Search</NavLink></li>
                    <li><NavLink to="/skill-search">Skill Search</NavLink></li>
                    {isLoggedIn ? 
                    <li><NavLink to="/profile">Profile</NavLink></li> 
                    // Put logout button here
                    :
                    <li><NavLink to="/login">Log in</NavLink></li>
                    }
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;