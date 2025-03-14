import re
import csv
from django.core.management.base import BaseCommand
# from jobsearch.models import Location
from jobsearch.models import Skill, AltSkill, Job

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
                {"name": "Angular",       "id": 10, "aliases": ["AngularJS", "Angular.JS"]},
                {"name": "Express.js",    "id": 11, "aliases": ["ExpressJS"]},
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
                {"name": "React",         "id": 18, "aliases": ["ReactJS", "React.JS"]},
        ],
        "Tools": [
                {"name": "Git",           "id": 19, "aliases": []},
                {"name": "Docker",        "id": 20, "aliases": []},
                {"name": "Google Cloud",  "id": 21, "aliases": ["GCP"]},
                {"name": "Azure",         "id": 22, "aliases": []},
                {"name": "AWS",           "id": 23, "aliases": ["Amazon Web Services"]},
        ]
}

# String versions of numbers (for years of experience parsing)
numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven",
            "eight", "nine", "ten", "eleven", "twelve", "thirteen",
            "fourteen", "fifteen", "sixteen", "seventeen", "eighteen"]

# Education levels and their common associated terms/phrases
education = {
        "high_school": ["high school diploma", "high school grad", "ged",
                        "high school equiv", "hs diploma"],
        "associate": ["associate degree", "associates degree", 
                      "associate's degree", "a.s.", "a.a.", "a.a.s."],
        "bachelor": ["bachelor", "b.s.", "b.a.", "bs", "ba", 
                     "undergraduate degree", "undergraduate's degree",
                     "four year degree", "4 year degree"],
        "master": ["master's degree", "master degree", "m.s.", "m.a.", 
                   "master's of"],
        "doctorate": ["doctorate", "doctoral", "phd", "ph.d.", "d.sc.",
                      "postgraduate degree"]
}

#test description
desc = ("Prospective applicants will need - at least 3 years experience with C++, Python, C, C#, PostGreSQL,"
        " and Google Cloud/GCP. Python is important. Applicants should also have experience with Node.js."
        " Visual\nBasic too. 5 - 10 years of experience required. Applicants should have" 
        " a bachelor's in computer science.")

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
        experience = experience_extract(job_desc)

        print(f"Extracted info:\nSkills: {skills}\nEducation: {education}\nExperience: {experience} years")


def skill_extract(job_desc: str) -> list:
        """
        Extract all skills from a job description as a list.
        :param job_desc: Preprocessed job description
        :return: A list of database IDs for each skill found
        """
        #initialize skillset list
        skillset = []

        #Skill.objects.all()

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


def experience_extract(job_desc: str) -> int:
        """
        Extract required years of experience from a job description.
        If different years of experience are listed in different places in the
        description, the highest will be chosen. If at any point a range of
        years is given, the lowest of the range will be chosen.
        :param job_desc: Preprocessed job description
        :return: Required years of experience listed in job description
        """
        # Normalize any range (e.g., `5-10` or `5 - 10`) to a single number
        for i, ch in enumerate(job_desc):
                if ch == '-':
                        # Read in characters preceding the hyphen as long as
                        # they are numeric or whitespace characters
                        prev = ""
                        prev_index = i
                        for j in range(i-1, 0, -1):
                                if job_desc[j].isnumeric() or job_desc[j].isspace():
                                        prev = job_desc[j] + prev
                                        prev_index -= 1
                                else:
                                        break

                        # Read in characters succeeding the hyphen as long as
                        # they are numeric or whitespace characters
                        next = ""
                        next_index = i
                        for j in range(i+1, len(job_desc)):
                                if job_desc[j].isnumeric() or job_desc[j].isspace():
                                        next += job_desc[j]
                                        next_index += 1
                                else:
                                        break   

                        if ((prev.isspace() or prev == "") 
                            or (next.isspace() or next == "")):
                                # No numbers before or after hyphen. This is
                                # not a range, so move on
                                continue

                        # We know that both tokens before and after the hyphen
                        # are numbers, so convert them to integers
                        first_num = int(prev)
                        second_num = int(next)

                        # Replace the original range with the minimum value of
                        # the range
                        job_desc = job_desc.replace(
                                job_desc[prev_index + 1:next_index], 
                                str(min(first_num, second_num))
                        )

        # Replace characters by taking the "ignore" characters from `ignore`,
        # removing the whitespace character from `ignore`, adding mappings for
        # some other special characters, and then making replacement
        char_map = {ch: "" for ch in ignore.replace(" ", "")}
        char_map = char_map | {"+": "", "#": "", "*": ""}
        job_desc = job_desc.translate(str.maketrans(char_map))

        # Split string on spaces to get list of words
        desc_list = re.split(r"\s+", job_desc)

        # Perform preprocessing to turn words (e.g., "three") into numbers (3)
        for i, word in enumerate(desc_list):
                try:
                        num = numbers.index(word.lower())
                        desc_list[i] = str(num)
                except:
                        continue

        # Search for years of experience by finding mentions of the word
        # "year", then find if the word "experience" is also mentioned
        # within a certain range (search_range). If it is, check the words
        # before the word "year" up to a certain limit (number_threshold) to
        # see if there is a number
        years_of_exp = -1
        search_range = 7
        number_threshold = 5
        for i, word in enumerate(desc_list):
                if "year" in word:
                        low = max(0, i-search_range)
                        high = min(len(desc_list), i+search_range)
                        experience_found = False

                        # Look backwards for "experience"
                        for j in range(i, low, -1):
                                if desc_list[j] == "experience":
                                        experience_found = True
                                        break

                        # Look forwards for "experience"
                        if not experience_found:
                                for j in range(i, high, 1):
                                        if desc_list[j] == "experience":
                                                experience_found = True
                                                break
                        
                        if not experience_found:
                                # Couldn't find the word experience around
                                # the word "year" in this case - move on
                                continue

                        # Look before the word "year" to find if there is a number
                        number_limit = low = max(0, i-number_threshold)
                        for j in range(i, number_limit, -1):
                                if desc_list[j].isnumeric():
                                        num = int(desc_list[j])
                                        if num > years_of_exp:
                                                years_of_exp = num
                
                if "yoe" in word:
                        # Look before the word "YoE" to find if there is a number
                        number_limit = low = max(0, i-number_threshold)
                        for j in range(i, number_limit, -1):
                                if desc_list[j].isnumeric():
                                        num = int(desc_list[j])
                                        if num > years_of_exp:
                                                years_of_exp = num

        # If no experience requirement was found, return 0.
        # Otherwise, return the number of years found.
        return years_of_exp if years_of_exp >= 1 else 0


if __name__ == "__main__":
        extract(desc)
