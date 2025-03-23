from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import Skill, Job, City, County, State
from utils.calc_compatibility import calculate_compatibility
from django.views.decorators.csrf import csrf_exempt
import string

# Create your views here.

def skill_search(request): #assume userState is the state's id
    #Output: JSON dictionary containing the following: List of skills, each with an associated integer representing the number of descriptions that mention that skill
    #for each skill in db
        #find all jobs requiring that skill within specified state
    userState = request.GET.get("stateID")

    skillSet = Skill.objects.all()
    skill_counts = []
    for item in skillSet:
        jobList = list(Job.objects.filter(skills=item, city__county__state=userState))
        skill_counts.append({'id': item.pk, 'skillName': item.skill_name, 'occurrences': len(jobList)})

    #After midterm: Dictionary of U.S. states, where each state is a dictionary of (county, most_common_skill) pairs
    countyVals = {}
    states = State.objects.all()
    for i in states:
        countyVals = {}
        countyVals = {'state': i.state_name, 'countyData': []}
        counties = list(County.objects.filter(state=i.pk))
        for county in counties:
            #find most common skill for each county
            total_skills = list(Skill.objects.values_list("pk", flat=True))
            skill_occurrences = {skill: 0 for skill in total_skills}
            jobList = list(Job.objects.filter(city__county=county))
            for item in jobList: #for 
                skill_list = list(item.skills.values_list("pk", flat=True))
                if not skill_list:
                    pass
                else:
                    for skill in skill_list:
                        skill_occurrences[skill] += 1
            commonSkillID = max(skill_occurrences)
            temp = Skill.objects.get(pk=commonSkillID)
            commonSkillName = temp.skill_name

            countyVals['countyData'] = ({'countyID':county.pk, 'countyName': county.county_name,
                                             'skillID': commonSkillID, 'skillName': commonSkillName})

    return JsonResponse({'skills': skill_counts, 'counties': []})

@csrf_exempt
def job_search(request): #assume userState is the state's id
    #Output: JSON dictionary consisting of a list of jobs. Each job should itself be a Python dictionary consisting of the title, location, description, salary, link to apply, and compatibility score.
    userState = request.GET.get("stateID")
    edu = request.GET.get("education")
    yearsExp = request.GET.get("yearsExperience")
    skillSet = request.GET.getlist("skills[]")

    yearsExp = int(yearsExp)

    jobList = []
    jobs = list(Job.objects.filter(city__county__state=userState))
    for job in jobs:
        state = State.objects.get(pk=userState)
        reqSkills = list(job.skills.values_list())
        reqEdu = job.education
        reqYears = int(job.years_exp)
        score = calculate_compatibility(skillSet, edu, yearsExp, reqSkills, reqEdu, reqYears)
        reqSkillsNames = list(job.skills.values_list("skill_name", flat=True))
        jobList.append({'id': job.pk, 'title': job.job_name, 'company': job.company, 'cityName': job.city.city_name, 'stateCode': state.state_code, 'description': job.job_desc,
                        'minSalary': job.min_sal, 'maxSalary': job.max_sal, 'link': job.url, 'score': score, 'skills': reqSkillsNames,
                        'education': job.education, 'yearsExperience': job.years_exp })
        
    return JsonResponse({'jobs': jobList})

def get_static_data(request):
    #Output: JSON dictionary consisting of Dictionary consisting of skill data and List of U.S. states (string[])
    
    #initialize skillValues dictionary
    skillValues = []
    categories = list(Skill.objects.values('category').distinct())
    for category in categories:
        catName = category['category']
        catData = {'category': catName, 'skills': []}
        skills = list(Skill.objects.filter(category=catName))
        for skill in skills:
            catData['skills'].append({'id':skill.pk, 'name': skill.skill_name})
        skillValues.append(catData)

    #initialize locationValues dictionary
    locationValues = []
    #store all ids in a list
    states = State.objects.all()
    for state in states:
        locationValues.append({'id': state.pk, 'name': state.state_name})


    #output:
    return JsonResponse({'skills': skillValues, 'states': locationValues})
