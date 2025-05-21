import { JobRequirements, SkillDict } from "./types";
import { mapEducation, mapSkillToColor, mapYearsExperience, truncate } from "./utils";

export function formatRequirements(reqs: JobRequirements): string {
    const experience = mapYearsExperience(reqs.experience);
    const education = mapEducation(reqs.education);
    const skillCategories = formatSkills(reqs.skills);

    return (
        `<div>
            <h2>Requirements</h2>
            <div class="jobCardExperienceEducation">
                <div class="jobCardSection">
                    <h3>Experience</h3>
                    <p>${experience}</p>
                </div>
                <div class="jobCardSection">
                    <h3>Education</h3>
                    <p>${education}</p>
                </div>
            </div>
            <div class="jobCardSection">
                <h3>Skills</h3>
                ${skillCategories}
            </div>
        </div>`
    )
}

function formatSkills(skills: SkillDict): string {
    let formattedSkills = "";

    Object.keys(skills).forEach(category => {
        // Only add anything if category has skills
        if (skills[category].length > 0) {
            let skillBubbles = "";
            for (const skill of skills[category]) {
                skillBubbles += (
                    `
                    <div class="jobCardSkill" style="border-color: ${mapSkillToColor(skill)};">
                        <p>${truncate(skill, 30)}</p>
                    </div>`
                );
            }

            const categoryDiv = (
                `<div class="jobCardSkillCategory">
                    <div class="jobCardCategoryName">
                        <p>${category}</p>
                    </div>
                    ${skillBubbles}
                </div>`
            );

            formattedSkills += categoryDiv;
        }
    });

    if (formattedSkills === "") {
        formattedSkills = `<p>None specified</p>`;
    }

    return formattedSkills;
}