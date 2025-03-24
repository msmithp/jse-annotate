import { useState, useEffect } from "react";
import { useAuthContext } from "src/context/AuthProvider";
import { User } from "../static/types";
import axios from "axios";


function Home() {
    // State variables
    const [userData, setUserData] = useState<User | null>(null);

    const authContext = useAuthContext();
    const user = authContext.user;

    useEffect(() => {
        let ignore = false;
        setUserData(null);
        if (user) {
            axios.get("http://127.0.0.1:8000/api/get-user/", {params: {id: user.user_id}})
            .then(res => {
                if (!ignore) {
                    setUserData(res.data);
                }
            })
        }

        return () => {
            ignore = true;
        }
    }, []);

    return (
        <div>
            <h1>Home</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.username}.</p>
                    {userData && 
                        <>
                            <p>Your data:</p>
                            <ul>
                                <li>Education: {userData.education}</li>
                                <li>Years of experience: {userData.yearsExperience}</li>
                                <li>Skills: {userData.skills.map(sk => "" + sk.name + ", ")}</li>
                            </ul>
                        </>
                    }
                </div>
            ) : (
                <p>Log in to see custom metrics.</p>
            )}
        </div>
    )
}

export default Home;
