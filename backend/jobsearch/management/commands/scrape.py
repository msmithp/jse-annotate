from django.core.management.base import BaseCommand
from utils.scraper import scrape
from utils.process_job import process_job
from jobsearch.models import Job

class Command(BaseCommand):
    help = "Scrapes job data from Indeed and inserts it into the database"

    def add_arguments(self, parser):
        parser.add_argument(
            "num_jobs",
            type=int,
            help="Number of jobs to scrape"
        )

        parser.add_argument(
            "--nocsv",
            action="store_true",
            help="Don't export a CSV of the scraped jobs"
        )

    def handle(self, *args, **options):
        if options["num_jobs"] > 1000:
            # Anything above 1000 jobs will get you rate-limited
            raise Exception("Maximum number of jobs (1000) exceeded")

        # Scrape job data
        job_data = scrape(options["num_jobs"], not options["nocsv"], "./utils/jobs/")
        print("Successfully scraped jobs. Adding to database...")
        
        # Store jobs and skills in arrays for bulk creation
        jobs = []
        jobs_and_skills = []

        # Iterate through rows of scraped job data
        for _, row in job_data.iterrows():
            # Convert row from Pandas series to a list
            row = row.to_list()

            # Convert posting date to a string so it can be parsed by process_job()
            row[7] = row[7].strftime("%Y-%m-%d")

            # Process job
            job_and_skill = process_job(row)
            jobs_and_skills.append(job_and_skill)
            jobs.append(job_and_skill[0])

        # Create job objects in database
        Job.objects.bulk_create(jobs)

        # Set skills of jobs
        for job, skill_list in jobs_and_skills:
            job.skills.set(skill_list)

        print("Successfully created job data")
