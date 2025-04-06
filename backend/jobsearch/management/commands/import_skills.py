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

        """Skill.objects.get_or_create(skill_name='Python', category='Languages')
        Skill.objects.get_or_create(skill_name='Java', category='Languages')
        Skill.objects.get_or_create(skill_name='C++', category='Languages')
        Skill.objects.get_or_create(skill_name='R', category='Languages')
        Skill.objects.get_or_create(skill_name='C#', category='Languages')
        Skill.objects.get_or_create(skill_name='C', category='Languages')
        Skill.objects.get_or_create(skill_name='Visual Basic', category='Languages')
        Skill.objects.get_or_create(skill_name='Ruby', category='Languages')
        Skill.objects.get_or_create(skill_name='Swift', category='Languages')
        Skill.objects.get_or_create(skill_name='Golang', category='Languages')
        Skill.objects.get_or_create(skill_name='Perl', category='Languages')
        Skill.objects.get_or_create(skill_name='TypeScript', category='Languages')
        Skill.objects.get_or_create(skill_name='MATLAB', category='Languages')
        Skill.objects.get_or_create(skill_name='Rust', category='Languages')
        Skill.objects.get_or_create(skill_name='Pascal', category='Languages')
        Skill.objects.get_or_create(skill_name='Fortran', category='Languages')
        Skill.objects.get_or_create(skill_name='PHP', category='Languages')
        Skill.objects.get_or_create(skill_name='Ada', category='Languages')
        Skill.objects.get_or_create(skill_name='Kotlin', category='Languages')
        Skill.objects.get_or_create(skill_name='COBOL', category='Languages')
        Skill.objects.get_or_create(skill_name='Prolog', category='Languages')
        Skill.objects.get_or_create(skill_name='Lisp', category='Languages')
        Skill.objects.get_or_create(skill_name='Haskell', category='Languages')

        Skill.objects.get_or_create(skill_name='Node.js', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Angular', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Express.js', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Flask', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Django', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Rails', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Laravel', category='Frameworks')
        Skill.objects.get_or_create(skill_name='React', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Next.js', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Svelte', category='Frameworks')
        Skill.objects.get_or_create(skill_name='Vue', category='Frameworks')

        Skill.objects.get_or_create(skill_name='SQL', category='Database Management')
        Skill.objects.get_or_create(skill_name='PostgreSQL', category='Database Management')
        Skill.objects.get_or_create(skill_name='NoSQL', category='Database Management')
        Skill.objects.get_or_create(skill_name='MongoDB', category='Database Management')
        Skill.objects.get_or_create(skill_name='MySQL', category='Database Management')
        Skill.objects.get_or_create(skill_name='Oracle', category='Database Management')
        Skill.objects.get_or_create(skill_name='SQLite', category='Database Management')
        Skill.objects.get_or_create(skill_name='MariaDB', category='Database Management')
        Skill.objects.get_or_create(skill_name='Redis', category='Database Management')

        Skill.objects.get_or_create(skill_name='JavaScript', category='Web Development')
        Skill.objects.get_or_create(skill_name='HTML', category='Web Development')
        Skill.objects.get_or_create(skill_name='CSS', category='Web Development')

        Skill.objects.get_or_create(skill_name='Git', category='Tools')
        Skill.objects.get_or_create(skill_name='Docker', category='Tools')
        Skill.objects.get_or_create(skill_name='Google Cloud', category='Tools')
        Skill.objects.get_or_create(skill_name='Azure', category='Tools')
        Skill.objects.get_or_create(skill_name='AWS', category='Tools')
        Skill.objects.get_or_create(skill_name='Shell', category='Tools')

        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name='Google Cloud'), alt_name='GCP')
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name='AWS'), alt_name='Amazon Web Services')
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name="Express.js"), alt_name="ExpressJS")
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name="Express.js"), alt_name="Express")
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name="Node.js"), alt_name="NodeJS")
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name="Angular"), alt_name="Angular.js")
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name="Angular"), alt_name="AngularJS")
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name="Next.js"), alt_name="NextJS")
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name="Vue"), alt_name="Vue.js")
        AltSkill.objects.get_or_create(skill=Skill.objects.get(skill_name="Vue"), alt_name="VueJS")"""
        