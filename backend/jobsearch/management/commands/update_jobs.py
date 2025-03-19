from django.core.management.base import BaseCommand
from jobsearch.models import Job
from utils.skillextract import extract

class Command(BaseCommand):
    help = "Re-extract all information (skills, education, years of experience)" \
           " from all job descriptions"
    
    def handle(self, *args, **options):
        jobs = Job.objects.all()

        for job in jobs:
            skills, education, experience = extract(job.job_desc)
            job.education = education
            job.years_exp = experience
            job.skills.set(skills)
            
            job.save()
