/** JobCard.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The JobCard component displays a short, condensed summary of a job,
 * containing only essential information. At the top, the job's title, company,
 * location, and salary are listed, along with the user's compatibility with
 * the job. Below this, skill information is displayed, including required
 * years of experience, education, and skills.
 */


import { SkillCategory, Score } from "../static/types";
import { Warning } from ".";
import { mapEducation, mapSkillToColor, 
    mapYearsExperience, mapSalary, truncate, 
    mapScoreToColor} from "../static/utils";


interface JobCardProps {
    title: string,
    company: string,
    cityName: string,
    stateCode: string,
    minSalary: number,
    maxSalary: number,
    link: string,
    score: Score,
    skills: SkillCategory[],
    education: string,
    yearsExperience: number
};

function JobCard({ title, company, cityName, stateCode, minSalary,
    maxSalary, link, score, skills, education, yearsExperience }: JobCardProps) {
    const location = `${cityName}, ${stateCode}`;
    const salaryRange = mapSalary(minSalary, maxSalary);
    const experienceString = mapYearsExperience(yearsExperience);
    const educationString = mapEducation(education);
    const skillCategories = skills.length !== 0 ? skills.map(cat => 
        <div key={cat.category} className="jobCardSkillCategory">
            <div className="jobCardCategoryName">
                <p>{cat.category}</p>
            </div>
            {cat.skills.map(skill =>
                <div key={skill.name}
                    className="jobCardSkill" 
                    style={{borderColor: mapSkillToColor(skill.name)}}
                >
                    <p>{truncate(skill.name, 30)}</p>
                </div>
            )}
        </div>
    ) : <p>None specified</p>
    const scoreColor = mapScoreToColor(score.score);
    const isOverqualified = score.overqualifiedEdu
                            && score.overqualifiedSkills
                            && score.overqualifiedYears;

    return (
        <div className="jobCard">
            { isOverqualified && 
                <Warning message="You may be overqualified for this job"/>
            }
            <div className="jobCardHeader">
                <div className="jobCardHeaderLeft">
                    <h2>{title}</h2>
                    <p>
                        {company}{company ? <br/> : <></>}
                        {location}{location ? <br/> : <></>}
                        {salaryRange}{salaryRange ? <br/> : <></>}
                    </p>
                </div>
                <div className="jobCardHeaderRight">
                    <div className="scoreSmall" style={{borderColor: scoreColor}}>
                        <h3>{Math.round(score.score)}</h3>
                    </div>
                    <div>
                        <p>COMPATIBILITY</p>
                    </div>
                </div>
            </div>
            <div className="jobCardExperienceEducation">
                <div className="jobCardSection">
                    <h3>Experience</h3>
                    <p>{experienceString}</p>
                </div>
                <div className="jobCardSection">
                    <h3>Education</h3>
                    <p>{educationString}</p>
                </div>
            </div>
            <div className="jobCardSection">
                <h3>Skills</h3>
                {skillCategories}
            </div>
        </div>
    )
}

export default JobCard;
