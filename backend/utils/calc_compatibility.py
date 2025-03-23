education = {
        " ": 0,
        "high_school": 0.2,
        "associate": 0.4,
        "bachelor": 0.6,
        "master": 0.8,
        "doctorate": 1
}

def calculate_compatibility(userSkills, userEdu, userYears, reqSkills, reqEdu, reqYears):
    #calculate score for skills
    skillScore = calc_skills(userSkills,reqSkills)
    eduScore = calc_edu(userEdu, reqEdu)
    yearScore = calc_years(userYears, reqYears)

    total = ((skillScore*0.25) + (eduScore*0.25) + (yearScore*0.5)) * 100

    return total

def calc_skills(userSkills, reqSkills):
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

def calc_edu(userEdu, reqEdu):
    userEduScore = 0
    reqEduScore = 0

    if userEdu in education:
        userEduScore = education[userEdu]
    if reqEdu in education:
        reqEduScore = education[reqEdu]

    if reqEduScore == 0:
        return 1
    else:
        score = min((userEduScore / reqEduScore), 1)

    return score

def calc_years(userYears, reqYears):
    if reqYears == 0:
        return 1
    else:
        score = min((userYears / reqYears), 1)

    return score