import re

# Temporary - this will be pulled from the database eventually
skills = {
        "Languages": [
                {"name": "Python",        "id": 0,  "aliases": []},
                {"name": "Java",          "id": 1,  "aliases": []},
                {"name": "C++",           "id": 2,  "aliases": []},
                {"name": "R",             "id": 3,  "aliases": []},
                {"name": "C#",            "id": 4,  "aliases": []},
                {"name": "C",             "id": 5,  "aliases": []},
                {"name": "ANSI C",        "id": 6,  "aliases": []},
                {"name": "Objective-C",   "id": 7,  "aliases": []},
                {"name": "Visual Basic",  "id": 8,  "aliases": []},
        ],
        "Frameworks": [
                {"name": "Node.js",       "id": 9,  "aliases": []},
                {"name": "Angular",       "id": 10, "aliases": []},
                {"name": "Express.js",    "id": 11, "aliases": []},
        ],
        "Database Management": [
                {"name": "SQL",           "id": 12, "aliases": []},
                {"name": "PostgreSQL",    "id": 13, "aliases": []},
                {"name": "NoSQL",         "id": 14, "aliases": []},
                {"name": "MongoDB",       "id": 15, "aliases": []},
        ],
        "Web Development": [
                {"name": "JavaScript",    "id": 16, "aliases": []},
                {"name": "HTML",          "id": 17, "aliases": []},
                {"name": "CSS",           "id": 18, "aliases": []},
        ],
        "Tools": [
                {"name": "Git",           "id": 19, "aliases": []},
                {"name": "Docker",        "id": 20, "aliases": []},
                {"name": "Google Cloud",  "id": 21, "aliases": ["GCP"]},
                {"name": "Azure",         "id": 22, "aliases": []},
                {"name": "AWS",           "id": 23, "aliases": ["Amazon Web Services"]},
        ]
}

education = {
        "high_school": ["high school diploma", "high school grad", "GED",
                        "high school equiv"],
        "associate": ["associate degree", "associates degree", 
                      "associate's degree", "A.S.", "A.A.", "A.A.S."],
        "bachelor": ["bachelor", "B.S.", "B.A.", "BS", "BA", 
                     "undergraduate degree", "undergraduate's degree",
                     "four year degree"],
        "master": ["master's degree", "master degree", "M.S.", "M.A.", 
                   "master's of"],
        "doctorate": ["doctorate", "doctoral", "PhD", "Ph.D.", "D.Sc.",
                      "postgraduate degree"]
}

#test description
desc = ("Prospective applicants will need at least 3 years experience with C++, Python, C, C#, PostGreSQL,"
        " and Google Cloud/GCP. Python is important. Applicants should also have experience with Node.js."
        " Visual\nBasic too. Minimum 3 years of experience. Applicants should have a bachelor's in science.")

# When searching for skills, we check if they are surrounded by
# any two characters from this expression
ignore = " !\"\'\\`()\n\t,:;=<>?./"


def preprocess(job_desc: str) -> str:
        """
        Preprocess a job description by making it lowercase, removing newlines,
        and removing special characters.
        :param job_desc: Original job description to be processed
        :return: Processed job description
        """
        # Turn job description to lowercase and pad it with spaces for regex search
        new_desc = " " + job_desc.lower() + " "

        # Replace characters
        char_map = {"\n": " ", "\t": " ", "\\": ""}
        new_desc = new_desc.translate(str.maketrans(char_map))

        return new_desc


def search(search_term: str, job_desc: str) -> bool:
        """
        Search a job description for a specified search term.
        :param search_term: A string value to be found in the job description
        :param job_desc: Job description to be searched
        :return: `True` if the term was found, `False` otherwise
        """
        pattern = r"[" + ignore + r"]" + re.escape(search_term.lower()) + r"[" + ignore + r"]"
        if re.search(pattern, job_desc):
                return True
        else:
                return False
        

def extract(job_desc: str) -> None:
        """
        Extract skill, education, and experience information from a scraped
        job description.
        :param job_desc: Original job description, as scraped by JobSpy, from
                         which information will be extracted
        """
        job_desc = preprocess(job_desc)
        skills = skill_extract(job_desc)
        education = education_extract(job_desc)

        print(f"Extracted info:\nSkills: {skills}\nEducation: {education}")


#function needs to eventually take job description, iterate through, extract the required skills, and assign them to the job entry in the database
def skill_extract(job_desc: str) -> list:
        """
        Extract all skills from a job description as a list.
        :param job_desc: Preprocessed job description
        :return: A list of database IDs for each skill found
        """
        #initialize skillset list
        skillset = []

        # Search job description for each skill, one at a time
        for skill_list in skills.values():
                for skill in skill_list:
                        if search(skill["name"], job_desc):
                                skillset.append(skill["id"])
                        else:
                                # If skill not found, search for its alternate names
                                for alias in skill["aliases"]:
                                        if search(alias, job_desc):
                                                skillset.append(skill["id"])
                                                break

        return skillset


def education_extract(job_desc: str) -> str:
        """
        Extract an education level from a job description. If multiple
        education levels are listed, the lowest one found will be returned.
        :param job_desc: Preprocessed job description
        :return: Lowest education level mentioned in description, as a string
        """
        # Iterate through education levels. The level with the first
        # "hit" will count as the education level for that job.
        for education_level, names in education.items():
                for name in names:
                        if search(name, job_desc):
                                return education_level

        # No education level found - return blank string
        return ""


if __name__ == "__main__":
        extract(desc)
