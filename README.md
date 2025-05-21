# Avelum

A browser extension for annotating job listings in the computer science field

## Repository Information

The GitHub repository for this project may be found [here](https://github.com/msmithp/avelum). This project is a fork of the Job Search Engine, the repository of which can be found [here](https://github.com/msmithp/job-search-engine).

## Usage

When Avelum is in enabled in your browser, you will see experience, education, and skill requirements listed for jobs on Indeed. This information can be found on the right-hand pane of the job search page above the description of the job.

## Setup Instructions

### Prerequisites
* npm 6.0.0 or higher
* Node.js 14.0.0 or higher

### Building the Project

1. Clone the git repository:

    ```
    git clone https://github.com/msmithp/avelum.git
    cd avelum
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Build the project:

    ```
    npm run build
    ```

    This will create a `dist` folder.

4. To add the extension to your Google Chrome browser, visit `chrome://extensions` in the browser, activate developer mode, click `Load unpacked`, then upload the `dist` folder.

### Running Tests

To run the test suite, use `npm run test`.