import { useState } from "react";
import { Job, SkillCategory, ChartSkillData, 
    StateDensityData, StateData } from "../static/types";
import { mapDropdownSkills } from "../static/utils";
import { useAuthContext } from "../context/AuthProvider";
import { SkillChart, JobList, DashboardMap, 
    CountyMap, Dropdown } from "../components";
import axiosInstance from "../api/axiosInstance";
import { NavLink } from "react-router-dom";


const placeholderMapData: StateDensityData = {
    stateData: {
        stateID: 3,
        stateName: "Delaware",
        stateCode: "DE"
    },
    countyData: [
        {countyID: 1, countyName: "Kent", 
            countyFips: "10001", density: 0.2, numJobs: 3},
        {countyID: 2, countyName: "New Castle", 
            countyFips: "10003", density: 0.1, numJobs: 2},
        {countyID: 3, countyName: "Sussex", 
            countyFips: "10005", density: 0.9, numJobs: 27}
    ],
    skillData: {
        skillID: 3,
        skillName: "Python"
    }
};

interface DashboardProps {
    chartData: ChartSkillData,
    jobs: Job[],
    userSkills: SkillCategory[],
    blankMapData: StateData
}

function Dashboard({ chartData, jobs, userSkills, blankMapData }: DashboardProps) {
    const [selected, setSelected] = useState(-1);
    const [mapData, setMapData] = useState<StateDensityData | null>(null);

    const authContext = useAuthContext();
    const user = authContext.user;
    const logoutUser = authContext.logoutUser;

    function handleSkillChange(id: number): void {
        setSelected(id);
        console.log("Changing to skill " + id);

        if (!user) {
            logoutUser();
            return;
        }

        // Call to back-end to get map data for selected skill
        axiosInstance.get("api/get-density-data/", {params: {
            id: user.user_id,
            skill: id
        }}).then(res => {
            console.log(res.data.densityData);
            setMapData(res.data.densityData);
        }).catch(err => console.log(err))
    }

    return (
        <div className="dashboard">
            <div className="dashboardLeft">
                <div className="dashboardChart">
                    <SkillChart 
                        title={`Top Skills in ${blankMapData.stateName}`} 
                        skillData={chartData.skills} />
                </div>
                <div className="dashboardSelectAndMap">
                    <label className="dashboardStateSelect">
                        <p>Select a skill:</p>
                        <Dropdown 
                            values={mapDropdownSkills(userSkills)}
                            selected={selected}
                            categories={true}
                            onChange={handleSkillChange} />
                    </label>
                    {selected !== -1 && mapData != null ? (
                        <DashboardMap stateDensity={mapData} />
                    ) : (
                        <CountyMap stateData={blankMapData} />
                    )}
                </div>
            </div>
            <div className="dashboardRight">
                <h2 className="dashboardRightHeader">Your Top Jobs</h2>
                <div className="dashboardJobList">
                    <JobList jobs={jobs}/>
                </div>
                <NavLink to="/job-search">
                    <button className="moreJobsButton">See more jobs</button>
                </NavLink>
            </div>
        </div>
    )
}

export default Dashboard;
