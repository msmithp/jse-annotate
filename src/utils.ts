import { StringMap } from "./types";

export function mapReplace(s: string, map: StringMap): string {
    let newString = ""
    for (const c of s) {
        const replacement = map[c];

        if (replacement == undefined) {
            newString += c;
        } else {
            newString += replacement;
        }
    }

    return newString;
}

export function isInteger(s: string): boolean {
    for (const ch of s) {
        const ascii = ch.charCodeAt(0);

        // 48 is the ASCII value of 0 and 57 is the ASCII value of 9
        if (ascii < 48 || ascii > 57) {
            return false;
        }
    }

    return true;
}

export function anyFromListIn(list: string[], item: string): boolean {
    for (const s of list) {
        if (list.includes(item)) {
            return true;
        }
    }

    return false;
}