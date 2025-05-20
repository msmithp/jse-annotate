function testInject() {
    const idPrefix = "mosaic-aboveFullJobDescription";
    const elem = document.querySelector(`div[id^='${idPrefix}']`);
    let div = document.createElement("div");
    div.className = "jobsearch-injectedRequirements";
    div.innerHTML = "<h2>Requirements</h2><p>Some stuff</p><hr>";

    const alreadyInjected = document.querySelectorAll(
        "div[class='jobsearch-injectedRequirements']"
    ).length !== 0;

    if (!alreadyInjected) {
        inject(div, elem!);
    }
}

function inject(div: Element, inside: Element) {
    // Inject `div` inside `inside` element
    inside.appendChild(div);
}

// Get right pane of Indeed job search page
const pane = document.querySelector("div[class^='jobsearch-RightPane']");

const config = {
    attributes: true,
    childList: true,
    subtree: true
};

function callback(mutationList: MutationRecord[], _: MutationObserver) {
    for (const mutation of mutationList) {
        if (mutation.type === "childList") {
            console.log("A child node has been added or removed");
            testInject();
        } else if (mutation.type === "attributes") {
            console.log(`The ${mutation.attributeName} attribute was modified`);
        }
    }
}

const observer = new MutationObserver(callback);

observer.observe(pane!, config);
