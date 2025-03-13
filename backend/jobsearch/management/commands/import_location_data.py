import csv
from django.core.management.base import BaseCommand
# from jobsearch.models import Location
from jobsearch.models import Skill

class Command(BaseCommand):
    help = "Imports geographical data on U.S. cities into the Location model"

    def handle(self, *args, **options):
        print("Hello, world")
