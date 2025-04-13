import { useState } from "react";
import { Job, SkillCategory } from "../static/types";
import { mapSalary, mapYearsExperience, mapEducation, mapScoreToColor, mapSkillToColor } from "src/static/utils";


const placeholderSkills: SkillCategory[] = [
    {
        category: "Languages",
        skills: [
            {id: 5, name: "Python"},
            {id: 8, name: "JavaScript"},
            {id: 9, name: "Java"},
            {id: 10, name: "C++"},
            {id: 11, name: "C"},
            {id: 8, name: "Rust"},
            {id: 8, name: "Golang"},
            {id: 8, name: "Haskell"},
            {id: 8, name: "TypeScript"}
        ]
    },
    {
        category: "Methodologies",
        skills: [
            {id: 10, name: "Agile"}
        ]
    },
    {
        category: "Database Management",
        skills: [
            {id: 100, name: "PostgreSQL"},
            {id: 120, name: "SQL"}
        ]
    }
]


interface HeaderProps {
    title: string,
    company: string,
    cityName: string,
    stateCode: string,
    minSalary: number,
    maxSalary: number,
    score: number
}

function Header({ title, company, cityName, 
    stateCode, minSalary, maxSalary, score }: HeaderProps) {
    const location = `${cityName}, ${stateCode}`;
    const salaryRange = mapSalary(minSalary, maxSalary);
    
    return (
        <div className="jobSummaryHeader">
            <div className="jobSummaryHeaderLeft">
                <h1>{title}</h1>
                <p>
                    {company}<br/>
                    {location}<br/>
                    {salaryRange}
                </p>
            </div>
            <div className="jobSummaryHeaderRight">
                <Score score={Math.round(score)}/>
            </div>
        </div>
    )
}


interface ScoreProps {
    score: number
}

function Score({ score }: ScoreProps) {
    const scoreColor = mapScoreToColor(score);

    return (
        <div className="jobSummaryScore">
            <div className="score" style={{borderColor: scoreColor}}>
                <h1>{score}</h1>
            </div>
            <p>COMPATIBILITY</p>
        </div>
    )
}

interface RequirementsProps {
    experience: number,
    education: string,
    skills: SkillCategory[]
}

function Requirements({ experience, education, skills }: RequirementsProps) {
    const experienceString = mapYearsExperience(experience);
    const educationString = mapEducation(education);
    const skillCategories = skills.length !== 0 ? skills.map(cat => 
        <div key={cat.category} className="jobSummarySkillCategory">
            <div className="jobSummarySkillCategoryName">
                <p>{cat.category}</p>
            </div>
            {cat.skills.map(skill =>
                <div className="jobSummarySkill" style={{borderColor: mapSkillToColor(skill.name)}}>
                    <p>{skill.name}</p>
                </div>
            )}
        </div>
    ) : <p>None specified</p>

    return (
        <div className="jobSummaryRequirements">
            <div className="jobSummaryRequirementsTop">
                <div className="jobSummaryRequirementsExperience">
                    <h2>Experience</h2>
                    <p>{experienceString}</p>
                </div>
                <div className="jobSummaryRequirementsEducation">
                    <h2>Education</h2>
                    <p>{educationString}</p>
                </div>
            </div>
            <div className="jobSummaryRequirementsSkills">
                <h2>Skills</h2>
                {skillCategories}
            </div>
        </div>
    )
}


interface DescriptionProps {
    description: string
}

function Description({ description }: DescriptionProps) {
    const [showMore, setShowMore] = useState(false);
    const MAX_DISPLAY_LENGTH = 500;

    return (
        <div className="jobSummaryDescription">
            <h2>Description</h2>
            {description === "" ? 
                <></>
            :
            <span style={{whiteSpace: "pre-line"}}>
                {description.length <= MAX_DISPLAY_LENGTH ? (
                    // If description is short, don't show the "show more" button
                    description 
                ) : (
                    <>
                        {showMore ? (
                            // Show more is enabled, so show full description
                            description 
                        ) : (
                            // Show more is disabled, so show truncated description
                            `${description.substring(0, MAX_DISPLAY_LENGTH)}...`
                        )}
                        
                        <p 
                            className="showMoreButton"
                            onClick={() => setShowMore(!showMore)}
                            style={{backgroundColor: "transparent", 
                                    borderColor: "transparent", 
                                    color: "lightblue", 
                                    cursor: "pointer",
                                    fontWeight: 500
                        }}>
                            {showMore ? "Show less" : "Show more"}
                        </p>
                    </>
                )}
            </span>
            }
        </div>
    )
}


interface JobSummaryProps {
    jobData: Job | null
}

function JobSummary({ jobData }: JobSummaryProps) {
    return (
        <div className="jobSummary">
            {jobData != null ? (
                <>
                    <Header title={jobData.title}
                        company={jobData.company}
                        cityName={jobData.cityName}
                        stateCode={jobData.stateCode}
                        minSalary={jobData.minSalary}
                        maxSalary={jobData.maxSalary}
                        score={jobData.score} />
                    <hr />
                    <Requirements experience={jobData.yearsExperience}
                        education={jobData.education}
                        skills={placeholderSkills}/>
                    <hr />
                    <Description description={jobData.description}/>
                </>
            ) : (
                <p>No job data</p>
            )}
        </div>
    )
}

export default JobSummary;
