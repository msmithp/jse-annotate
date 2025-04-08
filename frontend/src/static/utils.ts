import { Skill, State } from "./types";
import { polylinearGradient, linearGradient } from "./color";

const GRAY = "#474747"

/** Map a list of Skill types to conform to the type expected by DropdownList */
export function mapDropdownSkills(skills: Skill[]) {
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
