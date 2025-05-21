import { GRAY, lighten, linearGradient, polylinearGradient } from "./color";
import { StringMap } from "./types";

/**
 * Given a string `s`, replace all instances of each key in `map` with its
 * corresponding value.
 * @param s String in which replacement will occur
 * @param map A one-to-one mapping of strings to other strings. Each instance
 *            in `s` of a key in `map` will be replaced by the value in `map`
 *            corresponding to the key.
 * @returns String with replacements made
 */
export function mapReplace(s: string, map: StringMap): string {
    let newString = ""
    
    // Iterate through characters of `s`
    for (const c of s) {
        const replacement = map[c];

        if (replacement == undefined) {
            // If no replacement exists in the map, then append the original
            // character to the new string
            newString += c;
        } else {
            // Append the replacement character to the new string
            newString += replacement;
        }
    }

    return newString;
}

/**
 * Test if a string is an integer value
 * @param s String to be tested
 * @returns `true` if all characters in the string are numeric (i.e., `0`-`9`),
 *          `false` otherwise
 */
export function isInteger(s: string): boolean {
    for (const ch of s) {
        const ascii = ch.charCodeAt(0);

        // 48 is the ASCII value of 0 and 57 is the ASCII value of 9
        if (ascii < 48 || ascii > 57) {
            return false;
        }
    }

    return true;
}

/**
 * Test if any words from a list are contained within a target string
 * @param list List of words
 * @param target Target string
 * @returns `true` if any word in `list` is a substring of `target`, `false`
 *          otherwise
 */
export function anyFromListIn(list: string[], target: string): boolean {
    for (const wd of list) {
        // Check if `s` is contained within `target`
        if (target.includes(wd)) {
            return true;
        }
    }

    return false;
}

/**
 * Remove all HTML tags from a string of HTML
 * @param html String of HTML
 * @returns String of HTML with all tags removed
 */
export function removeHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape any regex special characters in a string with a backslash (`\`)
 * @param s String to be escaped
 * @returns Regex-escaped string
 */
export function escapeRegExp(s: string): string {
    // This regex replaces any instance of a special character and replaces it
    // with an escaped version of that character (i.e., escaped with a
    // backslash)
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
