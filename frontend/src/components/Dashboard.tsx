import { Job, ChartSkillData, StateDensityData } from "../static/types";
import { SkillChart, JobList } from "../components";

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

interface DashboardProps {
    chartData: ChartSkillData,
    jobs: Job[]
}

function Dashboard({ chartData, jobs }: DashboardProps) {
    return (
        <div>
            <div style={{ height: "300px" }}>
                <SkillChart title={"test"} skillData={chartData.skills} />
            </div>
            <JobList jobs={jobs}/>
        </div>
    )
}

export default Dashboard;
