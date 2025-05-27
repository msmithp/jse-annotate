interface Site {
    name: string
    urls: string[],
    injectionSite: string,
    descriptionDivName: string,
    elementToWatch: string
}

const sites: Site[] = [
    {
        name: "indeedSearch",
        urls: [
            "www.indeed.com/jobs?"
        ],
        injectionSite: "div[id^='mosaic-aboveFullJobDescription']",
        descriptionDivName: "div[id='jobDescriptionText']",
        elementToWatch: "div[class^='jobsearch-RightPane']"
    },
    {
        name: "indeedView",
        urls: [
            "www.indeed.com/viewjob",
            "www.indeed.com/q"
        ],
        injectionSite: "div[id^='mosaic-aboveFullJobDescription']",
        descriptionDivName: "div[id='jobDescriptionText']",
        elementToWatch: "div[id^='viewJobSSRRoot']"
    },
    {
        name: "ziprecruiter",
        urls: [
            "www.ziprecruiter.com/jobs-search?"
        ],
        injectionSite: "div[class^='flex flex-col gap-y-8']",
        descriptionDivName: "div[class^='text-primary whitespace-pre-line break-words']",
        elementToWatch: "div[class^='site_content']"
    }
];

export default sites;
