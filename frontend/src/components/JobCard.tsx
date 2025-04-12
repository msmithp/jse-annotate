import { useState } from "react";

interface Job {
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
    maxSalary, link, score, skills, education, yearsExperience }: Job) {
    // State variables
    const [showMore, setShowMore] = useState(false);

    /** Convert an education level to a display-ready string */
    function mapEducation(education: string): string {
        switch(education) {
            case "high_school":
                return "High school diploma";
            case "associate":
                return "Associate's degree";
            case "bachelor":
                return "Bachelor's degree";
            case "master":
                return "Master's degree";
            case "doctorate":
                return "Doctorate degree or higher";
            default:
                return "None specified";
        }
    }

    /** Convert an array of skill names to a string delimited by commas */
    function mapSkills(skills: string[]): string {
        if (skills.length === 0) {
            return "None specified";
        }

        let skillString = ""
        for (let i = 0; i < skills.length; i++) {
            skillString += skills[i];
            if (i !== skills.length - 1) {
                skillString += ", ";
            }
        }
        return skillString;
    }

    /** Convert a number of years of experience to a string */
    function mapYearsExperience(years: number): string {
        if (years < 1) {
            return "No prior experience requirements";
        } else if (years >= 20) {
            return "20+ years of experience necessary";
        } else if (years == 1) {
            return "1 year of experience necessary";
        } else {
            return String(years) + " years of experience necessary";
        }
    }

    /** Convert a salary range (min and max) to a string containing rounded,
     *  comma-formatted numbers */
    function mapSalary(minSalary: number, maxSalary: number): string {
        if (minSalary < 1 && maxSalary < 1) {
            return "None specified";
        } else {
            return "$" + Math.floor(minSalary).toLocaleString() 
                       + " - $" + Math.floor(maxSalary).toLocaleString();
        }
    }

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

                {showMore ? description : `${description.substring(0, 500)}...`}
                <button 
                    className="show-more-button"
                    onClick={() => setShowMore(!showMore)}
                    style={{backgroundColor: "transparent", 
                            borderColor: "transparent", 
                            color: "blue", 
                            cursor: "pointer"
                    }}>
                    {showMore ? "Show less" : "Show more"}
                </button>
            </span>
            }
            
        </div>
    )
}

export default JobCard;
