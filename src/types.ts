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