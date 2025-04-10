from django.core.management.base import BaseCommand
from jobsearch.models import Skill, AltSkill
import csv
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Imports skill data into the database"

    def add_arguments(self, parser):
        parser.add_argument(
            "--delete",
            action="store_true",
            help="Delete existing skill data while importing data"
        )

    def handle(self, *args, **options):
        if options["delete"]:
            Skill.objects.all().delete()
            AltSkill.objects.all().delete()

        with open("utils/initial_data/skill_data.csv", encoding="utf8") as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header

            for row in reader:
                Skill.objects.get_or_create(skill_name=row[0], category=row[1])

        
        with open("utils/initial_data/alt_skill_data.csv", encoding="utf8") as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header

            for row in reader:
                skill = Skill.objects.get(skill_name=row[0])
                AltSkill.objects.get_or_create(skill = skill, alt_name=row[1])

        