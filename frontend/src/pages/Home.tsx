/** Home.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The Home component is the home page for the React app. If the user is not
 * logged in, only a paragraph is displayed to tell them to log in. If the user
 * is logged in, then their dashboard is displayed.
 */


import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthProvider";
import { Dashboard }from "../components";
import { DashboardData } from "../static/types";
import axiosInstance from "../api/axiosInstance";


function Home() {
    // State variables
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const authContext = useAuthContext();
    const user = authContext.user;
    const logoutUser = authContext.logoutUser;

    useEffect(() => {
        let ignore = false;
        
        setDashboardData(null);
        if (user) {
            axiosInstance.get("api/get-dashboard-data/", {params: {id: user.user_id}})
            // axiosInstance.get("api/get-user/", {params: {id: user.user_id}})
            .then(res => {
                if (!ignore) {
                    setDashboardData(res.data.dashboardData);
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
                user && dashboardData ? (
                    <div>
                        <p>Welcome, {user.username}.</p>
                        <Dashboard 
                            chartData={{category: "Skills", skills: dashboardData.skills}}
                            jobs={dashboardData.jobs}
                            userSkills={dashboardData.userSkills}
                            blankMapData={dashboardData.stateData} />
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
