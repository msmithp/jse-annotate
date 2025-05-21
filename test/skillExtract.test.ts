import { extract, search, preprocess, educationExtract } from "../src/skillExtract";

const jobDesc1 = `Research, design, and develop computer and network software or specialized utility programs. Analyze user needs and develop software solutions, applying principles and techniques of computer science, engineering, and mathematical analysis. Update software or enhance existing software capabilities. May work with computer hardware engineers to integrate hardware and software systems and develop specifications and performance requirements. May maintain databases within an application area, working individually or coordinating database development as part of a team. Illustrative examples: Computer Applications Engineer, Computer Systems Engineer, Mobile Applications Developer, Software Applications Architect, Software Engineer, Systems Software Developer


Responsibilities

Design, develop, and deploy scalable data solutions in the cloud using Databricks, AWS, Python, Spark, and SQL.
Design, develop, and deploy dashboard application visualizations using Qlik
Collaborate with clients to understand their data requirements and provide tailored solutions that drive business valuation
Ensure the robustness and reliability of data pipelines and workflows

The annual base salary range for this role is $150,000-$175,000 (USD) , which does not include discretionary bonus compensation or our comprehensive benefits package. Actual compensation offered to the successful candidate may vary from posted hiring range based upon geographic location, work experience, education, and/or skill level, among other things.

,
Required Skills

3+ years of experience writing ETL operations, preferably within Cloud infrastructure
Four years of experience writing software in programming languages, including Python and SQL
3-20 years of experience with data visualization tools, such as Tableau, Qlik, Power BI
Experience developing and presenting complex technical information for technical and non-technical audiences and senior leaders
Excellent consultative, organization, customer service, analytical, and problem-solving skills
Experience balancing several priorities and tasks at once
Preferred: Experience in Databricks, Cloud Environment (AWS/Azure/GCO), developing Qlik applications, and recent DoD experience
Skills: Python, SQL, Data Visualization

Minimum Education and Experience:
Bachelor’s or Master’s Degree in STEM field
- 3- 10 years of experience in data analytics and visualization
Experience with ingest and analysis of both structured and unstructured data sources and/or Advana experience`;

test("extracts job requirements", () => {
    expect(extract(jobDesc1)).toEqual({
        education: "bachelor",
        experience: 4,
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

const sample = `Minimum Education and Experience:
Bachelor’s or Master’s Degree in STEM field
- 3- 10 years of experience in data analytics and visualization
Experience with ingest and analysis of both structured and unstructured data sources and/or Advana experience`

const expected = ` minimum education and experience: bachelor's or master's degree in stem field - 3- 10 years of experience in data analytics and visualization experience with ingest and analysis of both structured and unstructured data sources and/or advana experience `;

test("preprocesses string", () => {
    expect(preprocess(sample)).toBe(expected);
});

test("searches for bachelor", () => {
    expect(search("bachelor", preprocess(jobDesc1))).toBe(true);
});

test("extracts education", () => {
    expect(educationExtract(expected)).toBe("bachelor");
});

const jobDesc2 = `Trianz Consulting, Inc. (Herndon VA & client sites throughout the US). Multi positions: Software Developer: Research, design, & dev comp & network s/w or specialized utility programs. Analyze user needs & dev s/w solutions, applying prin & techniques of comp sci, engg, & math analysis. Update s/w or enhance existing s/w capabilities. May work with comp h/w engrs to integrate h/w & s/w sys, & dev specs & performance reqs. May maintain DBs within an application area, working individually or coordinating DB development as part of a team. Reqs: BS/MS in Comp Sci, Engg, Math, Sci, IT, Comp Apps, MIS, CIS, Acct, Comm or Bus Admin w/ 1-5 yrs exp in the field & exp w/ several prog langs, tools & comp skills. We offer competitive salaries & benefits. Travel Req’d. Send CVs to us-hr@trianz.com`;

test("extracts job requirements 2", () => {
    expect(extract(jobDesc2)).toEqual({
        education: "bachelor",
        experience: 1,
        skills: {
            "Database Management": [],
            "Fields": ["Software Development"],
            "Frameworks": [],
            "Languages": [],
            "Libraries": [],
            "Methodologies": [],
            "Operating Systems": [],
            "Tools": [],
            "Web Development": [],
        }
    });
});