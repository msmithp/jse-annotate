import { SkillCategory, State } from "./types";
import { polylinearGradient, linearGradient, lighten } from "./color";

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

    const gradientSeed = 6969;
    const lightenSeed = 89;

    const colors = ["#F7F740", "#F06424", "#DD0821", "#980F9D", 
        "#6915B8", "#2A84AE", "#07F562"];
    const hash = hashString(skill);

    const gradientPosition = (hash % gradientSeed) / gradientSeed;
    const lightenAmount = (hash % lightenSeed) - 35;

    const col = polylinearGradient(colors, gradientPosition);
    return lighten(col, lightenAmount);
}

/** Generate a (probably) unique hash value for a string */
function hashString(s: string): number {
    let hash = 0;
    
    for (let i = 0; i < s.length; i++) {
        let chr = s.charCodeAt(i);

        // Same as (hash * 31) + chr
        hash = ((hash << 5) - hash) + chr;

        // Convert hash to 32-bit integer
        hash |= 0;
    }

    return Math.abs(hash);
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
    const colors = ["#CA2E4B", "#FF801F", "#FFAD14", 
        "#FFE91F", "#98F74F", "#37E95E", "#2a9756"];
    return polylinearGradient(colors, score/100);
}

/** If a string is longer than `n` characters, shorten it to be `n` characters
 *  long with "..." appended */
export function truncate(str: string, n: number): string {
    return str.length > n ? `${str.substring(0, n)}...` : str;
}
