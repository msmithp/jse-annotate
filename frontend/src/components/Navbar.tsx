import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "src/context/AuthProvider";


function Navbar() {
    const authContext = useAuthContext();
    const user = authContext.user;
    const logoutUser = authContext.logoutUser;

    return (
        <div className="navbar">
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/job-search">Job Search</NavLink></li>
                    <li><NavLink to="/skill-search">Skill Search</NavLink></li>
                    { user && 
                        <li><NavLink to="/profile">Profile</NavLink></li>
                    }
                    
                    { user ? (
                        <li className="logoutButton" 
                            style={{float: "right", cursor: "pointer"}} 
                            onClick={logoutUser}>
                                Log out
                        </li>
                    ) : (
                        <li style={{float: "right"}}><NavLink to="/login">Log in</NavLink></li>
                    )}
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;