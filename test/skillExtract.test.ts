import { extract, search, preprocess } from "../src/skillExtract";

const jobDesc = "Research, design, and develop computer and network software or specialized utility programs. Analyze user needs and develop software solutions, applying principles and techniques of computer science, engineering, and mathematical analysis. Update software or enhance existing software capabilities. May work with computer hardware engineers to integrate hardware and software systems and develop specifications and performance requirements. May maintain databases within an application area, working individually or coordinating database development as part of a team. Illustrative examples: Computer Applications Engineer, Computer Systems Engineer, Mobile Applications Developer, Software Applications Architect, Software Engineer, Systems Software Developer\n\n\nResponsibilities\n\nDesign, develop, and deploy scalable data solutions in the cloud using Databricks, AWS, Python, Spark, and SQL.\nDesign, develop, and deploy dashboard application visualizations using Qlik\nCollaborate with clients to understand their data requirements and provide tailored solutions that drive business valuation\nEnsure the robustness and reliability of data pipelines and workflows\n\nThe annual base salary range for this role is $150,000-$175,000 (USD) , which does not include discretionary bonus compensation or our comprehensive benefits package. Actual compensation offered to the successful candidate may vary from posted hiring range based upon geographic location, work experience, education, and/or skill level, among other things.\n\n,\nRequired Skills\n\n3+ years of experience writing ETL operations, preferably within Cloud infrastructure\n3+ years of experience writing software in programming languages, including Python and SQL\n3+ years of experience with data visualization tools, such as Tableau, Qlik, Power BI\nExperience developing and presenting complex technical information for technical and non-technical audiences and senior leaders\nExcellent consultative, organization, customer service, analytical, and problem-solving skills\nExperience balancing several priorities and tasks at once\nPreferred: Experience in Databricks, Cloud Environment (AWS/Azure/GCO), developing Qlik applications, and recent DoD experience\nSkills: Python, SQL, Data Visualization\n\nMinimum Education and Experience:\nBachelor’s or Master’s Degree in STEM field\n- 3- 10 years of experience in data analytics and visualization\nExperience with ingest and analysis of both structured and unstructured data sources and/or Advana experience"

test("extracts job requirements", () => {
    expect(extract(jobDesc)).toBe({
        education: "bachelor",
        experience: 3,
        skills: {
            "Database Management": ["SQL"],
            "Fields": ["Software Development", "Systems Engineering"],
            "Frameworks": [],
            "Languages": ["Python"],
            "Libraries": [],
            "Methodologies": [],
            "Operating Systems": [],
            "Tools": ["AWS", "Azure"],
            "Web Development": [],
        }
    });
});

test("preprocesses string", () => {
    expect(preprocess("Experience:\nBachelor’s or Master’s Degree in S")).toBe(" experience: bachelor's or master's degree in s ");
});

// test("searches string with regex", () => {
//     expect(search("bachelor", "skills experience balancing several priorities and tasks at once preferred: experience in databricks, cloud environment (aws/azure/gco), developing qlik applications, and recent dod experience skills: python, sql, data visualization  minimum education and experience: bachelor's or master's degree in stem field - 3- 10 years of experience in data analytics and visualization experience"))
//     .toBe(true);
// })