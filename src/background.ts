import { extract } from "./skillExtract";
import { formatRequirements } from "./formatting";
import { Site } from "./types";
import { getElementNameToWatch, getInjectionSite, 
    getJobDescription, 
    getSiteFromURL} from "./siteUtils";

let currentJobDescription: string | null = null;
let site: Site | null = null;

/**
 * Inject job requirements into the job pane on Indeed
 * @param force Force inject job requirements even if description has not
 *              changed since last injection
 */
function injectJobSearch(site: Site, force?: boolean): void {
    // Get the HTML div located directly above the job description
    const injectionSite = getInjectionSite(site);
    const elem = document.querySelector(injectionSite);

    // Get job description
    const jobDesc = getJobDescription(site);

    // Ignore update if job description cannot be found, if job description
    // has not changed since last update, or if elem is null
    if (force === undefined || force === false) {
        if (jobDesc === currentJobDescription) {
            return;
        }
    }
    
    if (jobDesc === null || elem === null) {
        return;
    }

    currentJobDescription = jobDesc;
    const requirements = extract(jobDesc);

    // Create div to be injected
    let div = document.createElement("div");
    div.className = "jobsearch-injectedRequirements";
    div.innerHTML = formatRequirements(requirements);

    // If a div with this class name already exists, then the div was
    // already injected
    const alreadyInjected = document.querySelectorAll(
        "div[class='jobsearch-injectedRequirements']"
    ).length !== 0;

    // Inject div if it hasn't already been injected
    if (!alreadyInjected) {
        inject(div, elem);
    }
}

/**
 * Inject an HTML element inside of another element
 * @param elem HTML element to be injected
 * @param inside HTML element into which `elem` will be injected
 */
function inject(elem: Element, inside: Element): void {
    // Inject `elem` inside `inside` element
    inside.appendChild(elem);
}

/**
 * Callback function injects requirements data whenever DOM is updated
 * @param mutationList List of mutations made to DOM
 * @param _ Mutation observer (unused)
 */
function callback(mutationList: MutationRecord[], _: MutationObserver): void {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            // If child node was added or removed, inject requirements data.
            // If a child node was added, then FORCE inject requirements.
            // This is a workaround to force requirements to show up after a
            // page refresh.
            const wereNodesAdded = mutation.addedNodes.length !== 0;
            injectJobSearch(site!, wereNodesAdded);
        }
    }
}

/**
 * Observe HTML DOM for changes, and update injected HTML when it changes
 */
function observeDOM(site: Site): void {
    // Get element to watch
    const nameToWatch = getElementNameToWatch(site);
    const toWatch = document.querySelector(nameToWatch);

    // Observe DOM for changes
    const observer = new MutationObserver(callback);

    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };

    observer.observe(toWatch!, config);
}

site = getSiteFromURL(document.URL);
if (site === null) {
    // Default to indeedSearch if no site was found
    site = "indeedSearch"
}

console.log(site);

observeDOM(site);
