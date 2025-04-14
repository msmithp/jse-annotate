from django.http import JsonResponse, HttpResponse
import json
from .models import Skill, Job, City, County, State, User, Profile
from utils.calc_compatibility import calculate_compatibility
from utils.helper_functions import categorize
from django.views.decorators.csrf import csrf_exempt

# Authentication
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def update_account(request):
    try:
        # Extract data from request body
        data = json.loads(request.body.decode("utf-8"))
        user_id = data["userID"]
        state = data["stateID"]
        edu = data["education"]
        years_exp = data["yearsExperience"]
        skills = data["skills"]

        # Update user attributes
        user = User.objects.get(pk=user_id)
        profile = user.profile
        profile.state = State.objects.get(pk=state)
        profile.education = edu
        profile.years_exp = years_exp
        profile.skill_name.set(skills)
        profile.save()

        # Return successful HTTP response
        return HttpResponse(status=200)
    except:
        # Something went wrong, return error HTTP response
        return HttpResponse("Error updating account", status=400)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user(request):
    id = request.GET.get("id")
    user = User.objects.get(pk=id)

    user_skills = user.profile.skill_name.all()
    user_skills = [
        {"id": s.pk, "name": s.skill_name} for s in user_skills
    ]

    user_dict = {
        "id": id,
        "username": user.username,
        "state": user.profile.state.pk,
        "education": user.profile.education,
        "yearsExperience": user.profile.years_exp,
        "skills": user_skills
    }

    return JsonResponse(user_dict)

@csrf_exempt
def create_account(request):
    data = json.loads(request.body.decode("utf-8"))
    username = data["username"]
    password = data["password"]
    state = data["stateID"]
    edu = data["education"]
    years_exp = data["yearsExperience"]
    skills = data["skills"]

    state_instance = State.objects.get(pk=state)

    # Check for duplicate username
    if User.objects.filter(username=username).exists():
        return HttpResponse("Username already exists", status=409)
    else:
        # Perform password checking
        if len(password) < 8:
            return HttpResponse("Password must be at least 8 characters long",
                                status=403)

    new_user = User.objects.create_user(username=username, password=password)
    new_profile = Profile.objects.create(user=new_user, state=state_instance, 
                                         education=edu, years_exp=years_exp)
    new_profile.skill_name.set(skills)

    return HttpResponse(status=200)

def skill_search(request): #assume userState is the state's id
    #Output: JSON dictionary containing the following: List of skills, each with an associated integer representing the number of descriptions that mention that skill
    #for each skill in db
        #find all jobs requiring that skill within specified state
    userState = request.GET.getlist("states[]")

    skill_counts = []
    categories = list(Skill.objects.values_list('category', flat=True).distinct())
    """for category in categories:
        catInfo = {'category': category, 'skill info': []}
        skill_counts.append(catInfo)
        skill_set = Skill.objects.filter(category=category)
        for item in skill_set:
            for state in userState:
                job_list = list(Job.objects.filter(skills=item, city__county__state=userState))
                catInfo['skill info'].append({'id': item.pk, 'skillName': item.skill_name, 'occurrences': len(job_list)})"""

    for category in categories:
        catInfo = {'category': category, 'skills': []}
        skill_counts.append(catInfo)
        skill_set = Skill.objects.filter(category=category)
        for item in skill_set:
                num_jobs = Job.objects.filter(skills=item, city__county__state__in=userState).count()
                catInfo['skills'].append({'id': item.pk, 'skillName': item.skill_name, 'occurrences': num_jobs})
    #print(skill_counts)

    #After midterm: Dictionary of U.S. states, where each state is a dictionary of (county, most_common_skill) pairs
    countyVals = []
    states = State.objects.filter(pk__in=userState)

    for thisState in states:
        #make state info, append to countyVals
        stateInfo = {'stateData':{'stateID': thisState.pk, 'stateName': thisState.state_name, 'stateCode': thisState.state_code}, 'countyData': []}
        countyVals.append(stateInfo)

        #get list of counties within state, get list of all skill pks
        counties = list(County.objects.filter(state=thisState))
        total_skills = list(Skill.objects.values_list("pk", flat=True))

        for thisCounty in counties: #for each county, create new skill_occurrences list
            skill_occurrences = {skill: 0 for skill in total_skills}

            #get all jobs in county
            jobList = list(Job.objects.filter(city__county=thisCounty))

            for item in jobList:
                reqSkills = list(item.skills.values_list("pk", flat=True))
                if reqSkills: #if job has any required skills, count which skills are found, inc associated listing in skill_occurrences
                    for thisSkill in reqSkills:
                        skill_occurrences[thisSkill] += 1
                    
            #print(thisCounty, skill_occurrences) #test

            commonSkillID = max(skill_occurrences, key = skill_occurrences.get)
            numJobs = skill_occurrences[commonSkillID]

            #print(thisCounty, commonSkillID) #test

            if numJobs == 0:
                commonSkillID = -1
                commonSkillName = ""
            else:
                temp = Skill.objects.get(pk=commonSkillID)
                commonSkillName = temp.skill_name

            stateInfo['countyData'].append({'countyID':thisCounty.pk, 'countyName': thisCounty.county_name,
                                            'countyFips': thisCounty.fips, 'skillID': commonSkillID, 
                                            'skillName': commonSkillName, 'numJobs': numJobs})

    #print(countyVals)
    return JsonResponse({'skills': skill_counts, 'counties': countyVals})

@csrf_exempt
def job_search(request): #assume userState is the state's id
    #Output: JSON dictionary consisting of a list of jobs. Each job should itself be a Python dictionary consisting of the title, location, description, salary, link to apply, and compatibility score.
    userState = request.GET.getlist("stateID[]")
    edu = request.GET.get("education")
    yearsExp = request.GET.get("yearsExperience")
    skillSet = request.GET.getlist("skills[]")

    yearsExp = int(yearsExp)
    states = State.objects.filter(pk__in=userState)

    jobList = []
    for state in states:
         jobs = list(Job.objects.filter(city__county__state=state))
         for job in jobs:
             reqSkills = list(job.skills.values_list())
             reqEdu = job.education
             reqYears = int(job.years_exp)
             score = calculate_compatibility(skillSet, edu, yearsExp, reqSkills, reqEdu, reqYears)
             reqSkillsCategories = categorize(list(job.skills.values()))
             jobList.append({'id': job.pk, 'title': job.job_name, 'company': job.company, 'cityName': job.city.city_name, 'stateCode': state.state_code, 'description': job.job_desc,
                             'minSalary': job.min_sal, 'maxSalary': job.max_sal, 'link': job.url, 'score': score, 'skills': reqSkillsCategories,
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
