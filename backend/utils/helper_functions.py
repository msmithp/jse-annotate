from jobsearch.models import Skill

def categorize(skills: list[Skill]) -> list[dict]:
    """
    Turn a list of Skill objects into a list of category dictionaries.

    :param skills: A list of Skill objects

    :return: A list of dictionaries, each of the form:
    ```
    {
        "category": str,
        "skills": {
            "id": int,
            "name": str
        }[]
    }
    ```
    """
    # First, make a dictionary where each category is a key, and each
    # value is a list of dictionaries
    categories_dict = {}

    for skill in skills:
        skill_dict = {
            "id": skill.pk,
            "name": skill.skill_name
        }

        if skill.category not in categories_dict:
            # Make a new empty list for this category if it's not already
            # in the dictionary
            categories_dict[skill.category] = []

        categories_dict[skill.category].append(skill_dict)

    # Next, convert dictionary to list of desired format
    categories_list = []

    for category, skill_dicts in categories_dict.items():
        # Sort list of skill dictionaries alphabetically by skill name
        skill_dicts_sorted = sorted(skill_dicts, key=lambda x: x["name"])

        category_dict = {
            "category": category,
            "skills": skill_dicts_sorted
        }

        categories_list.append(category_dict)

    # Sort list of category dictionaries alphabetically by category name
    categories_list_sorted = sorted(categories_list, key=lambda x: x["category"])

    # Return sorted list
    return categories_list_sorted


def any_from_list_in(wds: list[str], target: str) -> bool:
    """
    Return `True` if any words from a list are in a target string,
    otherwise return `False`

    :param wds: A list of strings
    :param target: A target string

    :return: `True` if any of the words from `wds` are in `target`,
             and `False` otherwise
    """
    for wd in wds:
        # Check if word is contained within target string
        if wd in target:
            # Word found
            return True
    return False
