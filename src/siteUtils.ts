import { Site } from "./types";
import { escapeRegExp, removeHtmlTags } from "./utils";

export function getSiteFromURL(url: string): Site | null {
    const urlToSite: { [pattern: string]: Site } = {
        "://www.indeed.com/jobs?": "indeedSearch",
        "://www.indeed.com/viewjob": "indeedView",
        "://www.indeed.com/q": "indeedView",
        "://www.ziprecruiter.com/jobs-search?": "ziprecruiter"
    };

    for (const [pattern, site] of Object.entries(urlToSite)) {
        const regex = ".*" + escapeRegExp(pattern) + ".*";

        if (url.search(regex) !== -1) {
            return site;
        }
    }

    return null;
}

export function getInjectionSite(site: Site): string {
    switch (site) {
        case "indeedSearch":
            return "div[id^='mosaic-aboveFullJobDescription']";
        case "indeedView":
            return "div[id^='mosaic-aboveFullJobDescription']";
        case "ziprecruiter":
            return "";
        default:
            return "";
    }
}

/**
 * Get the job description of a job on the job search page of a website
 * @param site Website where job is being viewed
 * @returns Job description, or `null` if one cannot be found
 */
export function getJobDescription(site: Site): string | null {
    // Get HTML div containing job description
    const divName = getJobDescriptionDivName(site);
    const elem = document.querySelector(divName);

    if (elem === null) {
        // If job description can't be found, return null
        return null;
    } else {
        // Otherwise, return the HTML with all tags removed
        return removeHtmlTags(elem.outerHTML);
    }
}

function getJobDescriptionDivName(site: Site): string {
    switch (site) {
        case "indeedSearch":
            return "div[id='jobDescriptionText']";
        case "indeedView":
            return "div[id='jobDescriptionText']";
        case "ziprecruiter":
            return ""
        default:
            return "";
    }
}

export function getElementNameToWatch(site: Site): string {
    switch (site) {
        case "indeedSearch":
            return "div[class^='jobsearch-RightPane']";
        case "indeedView":
            return "div[id^='viewJobSSRRoot']";
        case "ziprecruiter":
            return "";
        default:
            return "";
    }
}
