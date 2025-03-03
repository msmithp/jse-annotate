import re

skills = {
        "Languages": ["Python", "Java", "C++", "R", "C#", "C", "ANSI C", "Objective-C", "Visual Basic"],
        "Frameworks": ["Node.js", "Angular", "Express.js"],
        "Database Management": ["SQL", "PostGreSQL", "NoSQL", "MongoDB"],
        "Web Development": ["JavaScript", "HTML", "CSS"],
        "Tools": ["Git", "Docker", "Google Cloud", "Azure", "AWS"]
}

#test description
desc = ("Prospective applicants will need at least 3 years experience with C++, Python, C, C#, PostGreSQL,"
        " and Google Cloud. Python is important. Applicants should also have experience with Node.js."
        " Visual\nBasic too.")

# When searching for skills, we check if they are surrounded by
# any two characters from this expression
ignore = " !\"\'\\`()\n\t,:;=<>?./"


#function needs to eventually take job description, iterate through, extract the required skills, and assign them to the job entry in the database
def skill_extract(job_desc: str) -> list:
        # Turn job description to lowercase and pad it with spaces for regex search
        job_desc = " " + job_desc.lower() + " "

        # Replace characters
        char_map = {"\n": " ", "\t": " ", "\\": ""}
        job_desc = job_desc.translate(str.maketrans(char_map))

        #initialize skillset list
        skillset = []

        # Search job description for each skill, one at a time
        for skill_list in skills.values():
                for skill in skill_list:
                        pattern = r"[" + ignore + r"]" + re.escape(skill.lower()) + r"[" + ignore + r"]"
                        if re.search(pattern, job_desc):
                                skillset.append(skill)

        return skillset


if __name__ == "__main__":
        print(skill_extract(desc))
