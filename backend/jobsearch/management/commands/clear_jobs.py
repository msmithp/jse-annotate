from django.core.management.base import BaseCommand
from jobsearch.models import Job

class Command(BaseCommand):
    help = "Clears all jobs from the database"

    def handle(self, *args, **options):
        Job.objects.all().delete()
