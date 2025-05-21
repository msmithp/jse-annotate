/**
 * Inject job requirements into the job pane on Indeed
 */
function injectJobSearch(): void {
    // Get the HTML div located directly above the job description
    const idPrefix = "mosaic-aboveFullJobDescription";
    const elem = document.querySelector(`div[id^='${idPrefix}']`);

    // Create div which will be injected
    let div = document.createElement("div");
    div.className = "jobsearch-injectedRequirements";
    div.innerHTML = "<h2>Requirements</h2><p>Some stuff</p><hr>";

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
