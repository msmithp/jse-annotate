import { removeHtmlTags } from "./utils";
import { extract } from "./skillExtract";
import { formatRequirements } from "./formatting";

let currentJobDescription: string | null = null;

/**
 * Get the job description of a job on the job search page of Indeed
 * @returns Job description, or `null` if one cannot be found
 */
function getJobDescription(): string | null {
    // Get HTML div containing job description
    const JOB_DESCRIPTION_ID = "jobDescriptionText";
    const elem = document.querySelector(`div[id='${JOB_DESCRIPTION_ID}']`);

    if (elem == null) {
        // If job description can't be found, return null
        return null;
    } else {
        // Otherwise, return the HTML with all tags removed
        return removeHtmlTags(elem!.outerHTML);
    }
}

/**
 * Inject job requirements into the job pane on Indeed
 */
function injectJobSearch(): void {
    // Get the HTML div located directly above the job description
    const ID_PREFIX = "mosaic-aboveFullJobDescription";
    const elem = document.querySelector(`div[id^='${ID_PREFIX}']`);

    // Get job description
    const jobDesc = getJobDescription();

    // Ignore update if job description cannot be found or if job description
    // has not changed since last update
    if (jobDesc === null || jobDesc === currentJobDescription) {
        return;
    }

    currentJobDescription = jobDesc;
    const requirements = extract(jobDesc);

    // Create div to be injected
    let div = document.createElement("div");
    div.className = "jobsearch-injectedRequirements";
    // div.innerHTML = "<h2>Requirements</h2><p>Some stuff</p><hr>";
    div.innerHTML = formatRequirements(requirements);

    // If a div with this class name already exists, then the div was
    // already injected
    const alreadyInjected = document.querySelectorAll(
        "div[class='jobsearch-injectedRequirements']"
    ).length !== 0;

    // Inject div if it hasn't already been injected
    if (!alreadyInjected) {
        inject(div, elem!);
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
            // If child node was added or removed, inject requirements data
            injectJobSearch();
        }
    }
}

/**
 * Observe HTML DOM for changes, and update injected HTML when it changes
 */
function observeDOM(): void {
    // Get right pane of Indeed job search page
    const pane = document.querySelector("div[class^='jobsearch-RightPane']");

    // Observe DOM for changes
    const observer = new MutationObserver(callback);

    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };

    observer.observe(pane!, config);
}

observeDOM();
