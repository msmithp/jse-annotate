import csv
from django.core.management.base import BaseCommand
from jobsearch.models import Job
from utils.process_job import process_job

class Command(BaseCommand):
    help = "Scrapes job data from Indeed and inserts it into the database"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        pass
