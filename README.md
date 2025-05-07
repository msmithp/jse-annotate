# job-search-engine

A web app for finding tech jobs and gauging employer demands

## GitHub Repository

The GitHub repository for this project may be found [here](https://github.com/msmithp/job-search-engine).

## Team Information

* Chris Pappelis
    * Role: Lead Back-End Developer
    * Contact: cfp4@hood.edu
* Matthew Smith
    * Role: Lead Front-End Developer
    * Contact: mps3@hood.edu

## Description

The Job Search Engine is a web app with two main aspects: It presents users with the most in-demand skills and requirements from employers in their area, and it lets users find the jobs in their desired region that they are most compatible with based on their experience, education, and skills. Additionally, users can create accounts and view a personalized dashboard to see at a glance how in-demand their skills are, what skills they should learn, and what jobs they should apply for. Job data is scraped from the web, and information on the requirements of each job is extracted from the title and descripton of the job. This extracted information is used to curate the jobs that users are shown and generate informative bar charts and choropleth maps (geographical heat maps). The app focuses specifically on jobs in the computer science field. The goal of the Job Search Engine is to make it easier for those in computer science and related fields to strengthen their résumé and find employment in their area.

## Tech Stack

* **JavaScript runtime**: Node.js
* **Front-end**: React
* **Back-end**: Django
* **Database**: PostgreSQL
* **Libraries and APIs**: JobSpy, Leaflet, Chart.js
* **Programming Languages**: Python, TypeScript

## Project Structure

For brevity's sake, files and directories that are unused or that are of minimal importance are omitted in the project structure tree.

```
job-search-engine/
├── backend/
│   ├── backend/            # Configuration files and back-end URLs
│   ├── jobsearch/          
│   │   ├── management/     # Django management commands
│   │   ├── admin.py        # Django admin page setup
│   │   ├── models.py       # Database schema
│   │   ├── serializers.py  # Database serializers
│   │   └── views.py        # Back-end functions and queries
│   ├── utils/              # Helper functions, initial database data, job data
│   └── manage.py
├── documentation/          # Documentation, diagrams, and presentations
└── frontend/
    ├── public/             # Publicly available website data
    └── src/
        ├── api/            # Axios instance for calling back-end while authenticated
        ├── components/     # React components
        ├── context/        # React context components for authentication and static data
        ├── geodata/        # GeoJSON data for U.S. counties
        ├── pages/          # React components for pages of front-end
        ├── static/         # Utility functions and TypeScript type declarations
        ├── style/          # CSS styling
        ├── App.tsx
        └── index.tsx
```

## Installation and Configuration

### Prerequisites

* Node.js 22.9.0 or higher
* npm 10.8.3 or higher
* Python 3.12 or higher
* Pipenv 2024.1.0 or higher
* PostgreSQL 17.0 or higher

### Building the Project

First, download the project files and install dependencies for the front-end and back-end.

1. Clone the git repository:

    ```
    git clone https://github.com/msmithp/job-search-engine.git
    cd job-search-engine
    ```

2. Create a Python virtual environment and install Python dependencies:

    ```
    pipenv install
    ```

3. Install JavaScript dependencies:

    ```
    cd frontend
    npm install
    ```

### Setting Up the Database

Next, create a PostgreSQL database which will store the data used by the application.

1. Open the PostgreSQL command line tool as the root user:

    ```
    psql -U postgres -h localhost
    ```

    You will be prompted to enter the password for the PostgreSQL root user.

2. Create the `jobsearch` database:

    ```postgresql
    CREATE DATABASE jobsearch;
    ```

3. Create a database user for reading from and writing to the database:

    ```postgresql
    CREATE USER jobsearch_user WITH PASSWORD 'jobsearch_pass';
    ```

    You may use any username in place of `jobsearch_user` and any password in place of `jobsearch_pass`, but you will need to remember them for later when setting up the `.env` file.

4. Give owner permissions to the new database user:

    ```postgresql
    ALTER DATABASE jobsearch OWNER TO jobsearch_user;
    ```

5. Exit out of the PostgreSQL command line tool by typing `\q` or by pressing `Ctrl+C`.

### Setting Environment Variables

Next, create a `.env` file, which will allow the Django back-end to access the database and perform CRUD operations.

1. Navigate to the `job-search-engine/backend/backend/` folder. Create a file called `.env`.

2. Open the `.env` file in a text editor. Place the following contents in the file:

    ```
    SECRET_KEY=<secret_key>
    DEBUG=True
    DB_NAME=jobsearch
    DB_USER=jobsearch_user
    DB_PASSWORD=jobsearch_pass
    DB_HOST=localhost
    DB_PORT=5432
    ```

    If you used a different username and password for the database, write them in the `.env` file in place of `jobsearch_user` and `jobsearch_pass`.

    You may use any string as a Django secret key. If you would like to generate a new Django secret key, navigate to the `job-search-engine` directory and use the following commands:

    ```
    pipenv shell
    cd backend
    python manage.py shell
    ```

    After the shell starts, use the following commands:

    ```
    >>> from django.core.management.utils import get_random_secret_key
    >>> get_random_secret_key()
    ```

    This will generate a new random key. Use `exit()` to abort the shell session.

### Importing Initial Data

Next, add the required initial data to the database, including geographical and skill data.

1. Navigate to the `job-search-engine` directory and enter the pipenv shell:

    ```
    pipenv shell
    ```

2. Navigate to the `job-search-engine/backend/` folder, and make database migrations:

   ```
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

3. Import skill data to the database:

    ```
    python manage.py import_skills
    ```

4. Import location data:

    ```
    python manage.py import_city_data
    ```

5. (Optional) Import initial job data from the provided `.csv` files:

    ```
    python manage.py bulk_import_jobs utils/jobs
    ```

    To import job data from a single `.csv` file, use the following command:

    ```
    python manage.py import_job_data <path_to_csv>
    ```

### Running the Project

Finally, run and use the project.

1. Open a terminal window in the `job-search-engine/backend/` directory. Then, start the back-end:

    ```
    pipenv run python manage.py runserver
    ```

2. Open a new, separate terminal window in the `job-search-engine/frontend/` directory. Then, start the front-end:

    ```
    npm start
    ```

3. After the front-end starts, the website should open automatically in a web browser. If it does not, then open a web browser and visit `localhost:3000`. 

### Scraping New Jobs

This section discusses how to scrape new job data.

1. Navigate to the `job-search-engine/` directory and enter a pipenv shell session:

    ```
    pipenv shell
    ```

2. Navigate to the `job-search-engine/backend/` directory:

    ```
    cd backend
    ```

3. Use the following command to scrape new jobs and add them to the database:

    ```
    python manage.py scrape <num_jobs>
    ```

    The following options are available:
    
    * `--nocsv` - Flag that prevents a `.csv` file of scraped jobs from being exported. By default, scraped jobs will be saved in both the database and in a `.csv` file in the `job-search-engine/backend/utils/jobs/` folder.
    * `--hours <num_hours>` - Specifies the maximum number of hours old a scraped job may be. Note that the age of a job posting as specified here is the age of the posting on Indeed, not the age of the posting on the employer's website.
    * `--today` - Flag that limits scraped jobs to just those uploaded on the current date. If both `--hours` and `--today` are specified, then `--today` will take precedence. **The `--today` flag is stricter than the `--hours` flag**: The `--today` flag will only return jobs whose posting date **on the employer's website** is today. In other words, it will only return jobs whose original posting has occurred **today** (i.e., between midnight and the current time).

    There is a limit of 1,000 jobs imposed on the `scrape` command, since anything higher than this may get you rate-limited.

To clear all jobs from the database, use the following command:

```
python manage.py clear_jobs
```
