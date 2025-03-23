import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "src/context/AuthProvider";


function Navbar() {
    // function logoutUser(event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) {
    //     event.preventDefault();
    //     console.log("Logging out");
    // }

    const authContext = useAuthContext();
    const user = authContext.user;
    const logoutUser = authContext.logoutUser;

    return (
        <div>
            <nav>
                <ul>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/job-search">Job Search</NavLink></li>
                    <li><NavLink to="/skill-search">Skill Search</NavLink></li>
                    { user && 
                        <li><NavLink to="/profile">Profile</NavLink></li>
                    }
                    
                    { user ? (
                        <li onClick={logoutUser}>Log out</li>
                    ) : (
                        <li><NavLink to="/login">Log in</NavLink></li>
                    )}
                    
                    
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;