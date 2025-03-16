education = {
        "high_school": 0.2,
        "associate": 0.4,
        "bachelor": 0.6,
        "master": 0.8,
        "doctorate": 1
}

def calculate_compatibility(userSkills, reqSkills, userEdu, reqEdu, userYears, reqYears):
    #calculate score for skills
    jobSkillPoints = len(reqSkills) + 2
    for skill in reqSkills:
        userSkillPoints = 0
        if skill in userSkills:
            userSkillPoints += 1
    skillScore = userSkillPoints/jobSkillPoints

    #calculate score for education
    if userEdu in education:
        userEduScore = education[userEdu]
    if reqEdu in education:
        reqEduScore = education[reqEdu]
    
    tempScore = userEduScore/reqEduScore
    if tempScore >= 1:
        eduScore = 1
    if tempScore < 1:
        eduScore = tempScore

    #calculate score for years of experience
    yearScore = min((userYears / reqYears), 1)

    total = [(skillScore*0.25) + (eduScore*0.25) + (yearScore*0.5)] * 100

    return total
