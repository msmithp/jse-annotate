import { useState } from "react";
import { Job, SkillCategory, ChartSkillData, 
    StateDensityData, StateData } from "../static/types";
import { mapDropdownSkills } from "../static/utils";
import { useAuthContext } from "../context/AuthProvider";
import { SkillChart, JobList, DashboardMap, 
    CountyMap, Dropdown } from "../components";
import axiosInstance from "../api/axiosInstance";
import { NavLink } from "react-router-dom";


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
                <div className="dashboardChartBox">
                    <h2 className="dashboardLeftHeader">Top Skills in {blankMapData.stateName}</h2>
                    <div className="dashboardChart">
                        <SkillChart 
                            title={""} 
                            skillData={chartData.skills} />
                    </div>
                </div>
                <div className="dashboardSelectAndMap">
                    <h2 className="dashboardLeftHeader">Density of Skill Demand</h2>
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
