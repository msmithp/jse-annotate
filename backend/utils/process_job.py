import datetime
from jobsearch.models import Job, City
from utils.skillextract import extract


# Create a city cache so the database is hit only once when processing
# jobs in bulk
city_cache = None
def get_cities() -> list[dict]:
    """
    Get city and state data from the database as a list. Uses a global variable
    to reduce number of database hits when processing jobs in bulk.

    :return: List of cities as dictionaries consisting of their ID, name,
             population size, and associated state code
    """
    global city_cache

    if city_cache is None:
        city_cache = City.objects.select_related("county__state")
    return city_cache


def process_job(row: list[str]) -> tuple[Job, list[int]]:
    """
    Extract data from row of JobSpy output.

    :param row: One row of output from the JobSpy scraper, consisting of
                columns for job title, company, location, job description, etc.
    :return: A tuple, containing a Job object with extracted data and a list of
             the IDs of skills contained in the job's description
    """
    job_name = row[4]
    job_type = row[8]
    job_desc = row[19]
    company = row[5]
    city_and_state = row[6]
    is_remote = row[14]
    post_date = row[7]
    url = row[3] if len(row[3]) <= 600 else ""

    if row[11] != "" and row[12] != "":
        min_sal = float(row[11])
        max_sal = float(row[12])
    else:
        min_sal = None
        max_sal = None

    """ City processing """
    # Expected city name format is "city_name, state_code, US" - if
    # there aren't 2 commas, then this format is violated and we
    # set city to null
    city = None
    if city_and_state.count(',') == 2:
        # We now assume that city_and_state looks something like
        # "Frederick, MD, US".
        last_index_of_comma = city_and_state.rfind(',')

        if last_index_of_comma == len(city_and_state) - 4:
            # Trim off the ", US" portion of string
            city_and_state = city_and_state[:last_index_of_comma]

            # Get all but the last 4 characters to trim off state code
            city = city_and_state[:-4]

            # Get the last two characters (state code)
            state = city_and_state[-2:]

            all_cities = get_cities()
            candidate_cities = list(all_cities.filter(city_name=city).filter(county__state__state_code=state))
            
            if len(candidate_cities) == 0:
                # Job's city is not in database - set city to null
                city = None
            elif len(candidate_cities) == 1:
                # Exactly one match for job's city
                city = candidate_cities[0]
            else:
                # Multiple cities with same name and state - break tie by
                # picking city with greatest population
                city = max(candidate_cities, key=lambda x: x.population)

    """ Salary processing """
    pay_interval = row[10]  # "yearly", "hourly", or null
    if min_sal is not None and pay_interval == "hourly":
        # Convert hourly wage to yearly salary by multiplying by 40 hours a
        # week, and 52 weeks a year
        min_sal *= 40 * 52
        max_sal *= 40 * 52

    """ Date processing """
    # Date will be read in in the format "YYYY-MM-DD"
    year, month, day = post_date.split('-')
    post_date = datetime.date(int(year), int(month), int(day))

    """ Skill extraction """
    # Extract skill, education, and experience information from
    # job title and description
    skills, education, years_exp = extract(job_name + " " + job_desc)
    years_exp = min(years_exp, 20)

    # Remove escape characters from job description
    job_desc = job_desc.replace("\\", "")

    # Create job object, return job and skills
    job = Job(
        job_name=job_name,
        job_type=job_type,
        job_desc=job_desc,
        company=company,
        city=city,
        min_sal=min_sal,
        max_sal=max_sal,
        is_remote=is_remote,
        post_date=post_date,
        years_exp=years_exp,
        education=education,
        url=url
    )

    return job, skills
