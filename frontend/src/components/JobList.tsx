/** JobList.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The JobList component is a list of JobCards. Each job must have a title,
 * company, city, state, minimum and maximum salary, URL, compatibility score,
 * list of skills (broken down by category), education level, and years of
 * experience.
 * 
 * A modal is implemented for each listed job (see JobSummary) with buttons
 * provided to close the modal or apply to the job.
 */


import { JobCard, JobSummary } from ".";
import Modal from "react-bootstrap/Modal";
import { Job } from "../static/types";
import { useState } from "react";


interface JobListProps {
    jobs: Job[]
};

function JobList({ jobs }: JobListProps) {
    const [showJob, setShowJob] = useState(false);
    const [currentJob, setCurrentJob] = useState<Job | null>(null)

    const jobCards = jobs.map(job => {
        return (
            <li key={job.id} value={job.id} onClick={_ => handleOpenModal(job)}>
                <JobCard 
                    title={job.title}
                    company={job.company}
                    cityName={job.cityName}
                    stateCode={job.stateCode}
                    minSalary={job.minSalary}
                    maxSalary={job.maxSalary}
                    link={job.link}
                    score={job.score}
                    skills={job.skills}
                    education={job.education}
                    yearsExperience={job.yearsExperience}
                />
            </li>
        )
    });

    function handleOpenModal(job: Job) {
        setCurrentJob(job);
        setShowJob(true);
    }

    function handleCloseModal() {
        setShowJob(false);
    }

    return (
        <div className="jobList">
            <ul>
                {jobCards}
            </ul>

            <Modal 
                show={showJob} 
                onHide={handleCloseModal}
                data-bs-theme="dark"
                dialogClassName="jobSummaryModal"
            >
                <JobSummary jobData={currentJob} />
                
                <div className="modalFooter">
                    <button onClick={handleCloseModal}>Cancel</button>
                    {currentJob && currentJob.link && 
                        <a href={currentJob!.link} target="_blank">
                            <button type="submit">Apply</button>
                        </a>
                    }
                </div>
            </Modal>
        </div>
    )
}

export default JobList;
