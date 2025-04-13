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
                {/* <Modal.Header closeButton>
                    <Modal.Title><h2>{currentJob?.title}</h2></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <JobSummary jobData={currentJob}/>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleCloseModal}>Close</button>
                    <button type="submit">Apply</button>
                </Modal.Footer> */}
                <JobSummary jobData={currentJob} />
            </Modal>
        </div>
    )
}

export default JobList;
