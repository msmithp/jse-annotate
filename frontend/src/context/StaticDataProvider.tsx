import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

// Placeholder data
const locationValues = [
    {id: 0, name: "Maryland"}, {id: 1, name: "Virginia"},
    {id: 2, name: "Pennsylvania"}, {id: 3, name: "West Virginia"},
    {id: 4, name: "Delaware"}
].sort((x, y) => {return x.name.charCodeAt(0) - y.name.charCodeAt(0)})
const educationValues = [
    {value: "", level: "Less than high school"},
    {value: "high_school", level: "High school diploma"},
    {value: "associate", level: "Associate's degree"},
    {value: "bachelor", level: "Bachelor's degree"},
    {value: "master", level: "Master's degree"},
    {value: "doctorate", level: "Doctorate degree or higher"}
]
const skillValues = [
    {
        category: "Programming Languages",
        skills: [
            {id: 0, name: "Python"}, {id: 1, name: "Java"},
            {id: 2, name: "C"}, {id: 3, name: "C++"}, {id: 4, name: "JavaScript"}
        ]
    },
    {
        category: "Web Frameworks",
        skills: [
            {id: 5, name: "Django"}, {id: 6, name: "React"}, {id: 7, name: "Node.js"},
            {id: 8, name: "Angular.js"}, {id: 9, name: "Express.js"}
        ]
    },
    {
        category: "Cloud Computing Platforms",
        skills: [
            {id: 10, name: "Amazon Web Services (AWS)"},
            {id: 11, name: "Google Cloud Platform (GCP)"},
            {id: 12, name: "Microsoft Azure"}
        ]
    }
]

interface Skill {
    category: string,
    skills: {
        id: number,
        name: string
    }[]
}

interface State {
    id: number;
    name: string;
}

interface EducationLevel {
    value: string,
    level: string
}

interface ContextType {
    skills: Skill[],
    eduLevels: EducationLevel[],
    states: State[]
}

interface StaticDataProviderProps {
    children?: React.ReactNode
}

const StaticDataContext = createContext<ContextType | undefined>(undefined);

export default function StaticDataProvider({ children }: StaticDataProviderProps) {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [states, setStates] = useState<State[]>([]);

    useEffect(() => {
        // Fetch skill and state data from back-end... eventually
        setSkills(skillValues);
        setStates(locationValues);
    }, []);

    const data = {
        skills: skills,
        eduLevels: educationValues,
        states: states
    };

    return (
        <StaticDataContext.Provider value={data}>
            {children}
        </StaticDataContext.Provider>
    )
}

export function useStaticData() {
    const context = useContext(StaticDataContext);
    if (context == undefined) {
        throw new Error("useStaticData must be used within a StaticDataProvider")
    }

    return context
}
