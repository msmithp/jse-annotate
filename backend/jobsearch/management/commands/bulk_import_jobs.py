import os
from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = "Imports job data from a folder of CSV files into the Job database model"

    def add_arguments(self, parser):
        parser.add_argument("filepath", type=str,
                            help="Folder with CSV files from JobSpy output containing job data")

    def handle(self, *args, **options):
        for file in os.listdir(options["filepath"]):
            _, ext = os.path.splitext(file)

            if ext != ".csv":
                continue

            print(f"Importing {file}")
            call_command("import_job_data", f"{options["filepath"]}\\{file}")
