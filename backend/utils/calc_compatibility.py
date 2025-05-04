#dont penalize for overqualification, instead send flag to user that they may be overqualified
def calculate_compatibility(userSkills: list[int], userEdu: str, userYears: int,
                            reqSkills: list[int], reqEdu: str, reqYears: int) -> dict:
    #calculate individual scores for skills, edu, and years
    skillScore = calc_skills(userSkills,reqSkills)
    eduScore = calc_edu(userEdu, reqEdu)
    yearScore = calc_years(userYears, reqYears)

    #give each segment a weight - skill and edu take 25% of the score each, years takes 50% of the score
    #multiply each segment by its respective weight and add together
    total = ((skillScore[0]*0.25) + (eduScore[0]*0.25) + (yearScore[0]*0.5)) * 100

    return {'score': total,
            'overqualifiedSkills': skillScore[1],
            'overqualifiedEdu': eduScore[1],
            'overqualifiedYears': yearScore[1]}

def calc_skills(userSkills: list, reqSkills: list): #calculate skill compatibility - add overqualification flag
    overqualified = False
    userSkillPoints = 0
    if len(reqSkills) == 0: #if job has no skills, score is 1
        score = 1
        if len(userSkills) != 0: #if user has skills when job doesn't require any, mark as overqualified
            overqualified = True
    else:
        #else, get how many skills job requires, and if user has a skill that the job requires, add a point to their score
        jobSkillPoints = len(reqSkills)

        for skill in reqSkills:
            if skill in userSkills:
                userSkillPoints += 1
        score = userSkillPoints/jobSkillPoints #score is determined by dividing user's points by job's total points
        if (score == 1) & (len(userSkills) > len(reqSkills)): #if user has all required skills and then some, mark as overqualified
            overqualified = True
    return score, overqualified

def calc_edu(userEdu: str, reqEdu: str): #calculate education compatibility
    education = { #possible education scores
        "": 0,
        "high_school": 0.2,
        "associate": 0.4,
        "bachelor": 0.6,
        "master": 0.8,
        "doctorate": 1
    }
    overqualified = False

    if userEdu in education: #assign initial score depending on the education level
        userEduScore = education[userEdu]
    if reqEdu in education:
        reqEduScore = education[reqEdu]
        
    if reqEduScore == 0: #if job requires no education, score is 1
        score = 1
        if userEduScore != 0: #if user has level of edu above 0, mark overqualified
            overqualified = True
    else:
        score = userEduScore/reqEduScore #score is determined by dividing user's education by required education
        if score > 1: #if score is over 1, reset to 1 and mark overqualified
            score = 1
            overqualified = True

    return score, overqualified

def calc_years(userYears: int, reqYears: int): #calculate years of experience compatibility
    overqualified = False

    if reqYears == 0: #if job requires no years of experience, score is 1
        score = 1
        if userYears != 0: #if user has experience when job doesn't require any, mark overqualified
            overqualified = True
    else:
        score = userYears/reqYears #else, return either users years divided by req years
        if score > 1: #if score is over 1, reset to 1 and mark overqualified
            score = 1
            overqualified = True

    return score, overqualified