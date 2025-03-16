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

function JobCard({ title, cityName, stateCode, description, minSalary,
    maxSalary, link, score, skills, education, yearsExperience }: Job) {
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

    function mapSkills(skills: string[]): string {
        let skillString = ""
        for (let i = 0; i < skills.length; i++) {
            skillString += skills[i];
            if (i != skills.length - 1) {
                skillString += ", ";
            }
        }
        return skillString;
    }

    function mapYearsExperience(years: number): string {
        if (years < 1) {
            return "No prior experience requirements"
        } else if (years >= 20) {
            return "20+ years of experience necessary"
        } else {
            return String(years) + " years of experience necessary"
        }
    }

    return (
        <div>
            <h2><a href={link}>{title}</a></h2>
            <h4>Your compatibility: {score}/100</h4>
            <p>{cityName}, {stateCode}</p>
            <p>Salary: ${Math.floor(minSalary).toLocaleString()} - ${Math.floor(maxSalary).toLocaleString()}</p>
            <p>{mapYearsExperience(yearsExperience)}</p>
            <p>Education requirement: {mapEducation(education)}</p>
            <p>Prerequisite skills: {mapSkills(skills)}</p>
            <p>{description}</p>
        </div>
    )
}

export default JobCard;
