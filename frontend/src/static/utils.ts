import { SkillCategory, State } from "./types";
import { polylinearGradient, linearGradient } from "./color";

const GRAY = "#474747"

/** Map a list of Skill types to conform to the type expected by DropdownList */
export function mapDropdownSkills(skills: SkillCategory[]) {
    return skills.map(skill => ({
        category: skill.category,
        items: skill.skills.sort((x, y) => {
            if (x.name < y.name) {
                return -1;
            } else if (x.name > y.name) {
                return 1;
            } else {
                return 0;
            }
        })
    }));
}

/** Map a list of State types to conform to the type expected by DropdownList */
export function mapDropdownStates(states: State[]) {
    return [{
        category: "",
        items: states.map(state => ({
            id: state.id,
            name: state.name
        }))
    }];
}

/** Map a skill to a color based on its name */
export function mapSkillToColor(skill: string): string {
    if (skill === "") {
        // Return gray for no skill
        return GRAY;
    }

    const numColors = 5000;

    const colors = ["#F7F740", "#F04025", "#8F1DA5", "#2A84AE", "#07F562"];
    const n = hashString(skill, numColors);
    return polylinearGradient(colors, n/numColors);
}

/** Generate a hash value for a string `s` in modulo `n` */
function hashString(s: string, n: number): number {
    let hash = 0;
    const p = 59;  // somewhat arbitrary prime number

    for (let i = 0; i < s.length; i++) {
        hash += s[i].charCodeAt(0) * Math.pow(p, i);
    }

    return hash % n;
}

/** Generate a color between gray and a skill's color based on density.
 *  Higher density means that the resulting color will be closer to the skill's
 *  original color, while lower density means that the resulting color will be
 *  closer to gray.
 */
export function skillDensityGradient(skill: string, density: number): string {
    return linearGradient(GRAY, mapSkillToColor(skill), density);
}

/** Convert an education level to a display-ready string */
export function mapEducation(education: string): string {
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
export function mapSkills(skills: string[]): string {
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
export function mapYearsExperience(years: number): string {
    if (years < 1) {
        return "None specified";
    } else if (years >= 20) {
        return "20+ years";
    } else if (years === 1) {
        return "1 year";
    } else {
        return String(years) + " years";
    }
}

/** Convert a salary range (min and max) to a string containing rounded,
 *  comma-formatted numbers */
export function mapSalary(minSalary: number, maxSalary: number): string {
    if (minSalary < 1 && maxSalary < 1) {
        return "No salary specified";
    } else {
        return "$" + Math.floor(minSalary).toLocaleString() 
                    + " - $" + Math.floor(maxSalary).toLocaleString();
    }
}

/** Map a compatibility score between 0 and 100 to a hex code color */
export function mapScoreToColor(score: number): string {
    if (score >= 80) {
        return "#2a9756";
    } else if (score >= 60) {
        return "#ffe91f";
    } else if (score >= 40) {
        return "#ff801f"
    } else {
        return "#CA2E4B";
    }
}

/** If a string is longer than `n` characters, shorten it to be `n` characters
 *  long with "..." appended */
export function truncate(str: string, n: number): string {
    return str.length > n ? `${str.substring(0, n)}...` : str;
}
