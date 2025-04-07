import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthProvider";
import { Dashboard }from "../components";
import { User } from "../static/types";
import axiosInstance from "../api/axiosInstance";

// Placeholder data
const dashboardData = {
    skills: [
        {id: 1, skillName: "Skill 1", occurrences: 10},
        {id: 2, skillName: "Skill 2", occurrences: 30},
        {id: 3, skillName: "Skill 3", occurrences: 2},
        {id: 4, skillName: "Skill 4", occurrences: 36},
        {id: 5, skillName: "Skill 5", occurrences: 19}
    ],

    jobs: [
         {
            id: 1, title: "Job 1", company: "The Company",
            cityName: "Wilmington", stateCode: "DE", description: "desc",
            minSalary: 100000, maxSalary: 120000, link: "https://www.job.com", score: 49,
            skills: ["Python", "Java"], education: "bachelor", yearsExperience: 2
        },
        {
            id: 2, title: "Job 2", company: "The Company 2",
            cityName: "Dover", stateCode: "DE", description: "desc",
            minSalary: 80000, maxSalary: 100000, link: "https://www.job.com", score: 68,
            skills: ["JavaScript", "SQL"], education: "bachelor", yearsExperience: 1
        }
    ],

    userSkills: [
        {
            category: "Languages",
            skills: [
                {id: 1, name: "Python"},
                {id: 2, name: "JavaScript"}
            ]
        },
        {
            category: "Methodologies",
            skills: [
                {id: 10, name: "Scrum"},
                {id: 12, name: "Agile"}
            ]
        }
    ]
}

function Home() {
    // State variables
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const authContext = useAuthContext();
    const user = authContext.user;
    const logoutUser = authContext.logoutUser;

    useEffect(() => {
        let ignore = false;
        setUserData(null);
        if (user) {
            axiosInstance.get("api/get-user/", {params: {id: user.user_id}})
            .then(res => {
                if (!ignore) {
                    setUserData(res.data);
                    setLoading(false);
                }
            }).catch(err => {console.log("Error in home page: " + err); logoutUser()});
        } else {
            setLoading(false);
        }

        return () => {
            ignore = true;
        }
    }, []);

    return (
        <div>
            <h1>Home</h1>
            {/* If currently loading, then set loading screen */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                // Check if user is not null (i.e., user is logged in)
                user ? (
                    <div>
                        <p>Welcome, {user.username}.</p>
                        {/* Check if user data was able to be loaded */}
                        {/* {userData && 
                            <>
                                <p>Your data:</p>
                                <ul>
                                    <li>Education: {userData.education}</li>
                                    <li>Years of experience: {userData.yearsExperience}</li>
                                    <li>Skills: {userData.skills.map(sk => "" + sk.name + ", ")}</li>
                                </ul>
                            </>
                        } */}
                        <Dashboard 
                            chartData={{category: "Skills", skills: dashboardData.skills}}
                            jobs={dashboardData.jobs}/>
                    </div>
                ) : (
                    // User is not logged in
                    <p>Log in to see custom metrics.</p>
                )
            )}
        </div>
    )
}

export default Home;
