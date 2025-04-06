/** Pick a color between many different colors based on the value of `n`,
 *  which is between 0 and 1
 */
export function polylinearGradient(colors: string[], n: number): string {
    const threshold = 1 / (colors.length - 1);
    const startIndex = Math.min(Math.floor(n / threshold), colors.length - 2);
    const endIndex = startIndex + 1;

    return linearGradient(
        colors[startIndex], colors[endIndex], (n / threshold) - startIndex
    );
}

/** Pick a color between two colors `start` and `end` based on the value
 *  `n`, which is between 0 and 1
 */
export function linearGradient(start: string, end: string, n: number): string {
    // Convert hex codes to RGB arrays
    const startRgb = hexToRgb(start);
    const endRgb = hexToRgb(end);

    /*
    Get the RGB values of the desired point between the two colors. Example:
    [ 243 ]   / [ 100 ]   [ 243 ] \         [ 172 ] 
    [ 105 ] + | [ 201 ] - [ 105 ] | * 0.5 = [ 153 ]
    [ 210 ]   \ [ 180 ]   [ 210 ] /         [ 195 ]
    */
    const vals = addArrays(
        startRgb, 
        scaleArray(subtractArrays(endRgb, startRgb), n)
    );
    
    // Convert RGB back to hex code
    return rgbToHex(vals);
}

/** Convert a hex value string of the form #F369D2 to an array of
 *  RGB values of the form [243, 105, 210]
*/
function hexToRgb(hex: string): number[] {
    return [
        parseInt(hex.substring(1, 3), 16),
        parseInt(hex.substring(3, 5), 16),
        parseInt(hex.substring(5, 7), 16),
    ];
}

/** Convert an array of RGB values of the form [243, 105, 210] to a hex
 *  code string of the form #F369D2
*/
function rgbToHex(vals: number[]): string {
    let hex = "#";

    for (const val of vals) {
        let hexVal = val.toString(16);

        if (hexVal.length === 1) {
            // Add leading 0, if necessary
            hexVal = "0" + hexVal;
        }
        
        hex += hexVal;
    }

    return hex;
}

/** Add two numeric arrays of the same length, item-by-item */
function addArrays(arr1: number[], arr2: number[]): number[] {
    let sumArr = [];

    for (let i = 0; i < arr1.length; i++) {
        sumArr[i] = Math.max(0, Math.min(255, arr1[i] + arr2[i]));
    }

    return sumArr;
}

/** Subtract two numeric arrays of the same length, item-by-item */
function subtractArrays(arr1: number[], arr2: number[]): number[] {
    let diffArr = [];

    for (let i = 0; i < arr1.length; i++) {
        diffArr[i] = arr1[i] - arr2[i];
    }

    return diffArr;
}

/** Multiply every element of a numeric array by a scalar */
function scaleArray(arr1: number[], scalar: number): number[] {
    let scaledArr = [];

    for (let i = 0; i < arr1.length; i++) {
        scaledArr[i] = Math.round(arr1[i] * scalar);
    }

    return scaledArr;
}
