"""
This Python file takes a json file of U.S. counties and adds to each county
a property for the two-letter abbreviation of its state (e.g., "MD"). Puerto
Rico and Washington, D.C. are counted as states in this program.
"""

import json

# Maps FIPS state codes to two-letter state codes
state_code = {
    1: "AL",
    2: "AK",
    60: "AS",
    4: "AZ",
    5: "AR",
    6: "CA",
    8: "CO",
    9: "CT",
    10: "DE",
    11: "DC",	
    12: "FL",	
    13: "GA",	
    66: "GU",	
    15: "HI",	
    16: "ID",	
    17: "IL",	
    18: "IN",	
    19: "IA",	
    20: "KS",	
    21: "KY",	
    22: "LA",	
    23: "ME",	
    24: "MD",	
    25: "MA",	
    26: "MI",	
    27: "MN",	
    28: "MS",	
    29: "MO",	
    30: "MT",	
    31: "NE",	
    32: "NV",	
    33: "NH",	
    34: "NJ",	
    35: "NM",	
    36: "NY",	
    37: "NC",	
    38: "ND",	
    39: "OH",	
    40: "OK",	
    41: "OR",	
    70: "PW",	
    42: "PA",	
    72: "PR",	
    44: "RI",	
    45: "SC",	
    46: "SD",	
    47: "TN",	
    48: "TX",	
    49: "UT",	
    50: "VT",	
    51: "VA",	
    53: "WA",	
    54: "WV",	
    55: "WI",	
    56: "WY",	
}

if __name__ == "__main__":
    with open("counties.json", "r") as file:
        data = json.load(file)
        counties = data["features"]

        # Add to each county a new field for two-letter state code (e.g., 'MD')
        for i, county in enumerate(counties):
            counties[i]["properties"]["STATECODE"] = state_code[int(county["properties"]["STATEFP"])]

        # Create a new json file with the new county data
        new_json = {
            "type": data["type"],
            "name": data["name"],
            "crs": data["crs"],
            "features": counties
        }

        # Save to new json file
        with open("new_counties.json", "w") as new_file:
            json.dump(new_json, new_file)
