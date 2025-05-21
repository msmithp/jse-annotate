"""
Convert a CSV of skill data to a JSON dictionary
"""


import csv
import json


with open("skill_data.csv", encoding="utf8") as f:
    reader = csv.reader(f)
    next(reader, None)  # Skip header

    skills = {}

    # Read rows of CSV
    for row in reader:
        name = row[0]
        category = row[1]

        if category not in skills:
            # Create new category key in dictionary
            skills[category] = [{"name": name, "aliases": []}]
        else:
            # Add skill to pre-existing category in dictionary
            skills[category].append({"name": name, "aliases": []})

    # Sort in alphabetical order
    for category in skills.keys():
        skills[category] = sorted(skills[category], key=lambda x: x["name"])

    # Save to JSON
    with open("output.json", "w") as json_file:
        json.dump(skills, json_file, indent=4)
