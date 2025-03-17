from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import Skill, Job, City, County, State
from utils.calc_compatibility import calculate_compatibility
import string

# Create your views here.

def skill_search(request, userState): #assume userState is the state's id
    #Output: JSON dictionary containing the following: List of skills, each with an associated integer representing the number of descriptions that mention that skill
    #for each skill in db
        #find all jobs requiring that skill within specified state
    skillSet = Skill.objects.values_list('skill_name', flat=True)
    counts = []
    for skill in skillSet:
        jobList = [Job.objects.filter(Job.skills==skill, Job.city==City, City.county==County, County.state==State, State.pk==userState).values(Job.pk)]
        counts.append(len(jobList))
        
    skill_counts = dict(zip(skillSet, counts))

    return JsonResponse({'skill counts': skill_counts})

    #After midterm: Dictionary of U.S. states, where each state is a dictionary of (county, most_common_skill) pairs

def job_search(request, skillSet, edu, yearsExp, userState): #assume userState is the state's id
    #Output: JSON dictionary consisting of a list of jobs. Each job should itself be a Python dictionary consisting of the title, location, description, salary, link to apply, and compatibility score.
    jobList = []
    jobs = Job.objects.filter(Job.city==City, City.county==County, County.state==State, State==userState)
    for job in jobs:
        reqSkills = list(job.skills)
        reqEdu = string(job.education)
        reqYears = int(job.years_exp)
        score = calculate_compatibility(skillSet, edu, yearsExp, reqSkills, reqEdu, reqYears)
        jobList.append({job.job_name, job.city, job.job_desc, job.min_sal, job.url, job.company, score})

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
