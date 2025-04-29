from django.db import connection, reset_queries
from django.http import JsonResponse, HttpResponse, HttpRequest
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
def update_account(request: HttpRequest) -> HttpResponse:
    """
    Update the information associated with a user account, including their
    location, education level, year of experience, and skills

    :param request: An HTTP POST request containing the user's ID, updated
                    state ID, updated education level, updated experience,
                    and updated skill IDs.

    :return: An HTTP response of either 200, if update was successful, or 400,
             if an error occurred
    """
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
def get_user(request: HttpRequest) -> JsonResponse:
    """
    Get profile data associated with a user ID (username, state ID, education
    level, years of experience, and list of skill IDs)

    :param request: An HTTP GET request consisting of only the user's ID
    
    :return: A JSON dictionary of the following format:
    ```
    {
        "id": int,
        "username": str,
        "education": str,
        "yearsExperience": int,
        "skills": {
            "id": int,
            "name": str
        }[]
    }
    ```
    """
    # Get user associated with ID from HTTP request
    id = request.GET.get("id")
    user = User.objects.get(pk=id)

    # Create a list of skill dictionaries containing the ID and name of each skill
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
def create_account(request: HttpRequest) -> HttpResponse:
    """
    Create a new account, given a username, password, state ID, education level,
    years of experience, and a list of skill IDs

    :param request: An HTTP POST request, the body of which has this format:
    ```
    {
        "username": str,
        "password": str,
        "stateID": int,
        "education": str,
        "yearsExperience": int,
        "skills": list[int]
    }
    ```

    :return: An HTTP response with a status code of:

        * 200, if successful
        * 409, if a duplicate username is selected
        * 403, if the password fails validation (for being too short)
    """
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
        # Perform password validation - check if password is too short
        if len(password) < 8:
            return HttpResponse("Password must be at least 8 characters long",
                                status=403)

    # Create a new User object
    new_user = User.objects.create_user(username=username, password=password)
    
    # Create a new Profile object associated with the new User
    new_profile = Profile.objects.create(user=new_user, state=state_instance, 
                                         education=edu, years_exp=years_exp)
    
    # Set the skills of the new user
    new_profile.skill_name.set(skills)

    return HttpResponse(status=200)

def skill_search(request: HttpRequest) -> JsonResponse:
    """
    Given a list of states, compute and return the following:
        * The most common skills (max 10) in each skill category, based on number of
          job descriptions that mention them, in all specified states
        * The most common skill in each county of all specified states

    :param request: An HTTP GET request containing a list of IDs of states that
                    will be searched for skills

    :return: A JSON dictionary of the following format:
    ```
    {
        # Top skills (max 10) in each category:
        "skills": {
            "category": str,
            "skills": {
                "id": int;
                "skillName": str;
                "occurrences": int;
            }[]
        }[],
        
        # Most common skill in each county in each state:
        "counties": {
            "stateData": {
                "stateID": int,
                "stateName": str,
                "stateCode": str
            },
            "countyData": {
                "countyID": int,
                "countyName": str,
                "countyFips": str,
                "skillID": int,
                "skillName": str,
                "numJobs": int
            }[]
        }[]
    }
    ```
    """
    userState = request.GET.getlist("states[]")

    skill_counts = []
    reset_queries()
    """categories = list(Skill.objects.values_list('category', flat=True).distinct())
    for category in categories:
        catInfo = {'category': category, 'skills': []}
        skill_counts.append(catInfo)
        skill_set = Skill.objects.filter(category=category)
        for item in skill_set:
                num_jobs = Job.objects.filter(skills=item, city__county__state__in=userState).count()
                catInfo['skills'].append({'id': item.pk, 'skillName': item.skill_name, 'occurrences': num_jobs})"""
    
    skill_set = Skill.objects.all()
    skill_occurrences = {skill: 0 for skill in skill_set}

    job_set = Job.objects.filter(city__county__state__in=userState).prefetch_related("skills").all()
    for job in job_set:
        if job.skills.all():
            for item in job.skills.all():
                skill_occurrences[item] += 1
    #print(skill_occurrences)

    categories = set()
    for skill in skill_set:
        categories.add(skill.category)

    for category in categories:
        catInfo = {'category': category, 'skills': []}
        skill_counts.append(catInfo)
        for skill in skill_set:
            if skill.category == category:
                catInfo['skills'].append({
                    'id': skill.pk,
                    'skillName': skill.skill_name,
                    'occurrences': skill_occurrences[skill]
                })

    #print(skill_counts)
    print("Skill count query count: ", len(connection.queries))
    reset_queries()

    #After midterm: Dictionary of U.S. states, where each state is a dictionary of (county, most_common_skill) pairs
    countyVals = []
    states = State.objects.filter(pk__in=userState)

    reset_queries()
    for thisState in states:
        #make state info, append to countyVals
        stateInfo = {
            'stateData': {
                'stateID': thisState.pk,
                'stateName': thisState.state_name,
                'stateCode': thisState.state_code
            },
            'countyData': []
        }
        countyVals.append(stateInfo)

        #get list of counties within state, get list of all skill pks
        counties = County.objects.filter(state=thisState)
        total_skills = list(Skill.objects.values_list("pk", flat=True))

        for thisCounty in counties: #for each county, create new skill_occurrences list
            skill_occurrences = {skill: 0 for skill in total_skills}
            jobList = Job.objects.filter(city__county=thisCounty).prefetch_related("skills").all()

            for item in jobList:
                if item.skills.all(): #if job has any required skills, count which skills are found, inc associated listing in skill_occurrences
                    for thisSkill in item.skills.all():
                        skill_occurrences[thisSkill.pk] += 1
                    
            #print(thisCounty, skill_occurrences)

            commonSkillID = max(skill_occurrences, key = skill_occurrences.get)
            numJobs = skill_occurrences[commonSkillID]

            #print(thisCounty, commonSkillID)

            if numJobs == 0:
                commonSkillID = -1
                commonSkillName = ""
            else:
                temp = Skill.objects.get(pk=commonSkillID)
                commonSkillName = temp.skill_name

            stateInfo['countyData'].append({
                'countyID':thisCounty.pk,
                'countyName': thisCounty.county_name,
                'countyFips': thisCounty.fips,
                'skillID': commonSkillID, 
                'skillName': commonSkillName,
                'numJobs': numJobs
            })
            
    print("Dictionary query count: ", len(connection.queries))
    reset_queries()
    #print(countyVals)
    return JsonResponse({'skills': skill_counts, 'counties': countyVals})

@csrf_exempt
def job_search(request: HttpRequest) -> JsonResponse: #assume userState is the state's id
    """
    Given a user's data and their selected states, find jobs in their states,
    calculate their compatibility for each job, and return a list of jobs

    :param request: An HTTP GET request containing the user's state IDs,
                    education level, years of experience, and skill IDs

    :return: A JSON dictionary of the following format:
    ```
    {
        "jobs": {
            "id": int,
            "title": str,
            "company": str,
            "cityName": str,
            "stateCode": str,
            "description": str,
            "minSalary": float,
            "maxSalary": float,
            "link": str,
            "score": float,
            "skills": {
                "category": str,
                "skills": {
                    "id": int,
                    "name": str
                }[]
            }[],
            "education": str,
            "yearsExperience": int
        }[]
    }
    ```
    """
    #Output: JSON dictionary consisting of a list of jobs. Each job should itself be a Python dictionary consisting of the title, location, description, salary, link to apply, and compatibility score.
    userState: list = request.GET.getlist("stateID[]")
    edu: str = request.GET.get("education")
    yearsExp: int = request.GET.get("yearsExperience")
    skillSet: list[int] = list(map(int, request.GET.getlist("skills[]")))

    yearsExp = int(yearsExp)
    states = State.objects.filter(pk__in=userState)

    jobList = []
    reset_queries()
    for state in states:
        jobs = (Job.objects.filter(city__county__state=state)
                .prefetch_related("skills")
                .select_related("city__county__state"))
        
        for job in jobs:
            reqSkills = job.skills.all()
            skillIDs = [s.pk for s in reqSkills]

            reqEdu = job.education
            reqYears = int(job.years_exp)
            score = calculate_compatibility(skillSet, edu, yearsExp, skillIDs, reqEdu, reqYears)
            reqSkillsCategories = categorize(reqSkills)

            jobList.append({
                'id': job.pk,
                'title': job.job_name,
                'company': job.company,
                'cityName': job.city.city_name,
                'stateCode': state.state_code,
                'description': job.job_desc,
                'minSalary': job.min_sal,
                'maxSalary': job.max_sal,
                'link': job.url,
                'score': score,
                'skills': reqSkillsCategories,
                'education': job.education,
                'yearsExperience': job.years_exp
            })
        
    print("Jobsearch query count: ", len(connection.queries))
    reset_queries()
    return JsonResponse({'jobs': jobList})

def get_static_data(request: HttpRequest) -> JsonResponse:
    """
    Retrieve data for use in the front-end that does not change in the course
    of a user's session (i.e., is static) for dropdown menu options

    :param request: An HTTP GET request with no body

    :return: A JSON dictionary of the following format:
    ```
    {
        "skills": {
            "category": str,
            "skills": {
                "id": int,
                "name": str
            }[]
        }[],
        "states": {
            "id": int,
            "name": str
        }[]
    }
    ```
    """
    #initialize skillValues dictionary
    skillValues = []
    categories = list(Skill.objects.values('category').distinct())
    for category in categories:
        catName = category['category']
        catData = {'category': catName, 'skills': []}
        skills = list(Skill.objects.filter(category=catName))

        for skill in skills:
            catData['skills'].append({
                'id':skill.pk,
                'name': skill.skill_name
            })
        skillValues.append(catData)

    #initialize locationValues dictionary
    locationValues = []
    #store all ids in a list
    states = State.objects.all()
    for state in states:
        locationValues.append({'id': state.pk, 'name': state.state_name})

    #output:
    return JsonResponse({
        'skills': skillValues,
        'states': locationValues
    })

def get_dashboard_data(request: HttpRequest) -> JsonResponse:
    """
    Given a user's ID, retrieve data used in their dashboard, including top 10
    skills in their state, their top 10 most compatible jobs, a list of their
    skills (for use in dropdown menus), and geographical information associated
    with the user's state

    :param request: An HTTP GET request containing a user's ID

    :return: A JSON dictionary of the following format:
    ```
    {
        "dashboardData": {
            "skills": {
                "id": int;
                "skillName": str;
                "occurrences": int;
            }[],
            "jobs": {
                "id": int,
                "title": str,
                "company": str,
                "cityName": str,
                "stateCode": str,
                "description": str,
                "minSalary": float,
                "maxSalary": float,
                "link": str,
                "score": float,
                "skills": {
                    "category": str,
                    "skills": {
                        "id": int,
                        "name": str
                    }[]
                }[],
                "education": str,
                "yearsExperience": int
            }[],

            "userSkills": {
                "category": str,
                "skills": {
                    "id": int,
                    "name": str
                }[]
            }[],

            "stateData": {
                "stateID": int,
                "stateName": str,
                "stateCode": str
            }
        }
    }
    ```
    """
    import time
    START_TIME = time.time()
    START_TIME_MASTER = time.time()
    # Get user and profile associated with user ID
    user_id = request.GET.get("id")
    user = User.objects.get(pk=user_id)
    profile = user.profile

    # Get user data from profile
    user_state = profile.state
    state = State.objects.get(state_name=user_state)
    edu = profile.education
    years_exp = profile.years_exp

    # Get skills in two forms:
    #  -- skill_list, which is a list of dictionaries consisting of all of the
    #     fields for each of the user's skills
    #  -- user_skill_ids, which is a list of the integer IDs of the user's skills
    skill_list: list[dict] = list(profile.skill_name.all().values())
    user_skill_ids: list[int] = [s["id"] for s in skill_list]

    # Dictionary format for JSON response
    dashboard_data = {
        'jobs': [],
        'skills': [],
        'userSkills': [],
        'stateData': {
            'stateID': state.pk, 
            'stateName': state.state_name, 
            'stateCode': state.state_code
        }
    }

    #append skill data to dict
    #total_skills = list(Skill.objects.values_list("pk", flat=True))
    #print(skills)
    reset_queries()
    job_set = list(Job.objects.filter(city__county__state=state.pk)
                   .prefetch_related("skills")
                   .select_related("city__county__state"))
    skills: dict[str, int] = {}
    for job in job_set:
        # Get all skills for this job, as a list of skill objects
        req_skills = job.skills.all()

        # Iterate through each skill in this job
        for skill in req_skills:
            skill_name = skill.skill_name
            if skill_name in skills:
                # Increment this skill's occurrences by 1
                skills[skill_name] += 1
            else:
                # Add a new skill in the dictionary with 1 occurrence
                skills[skill_name] = 1

    # Turn skills dictionary into a list of dictionaries, one for each skill
    occurrences = [
        {
            "skillName": name,
            "occurrences": occ
        } for (name, occ) in skills.items()
    ]

    print("Skill occurrences:", time.time() - START_TIME)
    START_TIME = time.time()

    for i in range (0,10): #append top ten most frequent skills to dict
        max_occ = max(occurrences, key=lambda x:x['occurrences'])
        dashboard_data['skills'].append(max_occ)
        occurrences.remove(max_occ)

    print("Top ten skill occurrences:", time.time() - START_TIME)
    START_TIME = time.time()

    print("Skill dict query count: ", len(connection.queries))

    #append job data to dict - top 10 most compatible jobs
    top_scores = []

    reset_queries()
    for job in job_set:
        req_skills = job.skills.all()
        req_skill_ids = [s.pk for s in req_skills]
        req_edu = job.education
        req_years = int(job.years_exp)
        score = calculate_compatibility(user_skill_ids, edu, years_exp,
                                        req_skill_ids, req_edu, req_years)
        reqSkillsCategories = categorize(req_skills)
        top_scores.append({
            'id': job.pk,
            'title': job.job_name,
            'company': job.company,
            'cityName': job.city.city_name,
            'stateCode': state.state_code,
            'description': job.job_desc,
            'minSalary': job.min_sal,
            'maxSalary': job.max_sal,
            'link': job.url,
            'score': score,
            'skills': reqSkillsCategories,
            'education': job.education,
            'yearsExperience': job.years_exp
        })
    print("Job dict query count: ", len(connection.queries))
    reset_queries()

    print("Jobs:", time.time() - START_TIME)
    START_TIME = time.time()
    
    #get_top_10(top_scores, dashboard_data['jobs'], 'score')
    for j in range (0,10): #append top ten most frequent skills to dict
        top_score = max(top_scores, key=lambda x:x['score'])
        dashboard_data['jobs'].append(top_score)
        top_scores.remove(top_score)

    print("Top 10 jobs:", time.time() - START_TIME)
    START_TIME = time.time()

    #append user skill data to dict
    categories = set()
    for skill in skill_list:
        categories.add(skill['category'])

    for cat in categories:
        cat_data = {
            'category': cat,
            'skills': []
        }

        for skill in skill_list:
            if skill['category'] == cat:
                cat_data['skills'].append({
                    'id':skill['id'],
                    'name': skill['skill_name']
                })
        dashboard_data['userSkills'].append(cat_data)

    print("User skills:", time.time() - START_TIME)
    print("Total time:", time.time() - START_TIME_MASTER)

    return JsonResponse({'dashboardData': dashboard_data})

def get_density_data(request: HttpRequest) -> JsonResponse:
    """
    Given a user's ID and a skill ID, calculate and return a floating point
    value quantifying employer demand for the selected skill for each county
    of the user's state
    
    :param request: An HTTP GET request containing the user's ID and the skill
                    whose demand will be quantified

    :return: A JSON dictionary of the following format:
    ```
    {
        "stateData": {
            "stateID": int,
            "stateName": str,
            "stateCode": str
        },
        "countyData": {
            "countyID": int,
            "countyName": str,
            "countyFips": str,
            "density": float,
            "numJobs": int
        }[],
        "skillData": {
            "skillID": int,
            "skillName": str
        }
    }
    ```
    """
    reset_queries()
    user_id = request.GET.get("id")
    this_skill = request.GET.get("skill")

    user = User.objects.get(pk=user_id)
    profile = user.profile
    user_state = profile.state

    this_state = State.objects.get(state_name = user_state)

    skill = Skill.objects.get(pk=this_skill)

    data = {
        'stateData': {
            'stateID': this_state.pk,
            'stateName': this_state.state_name,
            'stateCode': this_state.state_code
        },
        'countyData': [],
        'skillData': {
            'skillID': this_skill,
            'skillName': skill.skill_name
        }
    }
    
    counties = list(County.objects.filter(state=this_state))

    occurrences = []
    print("Density prep query count: ", len(connection.queries))
    reset_queries()
    for county in counties:
        job_set = Job.objects.filter(city__county=county.pk).prefetch_related('skills')
        count = 0
        #occurrences.append(get_max(job_set, skill, county.county_name, count))

        for job in job_set:
            req_skills = list(job.skills.values_list("pk", flat=True))
            if req_skills:
                if skill.pk in req_skills:
                    count += 1
        occurrences.append({
            'countyName': county.county_name,
            'occurrences': count
        })

    max_occ = max(occurrences, key=lambda x:x['occurrences'])

    print("Density data query count: ", len(connection.queries))
    reset_queries()

    for county in counties: 
        for item in occurrences:
            if item['countyName'] == county.county_name:
                density = item['occurrences']/max_occ['occurrences']

                data['countyData'].append({
                    'countyID':county.pk,
                    'countyName': county.county_name,
                    'countyFips': county.fips,
                    'density': density,
                    'numJobs': item['occurrences']
                })
    
    #print(json.dumps(data, indent=4))
    return JsonResponse({'densityData': data})

def get_max(job_set, skill, item_name, count): #ERROR: returns 's' as undefined. looks like that's the user's skills? why is that the case
    for job in job_set:
        req_skills = list(job.skills.values_list("pk", flat=True))
        if req_skills:
            if skill['id'] in req_skills:
                count += 1
    return {'item_name': item_name, 'occurrences': count}

def get_top_10(dicts, section, feature): #ERROR: max_occ comes up as empty
    #print(dicts, section, dicts[feature])
    for i in range (0,10): #append top ten most frequent skills to dict
        max_occ = max(dicts, key=lambda x:x[feature])
        section.append(max_occ)
        dicts.remove(max_occ)