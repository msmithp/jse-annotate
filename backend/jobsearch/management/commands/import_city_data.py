import csv
from django.core.management.base import BaseCommand
from jobsearch.models import City, County, State

class Command(BaseCommand):
    help = "Imports geographical data on U.S. cities into the City, County," \
    " and State models"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Delete existing data and force import"
        )

    def handle(self, *args, **options):
        if City.objects.exists() or County.objects.exists() or State.objects.exists():
            if not options["force"]:
                raise Exception("Location tables already have data in them. Use "
                "'--force' to delete existing location data and re-import data.")
            else:
                # Force delete all existing data
                City.objects.all().delete()
                County.objects.all().delete()
                State.objects.all().delete()

        """ Add states to database """
        # We maintain a mapping: `state_code` -> `state_ID` (e.g., "MD" -> 5) to
        # allow quick access to database IDs when setting foreign keys
        state_map = {}
        with open("./initialdata/usstates.csv") as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header

            # Iterate through rows of CSV
            for row in reader:
                state_name = row[0]
                state_code = row[1]
                
                state_ID, _ = State.objects.get_or_create(
                    state_name=state_name,
                    state_code=state_code
                )

                # Map two-letter state code to state IDs in database
                state_map[state_code] = state_ID


        """ Add cities and counties to database """
        county_map = {}
        with open("./initialdata/uscities.csv") as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header

            # Iterate through rows of CSV
            for row in reader:
                county_name = row[5]
                state_code = row[2]
                fips = row[4]

                if state_code not in state_map:
                    # Skip if county's state is not in the state map
                    continue

                # Create county entry in database
                county_ID, created = County.objects.get_or_create(
                    county_name=county_name,
                    state=state_map[state_code],
                    fips=fips
                )

                # Only add county to map if it was newly created
                if created:
                    county_map[fips] = county_ID

            # Reset CSV iterable
            f.seek(1)

            # Iterate through rows of CSV
            cities = []
            for row in reader:
                city_name = row[1]
                latitude = row[6]
                longitude = row[7]
                population = row[8]
                fips = row[4]

                if fips not in county_map:
                    # Skip if this city's county is not in the county map
                    continue

                # Create new City object and append to cities list
                city = City(city_name=city_name, latitude=latitude,
                            longitude=longitude, population=population,
                            county=county_map[fips])
                
                cities.append(city)

            # Bulk create cities
            City.objects.bulk_create(cities)

        """ Add missing counties """
        # Add counties missing from the CSV (i.e., counties with no cities)
        County.objects.get_or_create(county_name="Greensville",
                                     state=state_map["VA"],
                                     fips="51081")
        
        County.objects.get_or_create(county_name="James City",
                                     state=state_map["VA"],
                                     fips="51095")
        
        County.objects.get_or_create(county_name="Kalawao",
                                     state=state_map["HI"],
                                     fips="15005")

        County.objects.get_or_create(county_name="Lincoln",
                                     state=state_map["ME"],
                                     fips="23015")
        
        County.objects.get_or_create(county_name="Bristol",
                                     state=state_map["RI"],
                                     fips="44001")
        
        County.objects.get_or_create(county_name="Echols",
                                     state=state_map["GA"],
                                     fips="13101")

        County.objects.get_or_create(county_name="Quitman",
                                     state=state_map["GA"],
                                     fips="13239")

        County.objects.get_or_create(county_name="Webster",
                                     state=state_map["GA"],
                                     fips="13307")
        
        County.objects.get_or_create(county_name="Las Marías",
                                     state=state_map["PR"],
                                     fips="72083")

        print("Successfully created location data")
