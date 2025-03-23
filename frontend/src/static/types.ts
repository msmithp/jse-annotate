export interface Skill {
    category: string,
    skills: {
        id: number,
        name: string
    }[]
}

export interface State {
    id: number;
    name: string;
}

export interface EducationLevel {
    value: string,
    level: string
}

export interface Job {
    id: number,
    title: string,
    company: string,
    cityName: string,
    stateCode: string,
    description: string,
    minSalary: number,
    maxSalary: number,
    link: string,
    score: number,
    skills: string[],
    education: string,
    yearsExperience: number
}
