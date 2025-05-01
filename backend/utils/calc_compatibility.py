def calculate_compatibility(userSkills: list[int], userEdu: str, userYears: int,
                            reqSkills: list[int], reqEdu: str, reqYears: int):
    #calculate individual scores for skills, edu, and years
    skillScore = calc_skills(userSkills,reqSkills)
    eduScore = calc_edu(userEdu, reqEdu)
    yearScore = calc_years(userYears, reqYears)

    #give each segment a weigjt - skill and edu take 25% of the score each, years takes 50% of the score - add together
    total = ((skillScore*0.25) + (eduScore*0.25) + (yearScore*0.5)) * 100

    return total

def calc_skills(userSkills: list, reqSkills: list): #calculate skill compatibility
    if len(reqSkills) == 0:
        return 1 #if job has no skills, user gets 100% for skills, so return 1
    
    #else, get how many skills job requires, and if user has a skill that the job requires, add a point to their score
    jobSkillPoints = len(reqSkills)
    userSkillPoints = 0
    for skill in reqSkills:
        if skill in userSkills:
            userSkillPoints += 1
    score = userSkillPoints/jobSkillPoints #score is determined by dividing user's points by job's total points
    return score

def calc_edu(userEdu: str, reqEdu: str): #calculate education compatibility
    education = { #possible education scores
        "": 0,
        "high_school": 0.2,
        "associate": 0.4,
        "bachelor": 0.6,
        "master": 0.8,
        "doctorate": 1
    }

    if userEdu in education: #assign initial score depending on the education level
        userEduScore = education[userEdu]
    if reqEdu in education:
        reqEduScore = education[reqEdu]

    if reqEduScore == 0: #if job requires no education, just subtract the user's education level from 1
        score = max(0, 1 - userEduScore)
    else:
        score = userEduScore/reqEduScore #score is determined by dividing user's education by required education
        if score > 1:
            score = max(0, 1 - score/10) #if resulting score is over 1, divide that by 10 and subtract from 1

    return score

def calc_years(userYears: int, reqYears: int): #calculate years of experience compatibility
    if reqYears == 0:
        score = max(0, 1 - 0.1*userYears) #if job requires no experience, multiply user's years by 0.1 and subtract by 1. if result is negative, return 0
    elif (reqYears < userYears) & (userYears >= 5):
            score = max(0, (userYears-reqYears)/(userYears+reqYears)) #if required experience is less than user's and user has more than 5 years,
                                                                #score is difference between user and required experience div by total sum of user and req experience
    else:
        score = min(userYears/reqYears,1) #else, return either users years divided by req years or 1, whichever is lower

    return score