import data from "./skills.json";
import { mapReplace, isInteger, anyFromListIn, escapeRegExp } from "./utils";
import { SkillDict, SkillJson, EducationLevels,
    StringMap, JobRequirements } from "./types";

// String versions of numbers (for years of experience parsing)
const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "ten", "eleven", "twelve", "thirteen",
    "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
    "nineteen", "twenty"];

// Education levels and their common associated terms/phrases
const education: EducationLevels = {
    high_school: ["high school diploma", "high school grad", "ged",
                  "high school equiv", "hs diploma"],
    associate: ["associate degree", "associates degree", 
                "associate's degree", "a.s.", "a.a.", "a.a.s."],
    bachelor: ["bachelor", "bachelors", "b.s.", "b.a.", "bs", "ba", 
               "undergraduate degree", "undergraduate's degree",
               "four year degree", "4 year degree"],
    master: ["master's", "master degree", "m.s.", "m.a.", 
             "masters degree", "mba", "m.b.a", "graduate degree"],
    doctorate: ["doctorate", "doctoral", "phd", "ph.d", "d.sc.",
                "postgraduate degree"]
};

// When searching for skills, we check if they are surrounded by
// any two characters from this expression
const ignore = " !\"\'\\`()\n\t,:;=<>?\./’\*";

// Assert that skill data has the right format
const skills: SkillJson = data;

/**
 * Preprocess a job description by making it lowercase, removing newlines, 
 * and removing special characters.
 * @param jobDesc Original job description to be processed
 * @returns Processed job description
 */
export function preprocess(jobDesc: string): string {
    // Turn job description to lowercase and pad it with spaces
    // for regex search
    const newDesc = " " + jobDesc.toLowerCase() + " ";

    // Replace characters
    const charMap = { "\n": " ", "\t": " ", "\\": "", "’": "\'" };
    return mapReplace(newDesc, charMap);
}

/**
 * Search a job description for a specified search term.
 * @param query A string value to be found in the job description
 * @param jobDesc Job description to be searched
 * @returns `true` if the term was found, `false` otherwise
 */
export function search(query: string, jobDesc: string): boolean {
    // We want to find the query term with one of the ignore characters on
    // both sides
    const pattern = "[" + ignore + "]" 
                  + escapeRegExp(query.toLowerCase()) 
                  + "[" + ignore + "]";

    // Return true if query term was found (i.e., it has an index not equal to -1)
    return jobDesc.search(pattern) != -1;
}

export function extract(jobDesc: string): JobRequirements {
    jobDesc = preprocess(jobDesc);
    const skills = skillExtract(jobDesc);
    const education = educationExtract(jobDesc);
    const experience = experienceExtract(jobDesc);

    return {
        skills: skills,
        education: education,
        experience: experience
    }
}

/**
 * Extract all skills from a job description as a list.
 * @param jobDesc Preprocessed job description
 * @returns A [category, skills] dictionary containing all skills found in the
 *          job description. A category with no skills found will have an empty
 *          skills list.
 */
function skillExtract(jobDesc: string): SkillDict {
    // Keep track of skills found in a dictionary
    const skillsFound: SkillDict = {
        "Database Management": [],
        "Fields": [],
        "Frameworks": [],
        "Languages": [],
        "Libraries": [],
        "Methodologies": [],
        "Operating Systems": [],
        "Tools": [],
        "Web Development": [],
    };

    // Iterate through each category of skills
    Object.keys(skills).forEach(category => {
        for (const skill of skills[category]) {
            // Search for skill name in job description
            if (search(skill.name, jobDesc)) {
                skillsFound[category].push(skill.name);
            } else {
                // If skill was not found, then look for all aliases
                // in the job description
                for (const alias of skill.aliases) {
                    if (search(alias, jobDesc)) {
                        skillsFound[category].push(skill.name);
                        break;  // Stop searching if any alias is found
                    }
                }
            }
        }
    });

    return skillsFound;
}

/**
 * Extract an education level from a job description. If multiple
 * education levels are listed, the lowest one found will be returned.
 * @param jobDesc Preprocessed job description
 * @returns Lowest education level mentioned in description, as a string
 */
export function educationExtract(jobDesc: string): string {
    // Iterate through education levels. The level with the first
    // "hit" will count as the education level for that job.
    Object.keys(education).forEach(level => {
        for (const term of education[level]) {
            if (search(term, jobDesc)) {
                return level;
            }
        }
    });
    
    // No education level found - return blank string
    return "";
}

/**
 * Extract required years of experience from a job description.
 * If different years of experience are listed in different places in the
 * description, the highest will be chosen. If at any point a range of
 * years is given, the lowest of the range will be chosen.
 * @param jobDesc Preprocessed job description
 * @returns Required years of experience listed in job description
 */
export function experienceExtract(jobDesc: string): number {
    // Maintain a mapping of ranges to their respective minima
    let toReplace: StringMap = {};

    // List of possible hyphen characters that can be in a range
    const HYPHENS = ["-", "—", "–"];

    // Find all ranges in description and get their minimum value
    for (let i = 0; i < jobDesc.length; i++) {
        const ch = jobDesc[i];

        if (!HYPHENS.includes(ch)) {
            // If `ch` isn't a hyphen, then we don't care - move on
            continue;
        }

        // We now know that `ch` is a hyphen. First, read in characters
        // preceding the hyphen.
        let prev = "";
        let prevIndex = 0;

        if (i > 0) {
            let j = i - 1;

            // Flush out whitespace
            while (j >= 0 && jobDesc[j] === " ") {
                j--;
            }

            // Read in numbers, if any
            while (j >= 0 && isInteger(jobDesc[j])) {
                // Prepend numeric character to `prev`
                prev = jobDesc[j] + prev;
                j--;
            }

            prevIndex = j;
        }

        // Read in characters succeeding the hyphen
        let next = "";
        let nextIndex = 0;

        if (i < jobDesc.length - 1) {
            let j = i + 1;

            // Flush out whitespace
            while (j < jobDesc.length && jobDesc[j] === " ") {
                j++;
            }

            // Read in numbers, if any
            while (j < jobDesc.length && isInteger(jobDesc[j])) {
                next += jobDesc[j];
                j++;
            }

            nextIndex = j;
        }

        if (prev === " " || prev === "" || next === " " || next === "") {
            // No numbers before or after hyphen. This is not a
            // range, so move on
            continue;
        }

        // We know that both tokens before and after the hyphen are numbers,
        // so convert them to integers
        const num1 = Number(prev);
        const num2 = Number(next);
        const replacement = String(Math.min(num1, num2));

        // Add range to be replaced and its replacement to map
        const rangeToReplace = jobDesc.slice(prevIndex + 1, nextIndex);
        toReplace[rangeToReplace] = replacement;
    }

    // Make range replacements
    Object.keys(toReplace).forEach(range => {
        jobDesc = jobDesc.replace(range, toReplace[range]);
    });

    // Create character mapping by taking the "ignore" characters from
    // `ignore`, removing the whitespace character from `ignore`, and
    // mapping the remaining characters to a blank string
    let charMap: StringMap = {};
    for (const ch of ignore.replace(" ", "")) {
        charMap[ch] = "";
    }

    // Replace any hyphen with a space
    for (const ch of HYPHENS) {
        charMap[ch] = " ";
    }

    // Add additional special characters to replace
    charMap["+"] = "";
    charMap["#"] = "",
    charMap["*"] = "";

    // Make replacements
    jobDesc = mapReplace(jobDesc, charMap);

    // Split job description on spaces to get list of words
    const descList = jobDesc.split(/\s+/);

    // Perform preprocessing to turn words (e.g., "three") into numbers (3)
    for (let i = 0; i < descList.length; i++) {
        const word = descList[i];
        const num = numbers.indexOf(word.toLowerCase());

        if (num !== -1) {
            descList[i] = String(num);
        }
    }

    // Search for years of experience by finding mentions of the word
    // "year". Then, find if any words from `expKeywords` are also mentioned
    // within a certain range (searchRange). If they are, check the words
    // before the word "year" up to a certain limit (numberThreshold) to
    // see if there is a number
    const yearKeywords = ["year", "yr"];
    const expKeywords = ["experience", "skill", "require"];
    const searchRange = 7;
    const numberThreshold = 7;
    let yearsExperience = -1;
    
    for (let i = 0; i < descList.length; i++) {
        const word = descList[i];

        if (anyFromListIn(yearKeywords, word)) {
            const low = Math.max(0, i - searchRange);
            const high = Math.min(descList.length, i + searchRange);
            let experienceFound = false;

            // Look backwards for experience keywords
            for (let j = i; j >= low; j--) {
                if (anyFromListIn(expKeywords, descList[j])) {
                    experienceFound = true;
                    break;
                }
            }

            // Look forwards for experience keywords
            if (!experienceFound) {
                for (let j = i; j < high; j++) {
                    if (anyFromListIn(expKeywords, descList[j])) {
                        experienceFound = true;
                        break;
                    }
                }
            }

            if (!experienceFound) {
                // Couldn't find any experience keywords around the
                // word "year" in this case, so move on
                continue;
            }

            // At this point, an experience keyword has been found. We now look
            // before the word "year" to find if there is a number.
            const numberLimit = Math.max(0, i - numberThreshold);

            for (let j = i; j >= numberLimit; j--) {
                if (isInteger(descList[j])) {
                    // Found a number
                    const num = Number(descList[j]);
                    yearsExperience = Math.max(yearsExperience, num);
                }
            }
        } else if (word == "yoe") {
            // Look before the word "YoE" to find if there is a number
            const numberLimit = Math.max(0, i - numberThreshold);

            for (let j = i; j >= numberLimit; j--) {
                if (isInteger(descList[j])) {
                    // Found a number
                    const num = Number(descList[j]);
                    yearsExperience = Math.max(yearsExperience, num);
                }
            }
        }
    }

    // If no experience requirement was found, return 0. Otherwise,
    // return the number of years found.
    return yearsExperience >= 1 ? yearsExperience : 0;
}
