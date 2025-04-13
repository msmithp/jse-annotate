import { useState } from "react";
import { Job } from "../static/types";
import { mapEducation, mapSkills, 
    mapYearsExperience, mapSalary } from "../static/utils";

interface JobCardProps {
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
};

function JobCard({ title, company, cityName, stateCode, description, minSalary,
    maxSalary, link, score, skills, education, yearsExperience }: JobCardProps) {
    // State variables
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="jobCard">
            <h2><a href={link}>{title}</a></h2>
            <h4>{company}</h4>
            <p>Your compatibility: <b>{Math.round(score)}/100</b></p>
            <p>{cityName}, {stateCode}</p>
            <p>Salary: {mapSalary(minSalary, maxSalary)}</p>
            <p>{mapYearsExperience(yearsExperience)}</p>
            <p>Education requirement: {mapEducation(education)}</p>
            <p>Prerequisite skills: {mapSkills(skills)}</p>
            {description === "" ? 
                <></>
            :
            <span style={{whiteSpace: "pre-line"}}>
                Description:{"\n"}

                {description.length <= 500 ? (
                    // If description is short, don't show the "show more" button
                    description 
                ) : (
                    <>
                        {showMore ? (
                            // Show more is enabled, so show full description
                            description 
                        ) : (
                            // Show more is disabled, so show truncated description
                            `${description.substring(0, 500)}...`
                        )}
                        
                        <button 
                            className="showMoreButton"
                            onClick={() => setShowMore(!showMore)}
                            style={{backgroundColor: "transparent", 
                                    borderColor: "transparent", 
                                    color: "blue", 
                                    cursor: "pointer"
                        }}>
                            {showMore ? "Show less" : "Show more"}
                        </button>
                    </>
                )}
            </span>
            }
            
        </div>
    )
}

export default JobCard;
