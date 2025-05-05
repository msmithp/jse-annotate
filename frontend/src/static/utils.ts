/** utils.ts * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Contains utility functions used through the React app
 */


import { SkillCategory, State } from "./types";
import { polylinearGradient, linearGradient, lighten } from "./color";

const GRAY = "#474747"

/**
 * Map a list of Skill types to conform to the type expected by dropdown
 * components
 * @param skills A list of SkillCategory values
 * @returns A list of generified items for use in a Dropdown or DropdownList
 */
export function mapDropdownSkills(skills: SkillCategory[]) {
    return skills.map(skill => ({
        category: skill.category,
        items: skill.skills.sort((x, y) => {
            // Sort skill names alphabetically
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

/**
 * Map a list of State types to conform to the type expected by dropdown
 * components
 * @param states A list of State values
 * @returns A list of generified items for use in a Dropdown or DropdownList
 */
export function mapDropdownStates(states: State[]) {
    return [{
        category: "",
        items: states.map(state => ({
            id: state.id,
            name: state.name
        }))
    }];
}

/**
 * Map a skill to a color based on its name
 * @param skill The name of a skill
 * @returns A hex code of a color, with a leading pound sign (`#`) included
 */
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

    // Get a color from the gradient based on the gradient seed, then lighten
    // the color some amount based on the lighten seed
    const gradientPosition = (hash % gradientSeed) / gradientSeed;
    const lightenAmount = (hash % lightenSeed) - 35;

    const col = polylinearGradient(colors, gradientPosition);
    return lighten(col, lightenAmount);
}

/**
 * Generate a (probably) unique hash value for a string
 * @param s String to be hashed
 * @returns A (hopefully) unique integer value based on the contents of `s`
 */
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

/**
 * Generate a color between gray and a skill's color based on density.
 * Higher density means that the resulting color will be closer to the skill's
 * original color, while lower density means that the resulting color will be
 * closer to gray.
 * @param skill The name of a skill
 * @param density A density value between 0 and 1, inclusive
 * @returns A hex code of a color, with a pound sign (`#`) included
 */
export function skillDensityGradient(skill: string, density: number): string {
    /* The mathematical function used below gives a "boost" to counties that
       have low densities to make them more visible. It works like a linear
       function that has been "warped" above the y=x line. It looks like this:
                                        cx
                                    ------------
                                    (c - 1)x + 1
       where x is the density, between 0 and 1, of a county, and c is a tuning
       parameter, higher values of which make the function curve higher above 
       the y=x line.
    */
    const C = 2.5;
    const pct = (C * density) / (((C - 1) * density) + 1)
    return linearGradient(GRAY, mapSkillToColor(skill), pct);
}

/**
 * Convert an education level to a display-ready string
 * @param education An education level as a string. Options include
 *                  `"high_school"`, `"associate"`, `"bachelor"`,
 *                  `"master"`, and `"doctorate"`.
 * @returns A display-ready string to be shown to the user, based on
 *          `education`
 */
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

/**
 * Convert an array of skill names to a string delimited by commas
 * @param skills Array of skill names
 * @returns A string containing each skill name separated by commas, e.g.,
 *          `"TypeScript, React, Django, Python"`
 */
export function skillsToString(skills: string[]): string {
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

/**
 * Convert a number of years of experience to a display-ready string
 * @param years Number of years of experience
 * @returns A display-ready string to be shown to the user, based on `years`
 */
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

/**
 * Convert a salary range (min and max) to a string containing rounded,
 *  comma-formatted numbers
 * @param minSalary Low end of salary range
 * @param maxSalary High end of salary range
 * @returns A display-ready string for the salary, either `"No salary
 *          specified"` or something resembling `"$100,000 - 130,000"`
 */
export function mapSalary(minSalary: number, maxSalary: number): string {
    if (minSalary < 1 && maxSalary < 1) {
        return "No salary specified";
    } else {
        // toLocaleString automatically adds commas to numbers
        return "$" + Math.floor(minSalary).toLocaleString() 
                    + " - $" + Math.floor(maxSalary).toLocaleString();
    }
}

/**
 * Map a compatibility score between 0 and 100 to a hex code color
 * @param score A score between 0 and 100
 * @returns A hex code for a color, with a leading pound sign (`#`) included.
 *          Color is on a gradient from red (low score) to green (high score).
 */
export function mapScoreToColor(score: number): string {
    const colors = ["#CA2E4B", "#FF801F", "#FFAD14", 
        "#FFE91F", "#98F74F", "#37E95E", "#2a9756"];
    return polylinearGradient(colors, score/100);
}

/**
 * If a string is longer than `n` characters, shorten it to be `n` characters
 * long with "..." appended
 * @param str String to be potentially truncated
 * @param n Maximum number of characters to be displayed before the ellipsis
 * @returns If `str` is longer than `n`, then a truncated version of `str` with
 *          an ellipsis (`...`) added. Otherwise, just `str`.
 */
export function truncate(str: string, n: number): string {
    return str.length > n ? `${str.substring(0, n)}...` : str;
}
