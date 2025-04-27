import jobspy
import csv
from datetime import datetime, date

""" Parameters """
verbose = 0      # 0 for only errors, 1 for errors and warnings, 2 for all logs
append = False   # True to append to a file, False to create or overwrite a file
num_jobs = 1000  # Number of job listings to scrape

# Default file path where CSV will be saved
default_file_path = "./jobs/"

# List of job titles and keywords to search for
titles = ["software developer", "software engineer", "data scientist", 
          "cybersecurity", "web developer", "database administrator", 
          "systems administrator", "devops", "frontend developer", 
          "backend developer"]


def make_query(titles: list[str]) -> str:
    """
    Turn a list of job titles into a JobSpy Indeed query.

    :param titles: A list of jobs as strings

    :return: A string with the jobs in quotes and delimited by the string " OR "
    """
    return intercalate(list(map(lambda s: wrap(s, '"'), titles)), " OR ")


def wrap(s: str, wrapper: str) -> str:
    """
    Append and prepend a given string to another string.

    :param s: String to be wrapped
    :param wrapper: String to be added to the beginning and end of `s`

    :return: The wrapped string `wrapper` + `s` + `wrapper`
    """
    return wrapper + s + wrapper


def intercalate(lst: list, delim: str) -> str:
    """
    Insert a string between each item in a list and return a string.

    :param lst: List of items
    :param delim: String to be inserted in between each item

    :return: A string containing the contents of `lst` delimited by `delim`
    """
    n = len(lst)

    result = ""
    for i, item in enumerate(lst):
        if i == n - 1:
            # if item is last, just append item
            result += item
        else:
            # if item is not last, append item and the delimiter
            result += item + delim

    return result


def scrape(num_jobs: int = 10, file_path: str = None,
           hours_old: int = None, today: bool = False):
    """
    Scrape jobs from Indeed.

    :param num_jobs: Number of jobs to be scraped. Any number above 1000 is
                     likely to get you rate-limited.
    :param file_path: File path of exported CSV. To not export a CSV, pass
                      `None` for this argument.
    :param hours_old: Maximum number of hours old that a scraped job posting
                      can be. May still result in jobs whose posting date is
                      older than specified due to nature of scraper.
    :param today: `True` to limit scraped jobs to those posted on the current
                  date, `False` otherwise. This will remove any jobs from the
                  returned DataFrame whose posting dates are different from
                  today's date.

    :return: DataFrame containing job data
    """
    # Name of CSV file to which jobs will be saved
    file_name = f"jobs_{datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.csv"

    jobs = jobspy.scrape_jobs(
        site_name="indeed",
        search_term=make_query(titles),
        results_wanted=num_jobs,
        offset=0,
        country_indeed="USA",
        verbose=verbose,
        hours_old=hours_old
    )

    if verbose > 0:
        print(f"Found {len(jobs)} jobs")
        print(jobs.head())

    # Convert NaN to empty strings
    jobs = jobs.fillna("")

    if today:
        # Limit jobs to just those for which the date posted is equal to
        # today's date
        jobs = jobs[jobs["date_posted"] == date.today()]

    if file_path:
        if append:
            jobs.to_csv(file_path + file_name, mode='a', quoting=csv.QUOTE_NONNUMERIC,
                        escapechar="\\", index=False, header=False)
        else:
            jobs.to_csv(file_path + file_name, quoting=csv.QUOTE_NONNUMERIC, 
                        escapechar="\\", index=False)

    return jobs


if __name__ == "__main__":
    scrape(num_jobs, default_file_path)
