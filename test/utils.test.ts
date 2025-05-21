import { anyFromListIn } from "../src/utils";

const yearKeywords = ["year", "yr"];

test("checks if 'year' or 'yr' in 'years'", () => {
    expect(anyFromListIn(yearKeywords, "years")).toBe(true);
});

test("checks if 'year' or 'yr' in 'yrs'", () => {
    expect(anyFromListIn(yearKeywords, "yrs")).toBe(true);
});

test("checks if 'year' or 'yr' in 'year'", () => {
    expect(anyFromListIn(yearKeywords, "year")).toBe(true);
});

test("checks if 'year' or 'yr' in 'ayear'", () => {
    expect(anyFromListIn(yearKeywords, "ayear")).toBe(true);
});
