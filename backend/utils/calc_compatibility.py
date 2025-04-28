education = {
        "": 0,
        "high_school": 0.2,
        "associate": 0.4,
        "bachelor": 0.6,
        "master": 0.8,
        "doctorate": 1
}

def calculate_compatibility(userSkills: list[int], userEdu: str, userYears: int,
                            reqSkills: list[int], reqEdu: str, reqYears: int):
    #calculate score for skills
    skillScore = calc_skills(userSkills,reqSkills)
    eduScore = calc_edu(userEdu, reqEdu)
    yearScore = calc_years(userYears, reqYears)

    total = ((skillScore*0.25) + (eduScore*0.25) + (yearScore*0.5)) * 100

    return total

def calc_skills(userSkills: list, reqSkills: list):
    #calculate score for skills
    if len(reqSkills) == 0:
        return 1

    jobSkillPoints = len(reqSkills)
    userSkillPoints = 0
    for skill in reqSkills:
        if skill in userSkills:
            userSkillPoints += 1
    score = userSkillPoints/jobSkillPoints
    return score

def calc_edu(userEdu: str, reqEdu: str):
    #initialize
    userEduScore = 0
    reqEduScore = 0

    if userEdu in education:
        userEduScore = education[userEdu]
    if reqEdu in education:
        reqEduScore = education[reqEdu]

    if reqEduScore == 0:
        score = max(0, 1 - userEduScore)
    else:
        score = userEduScore/reqEduScore
        if score > 1:
            score = max(0, 1 - score/10)

    return score

def calc_years(userYears: int, reqYears: int):
    if reqYears == 0:
        score = max(0, 1 - 0.1*userYears)
    elif (reqYears < userYears) & (userYears >= 5):
            score = (userYears-reqYears)/(userYears+reqYears)
    else:
        score = min(userYears/reqYears,1)

    return score