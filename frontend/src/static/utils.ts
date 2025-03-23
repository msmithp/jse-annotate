import { Skill, State } from "./types";

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
