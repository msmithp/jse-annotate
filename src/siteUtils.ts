import { Site } from "./types";
import { escapeRegExp, removeHtmlTags } from "./utils";
import sites from "./sites";

export function getSiteFromURL(url: string): Site | null {
    for (const site of sites) {
        const patterns = site.urls;

        for (const pattern of patterns) {
            const regex = ".*" + escapeRegExp(pattern) + ".*";

            if (url.search(regex) !== -1) {
                return site;
            }
        }
    }

    return null;
}

/**
 * Get the job description of a job on the job search page of a website
 * @param site Website where job is being viewed
 * @returns Job description, or `null` if one cannot be found
 */
export function getJobDescription(site: Site): string | null {
    // Get HTML div containing job description
    const divName = site.descriptionDivName;
    const elem = document.querySelector(divName);

    if (elem === null) {
        // If job description can't be found, return null
        return null;
    } else {
        // Otherwise, return the HTML with all tags removed
        return removeHtmlTags(elem.outerHTML);
    }
}
