import { JobCard } from ".";

interface JobListProps {
    jobs: {
        id: number,
        title: string,
        company: string,
        cityName: string,
        stateCode: string,
        description: string,
        minSalary: number,
        maxSalary: number,
        link: string,
        score: number,
        skills: string[],
        education: string,
        yearsExperience: number
    }[]
};

function JobList({ jobs }: JobListProps) {
    const jobCards = jobs.map(job => {
        return (
            <div className="jobList">
                <ul>
                    <li key={job.id} value={job.id}>
                        <JobCard 
                            title={job.title}
                            company={job.company}
                            cityName={job.cityName}
                            stateCode={job.stateCode}
                            description={job.description}
                            minSalary={job.minSalary}
                            maxSalary={job.maxSalary}
                            link={job.link}
                            score={job.score}
                            skills={job.skills}
                            education={job.education}
                            yearsExperience={job.yearsExperience}
                        />
                    </li>
                </ul>
            </div>
        )
    });

    return (
        <>
            {jobCards}
        </>
    )
}

export default JobList;
