import { SkillCategory } from "../static/types";
import { mapEducation, mapSkillToColor, 
    mapYearsExperience, mapSalary, truncate, 
    mapScoreToColor} from "../static/utils";


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

interface JobCardProps {
    title: string,
    company: string,
    cityName: string,
    stateCode: string,
    minSalary: number,
    maxSalary: number,
    link: string,
    score: number,
    skills: string[],
    education: string,
    yearsExperience: number
};

function JobCard({ title, company, cityName, stateCode, minSalary,
    maxSalary, link, score, skills, education, yearsExperience }: JobCardProps) {
    const location = `${cityName}, ${stateCode}`;
    const salaryRange = mapSalary(minSalary, maxSalary);
    const experienceString = mapYearsExperience(yearsExperience);
    const educationString = mapEducation(education);
    const skillCategories = skills.length !== 0 ? placeholderSkills.map(cat => 
        <div key={cat.category} className="jobCardSkillCategory">
            <div className="jobCardCategoryName">
                <p>{cat.category}</p>
            </div>
            {cat.skills.map(skill =>
                <div className="jobCardSkill" style={{borderColor: mapSkillToColor(skill.name)}}>
                    <p>{truncate(skill.name, 30)}</p>
                </div>
            )}
        </div>
    ) : <p>None specified</p>
    const scoreColor = mapScoreToColor(score);

    return (
        <div className="jobCard">
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
                        <h3>{Math.round(score)}</h3>
                    </div>
                    <div>
                        <p>COMPATIBILITY</p>
                    </div>
                </div>
            </div>
            <div className="jobCardSection">
                <h3>Experience</h3>
                <p>{experienceString}</p>
            </div>
            <div className="jobCardSection">
                <h3>Education</h3>
                <p>{educationString}</p>
            </div>
            <div className="jobCardSection">
                <h3>Skills</h3>
                {skillCategories}
            </div>
        </div>
    )
}

export default JobCard;
