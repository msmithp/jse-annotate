import re

skills = {
        "Languages": ["Python", "Java", "C++", "R", "C#", "C"],
        "Frameworks": ["Node", "Angular"],
        "Database Management": ["SQL", "PostGreSQL", "NoSQL", "MongoDB"],
        "Web Development": ["JavaScript", "HTML", "CSS"],
        "Tools": ["Git", "Docker", "Google Cloud", "Azure", "AWS"]
        }

#test description
desc = "Prospective applicants will need at least 3 years experience with Python, C#, PostGreSQL, and Google Cloud. Python is important."

#function needs to eventually take job description, iterate through, extract the required skills, and assign them to the job entry in the database
def skillExtract(job_desc):
        
        lowerDesc = job_desc.lower()

        #initialize skillset list
        skillset = []

        #for skills that are not C++ or C#, find those in job description
        for category, skill_list in skills.items():
                for skill in skill_list:
                        pattern = r'\b' + re.escape(skill.lower()) + r'\b' #this ignores special characters - C++ and C# are recognized incorrectly as C
                        if re.search(pattern, lowerDesc):
                                skillset.append(skill)

        #hardcode C++ and C# in until more elegant solution is found
        for skill in ["C++", "C#"]:
                if skill.lower() in lowerDesc:
                        skillset.append(skill)

        splitDesc = job_desc.split() 
        if "C" not in splitDesc and "C" in skillset: #account for C being incorrectly recognized when not actually in desc
               skillset.remove("C")

        return skillset

print(skillExtract(desc))