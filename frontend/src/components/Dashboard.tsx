import { useState } from "react";
import { Job, SkillCategory, ChartSkillData, 
    StateDensityData, CountyMapData } from "../static/types";
import { mapDropdownSkills } from "../static/utils";
import { SkillChart, JobList, DashboardMap, 
    CountyMap, Dropdown } from "../components";

const mapData: StateDensityData = {
    stateData: {
        stateID: 3,
        stateName: "Delaware",
        stateCode: "DE"
    },
    countyData: [
        {countyID: 1, countyName: "Kent", countyFips: "10001", density: 0.2, numJobs: 3},
        {countyID: 2, countyName: "New Castle", countyFips: "10003", density: 0.1, numJobs: 2},
        {countyID: 3, countyName: "Sussex", countyFips: "10005", density: 0.9, numJobs: 27}
    ],
    skillData: {
        skillID: 3,
        skillName: "Python"
    }
};

const blankMapData = {
    stateData: {
        stateID: 3,
        stateName: "Delaware",
        stateCode: "DE"
    },
    countyData: [
        {countyID: 1, countyName: "Kent", countyFips: "10001"},
        {countyID: 2, countyName: "New Castle", countyFips: "10003"},
        {countyID: 3, countyName: "Sussex", countyFips: "10005"}
    ],
}

interface DashboardProps {
    chartData: ChartSkillData,
    jobs: Job[],
    userSkills: SkillCategory[],
    blankMapData: CountyMapData
}

function Dashboard({ chartData, jobs, userSkills }: DashboardProps) {
    const [selected, setSelected] = useState(-1);

    function onChange(id: number): void {
        setSelected(id);
        console.log("Changing to skill " + id);
    }

    return (
        <div>
            <div>
                <Dropdown 
                    values={mapDropdownSkills(userSkills)}
                    selected={selected}
                    categories={true}
                    onChange={onChange} />
                {selected !== -1 ? (
                    <DashboardMap stateDensity={mapData} />
                ) : (
                    <CountyMap mapData={blankMapData} />
                )}
            </div>
            <div style={{ height: "300px" }}>
                <SkillChart title={"test"} skillData={chartData.skills} />
            </div>
            <div>
                <JobList jobs={jobs}/>
            </div>
        </div>
    )
}

export default Dashboard;
