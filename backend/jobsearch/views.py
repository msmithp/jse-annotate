from django.shortcuts import render
import json
from .models import Skill, User, Job, AltSkill, City, County, State
from utils import calc_compatibility
import string

# Create your views here.

def skill_search(userState): #assume userState is the state's id
    #Output: JSON dictionary containing the following: List of skills, each with an associated integer representing the number of descriptions that mention that skill
    #for each skill in db
        #find all jobs requiring that skill within specified state
    skillSet = Skill.objects.values_list('skill_name', flat=True)
    counts = []
    for skill in skillSet:
        jobList = [Job.objects.filter(Job.skills==skill, Job.city==City, City.county==County, County.state==State, State.pk==userState).values(Job)]
        counts.append(len(jobList))
        
    skill_counts = dict(zip(skillSet, counts))

    return json.dumps(skill_counts)

    #After midterm: Dictionary of U.S. states, where each state is a dictionary of (county, most_common_skill) pairs

def job_search(skillSet, edu, yearsExp, userState): #assume userState is the state's id
    #Output: JSON dictionary consisting of a list of jobs. Each job should itself be a Python dictionary consisting of the title, location, description, salary, link to apply, and compatibility score.
    jobList = []
    jobs = Job.objects.filter(Job.city==City, City.county==County, County.state==State, State==userState)
    for job in jobs:
        reqSkills = list(job.skills)
        reqEdu = string(job.education)
        reqYears = int(job.years_exp)
        score = calc_compatibility(skillSet, edu, yearsExp, reqSkills, reqEdu, reqYears)
        jobList.append({job.job_name, job.city, job.job_desc, job.min_sal, job.url, job.company, score})

    return json.dumps(jobList)

def get_static_data():
    #Output: JSON dictionary consisting of Dictionary consisting of skill data, List of education level (string[]), List of U.S. states (string[])
    
    #initialize skillValues dictionary
    skillValues = []
    categories = [Skill.objects.values('category').distinct()]
    for item in categories:
        skillValues.append(item)
        skills = Skill.objects.filter(Skill.category==item)
        for skill in skills:
            skillValues.append({'id': skill.pk, 'name':skill.skill_name})

    #initialize locationValues dictionary
    locationValues = []
    #store all ids in a list
    states = State.objects.all()
    for state in states:
        locationValues.append({'id': state.pk, 'name': state.state_name})


    #output:
    return skillValues, locationValues
