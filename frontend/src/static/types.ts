export interface SkillCategory {
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

export interface Experience {
    id: number,
    years: string
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
    // skills: SkillCategory[],
    education: string,
    yearsExperience: number
}

export interface User {
    id: number,
    username: string,
    state: number,
    education: string,
    yearsExperience: number,
    skills: {
        id: number,
        name: string
    }[]
}

export interface ChartSkillData {
    category: string,
    skills: {
        id: number;
        skillName: string;
        occurrences: number;
    }[]
}

export interface StateSkillData {
    stateData: {
        stateID: number,
        stateName: string,
        stateCode: string
    },
    countyData: {
        countyID: number,
        countyName: string,
        countyFips: string,
        skillID: number,
        skillName: string,
        numJobs: number
    }[]
}

export interface StateDensityData {
    stateData: {
        stateID: number,
        stateName: string,
        stateCode: string
    },
    countyData: {
        countyID: number,
        countyName: string,
        countyFips: string,
        density: number,
        numJobs: number
    }[],
    skillData: {
        skillID: number,
        skillName: string
    }
}

export interface StateData {
    stateID: number,
    stateName: string,
    stateCode: string
}

export interface DashboardData {
    skills: {
        id: number,
        skillName: string,
        occurrences: number
    }[],
    jobs: Job[],
    userSkills: SkillCategory[],
    stateData: StateData
}
