import csv
from django.core.management.base import BaseCommand
from jobsearch.models import Job
from utils.process_job import process_job

class Command(BaseCommand):
    help = "Imports job data from a CSV file into the Job database model"

    def add_arguments(self, parser):
        parser.add_argument("filename", type=str,
                            help="CSV file from JobSpy output containing job data")

    def handle(self, *args, **options):
        jobs = []
        jobs_and_skills = []

        with open(options["filename"], encoding="utf8") as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header

            for row in reader:
                job_and_skill = process_job(row)

                jobs_and_skills.append(job_and_skill)
                jobs.append(job_and_skill[0])

        Job.objects.bulk_create(jobs)

        for job, skill_list in jobs_and_skills:
            job.skills.set(skill_list)

        print("Successfully created job data")
