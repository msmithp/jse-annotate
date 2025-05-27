export interface StringMap {
    [key: string]: string
}

export interface SkillDict {
    [key: string]: string[]
}

export interface SkillJson {
    [key: string]: {
        name: string,
        aliases: string[]
    }[]
}

export interface EducationLevels {
    [key: string]: string[]
}

export interface JobRequirements {
    skills: SkillDict,
    education: string,
    experience: number
}

export interface Site {
    name: string
    urls: string[],
    injectionSite: string,
    descriptionDivName: string,
    elementToWatch: string
}