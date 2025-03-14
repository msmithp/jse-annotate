import csv
from django.core.management.base import BaseCommand
# from jobsearch.models import Location
from jobsearch.models import Skill, AltSkill

class Command(BaseCommand):
    help = "Imports skill data into the database"

    def handle(self, *args, **options):

        Skill.objects.all().delete()
        AltSkill.objects.all().delete()

        Skill.objects.create(skill_name='Python', category='Languages')
        Skill.objects.create(skill_name='Java', category='Languages')
        Skill.objects.create(skill_name='C++', category='Languages')
        Skill.objects.create(skill_name='R', category='Languages')
        Skill.objects.create(skill_name='C#', category='Languages')
        Skill.objects.create(skill_name='C', category='Languages')
        Skill.objects.create(skill_name='ANSI C', category='Languages')
        Skill.objects.create(skill_name='Objective-C', category='Languages')
        Skill.objects.create(skill_name='Visual Basic', category='Languages')
        Skill.objects.create(skill_name='Ruby', category='Languages')
        Skill.objects.create(skill_name='Swift', category='Languages')
        Skill.objects.create(skill_name='Go', category='Languages')
        Skill.objects.create(skill_name='Perl', category='Languages')
        Skill.objects.create(skill_name='TypeScript', category='Languages')
        Skill.objects.create(skill_name='MATLAB', category='Languages')

        Skill.objects.create(skill_name='Node.js', category='Frameworks')
        Skill.objects.create(skill_name='Angular', category='Frameworks')
        Skill.objects.create(skill_name='Express.js', category='Frameworks')
        Skill.objects.create(skill_name='Flask', category='Frameworks')
        Skill.objects.create(skill_name='Django', category='Frameworks')
        Skill.objects.create(skill_name='Rails', category='Frameworks')
        Skill.objects.create(skill_name='Laravel', category='Frameworks')
        Skill.objects.create(skill_name='React', category='Frameworks')
        Skill.objects.create(skill_name='Next.js', category='Frameworks')
        Skill.objects.create(skill_name='Svelte', category='Frameworks')
        Skill.objects.create(skill_name='Vue', category='Frameworks')

        Skill.objects.create(skill_name='SQL', category='Database Management')
        Skill.objects.create(skill_name='PostgreSQL', category='Database Management')
        Skill.objects.create(skill_name='NoSQL', category='Database Management')
        Skill.objects.create(skill_name='MongoDB', category='Database Management')
        Skill.objects.create(skill_name='MySQL', category='Database Management')
        Skill.objects.create(skill_name='Oracle', category='Database Management')
        Skill.objects.create(skill_name='SQLite', category='Database Management')
        Skill.objects.create(skill_name='MariaDB', category='Database Management')
        Skill.objects.create(skill_name='Redis', category='Database Management')

        Skill.objects.create(skill_name='JavaScript', category='Web Development')
        Skill.objects.create(skill_name='HTML', category='Web Development')
        Skill.objects.create(skill_name='CSS', category='Web Development')

        Skill.objects.create(skill_name='Git', category='Tools')
        Skill.objects.create(skill_name='Docker', category='Tools')
        Skill.objects.create(skill_name='Google Cloud', category='Tools')
        Skill.objects.create(skill_name='Azure', category='Tools')
        Skill.objects.create(skill_name='AWS', category='Tools')
        Skill.objects.create(skill_name='Shell', category='Tools')

        AltSkill.objects.create(skill=Skill.objects.get(skill_name='Google Cloud'), alt_name='GCP')
        AltSkill.objects.create(skill=Skill.objects.get(skill_name='AWS'), alt_name='Amazon Web Services')