from django.shortcuts import render
import json
from .models import Skill, User, Job, AltSkill, City, County, State

# Create your views here.

def skill_search(userState):
    #Output: JSON dictionary containing the following: List of skills, each with an associated integer representing the number of descriptions that mention that skill
    #for each skill in db
        #find all jobs requiring that skill within specified state
    skillSet = Skill.objects.values_list('skill_name', flat=True)
    counts = []
    for skill in skillSet:
        jobList = [Job.objects.filter(Job.skills==skill).filter(Job.city==City).filter(City.county==County).filter(County.state==State).filter(State.state_name == userState)]
        counts.append(len(jobList))
        
    skill_counts = dict(zip(skillSet, counts))

    return json.dumps(skill_counts)

    #After midterm: Dictionary of U.S. states, where each state is a dictionary of (county, most_common_skill) pairs

def job_search(skillSet, edu, yearsExp):
    #Output: JSON dictionary consisting of a list of jobs. Each job should itself be a Python dictionary consisting of the title, location, description, salary, link to apply, and compatibility score.
    jobs = []
    #for skill in skillSet
        #find job offers requiring that skill
    #match user's education level to jobs that also require that education
    #match user's years of exp to jobs that also require that

    #load job info into jobentry, do for all jobs found
    jobEntry = 'TBD'
    jobs = json.loads(jobEntry)
    return jobs

def get_static_data():
    #Output: JSON dictionary consisting of Dictionary consisting of skill data, List of education level (string[]), List of U.S. states (string[])
    #input
    skills = []
    edLevels = []
    states = []


    #output:
    return edLevels, states