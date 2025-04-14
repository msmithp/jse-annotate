def categorize(skills: list[dict]) -> list[dict]:
    """
    Turn a list of Skill dictionaries into a list of category dictionaries.

    :param skills: A list of dictionaries, each of the form:
    ```
    {
        "id": int,
        "skill_name": str,
        "category": str
    }
    ```

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
            "id": skill["id"],
            "name": skill["skill_name"]
        }

        if skill["category"] not in categories_dict:
            # Make a new empty list for this category if it's not already
            # in the dictionary
            categories_dict[skill["category"]] = []

        categories_dict[skill["category"]].append(skill_dict)

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
