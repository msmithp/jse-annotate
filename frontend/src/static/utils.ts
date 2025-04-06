import { Skill, State } from "./types";
import { polylinearGradient } from "./color";

/** Map a list of Skill types to conform to the type expected by DropdownList */
export function mapDropdownSkills(skills: Skill[]) {
    return skills.map(skill => ({
        category: skill.category,
        items: skill.skills
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
        return "#616263"
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
