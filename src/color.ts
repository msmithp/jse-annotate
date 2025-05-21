/** color.ts * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Contains functions that pertain to color, such as gradients, color
 * modification, and conversion from RGB to hex
 */


export const GRAY = "#474747";


/**
 * Pick a color from a gradient of many different colors
 * @param colors List of hex codes of colors in the gradient (in order of their
 *               appearance in the gradient)
 * @param pct The percentage, between 0 and 1, between the first color and the
 *            last color from which the color will be drawn
 * @returns A hex code of the color selected from the gradient, with a leading
 *          pound sign (`#`) included
 */
export function polylinearGradient(colors: string[], pct: number): string {
    const threshold = 1 / (colors.length - 1);
    const startIndex = Math.min(Math.floor(pct / threshold), colors.length - 2);
    const endIndex = startIndex + 1;

    return linearGradient(
        colors[startIndex], colors[endIndex], (pct / threshold) - startIndex
    );
}

/**
 * Pick a color some percentage of the way between two colors
 * @param start The starting color of the gradient, as a hex code
 * @param end The ending color of the gradient, as a hex code
 * @param pct The percentage, between 0 and 1, between the two colors at which
 *            the color will be drawn
 * @returns A hex code of the color selected from the gradient, with a leading
 *          pound sign (`#`) included
 */
export function linearGradient(start: string, end: string, pct: number): string {
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
        scaleArray(subtractArrays(endRgb, startRgb), pct)
    );
    
    // Convert RGB back to hex code
    return rgbToHex(vals);
}

/**
 * Convert a hex value string (like `"#F369D2"`) to an array of
 * RGB values (like `[243, 105, 210]`)
 * @param hex A hex code of a color. The leading pound sign (`#`) should be
 *            included.
 * @returns An array of exactly 3 integers, each between 0 and 255,
 *          representing red, green, and blue values, respectively
 */
export function hexToRgb(hex: string): number[] {
    return [
        parseInt(hex.substring(1, 3), 16),
        parseInt(hex.substring(3, 5), 16),
        parseInt(hex.substring(5, 7), 16),
    ];
}

/**
 * Convert an array of RGB values (like `[243, 105, 210]`) to a hex code (like
 * `"#F369D2"`)
 * @param vals An array of exactly 3 integers, each between 0 and 255,
 *             representing red, green, and blue values, respectively
 * @returns A hex code of a color, including a leading pound sign (`#`)
 */
export function rgbToHex(vals: number[]): string {
    let hex = "#";

    for (const val of vals) {
        // Convert value to a hexadecimal string
        let hexVal = val.toString(16);

        if (hexVal.length === 1) {
            // Add leading 0, if necessary
            hexVal = "0" + hexVal;
        }
        
        hex += hexVal;
    }

    return hex;
}

/**
 * Add two numeric arrays of the same length, item-by-item
 * @param arr1 First numeric array
 * @param arr2 Second numeric array
 * @returns Sum array, where each value `z_i` is equal to `x_i` + `y_i`, where
 *          `x_i` and `y_i` come from `arr1` and `arr2` respectively
 */
function addArrays(arr1: number[], arr2: number[]): number[] {
    let sumArr = [];

    for (let i = 0; i < arr1.length; i++) {
        sumArr[i] = Math.max(0, Math.min(255, arr1[i] + arr2[i]));
    }

    return sumArr;
}

/** Subtract two numeric arrays of the same length, item-by-item */

/**
 * Subtract two numeric arrays of the same length, item-by-item
 * @param arr1 First numeric array
 * @param arr2 Second numeric array
 * @returns Difference array, where each `z_i` is equal to `x_i` - `y_i`, where
 *          `x_i` and `y_i` come from `arr1` and `arr2` respectively
 */
function subtractArrays(arr1: number[], arr2: number[]): number[] {
    let diffArr = [];

    for (let i = 0; i < arr1.length; i++) {
        diffArr[i] = arr1[i] - arr2[i];
    }

    return diffArr;
}

/**
 * Multiply every element of a numeric array by a scalar
 * @param arr1 Numeric array
 * @param scalar Scalar quantity by which every number in `arr1` will be
 *               multiplied
 * @returns A scaled array
 */
function scaleArray(arr1: number[], scalar: number): number[] {
    let scaledArr = [];

    for (let i = 0; i < arr1.length; i++) {
        scaledArr[i] = Math.round(arr1[i] * scalar);
    }

    return scaledArr;
}

/**
 * Desaturate a color by a given percentage
 * @param color A hex string, with a leading pound sign (`#`) included
 * @param pct Percentage by which to desaturate the color, with `0` returning
 *            the same color and `1` returning a grayscale color
 * @returns A new hex string for the desaturated color
 */
export function desaturate(color: string, pct: number): string {
    const [r, g, b] = hexToRgb(color);

    const lum = 0.3*r + 0.6*g + 0.1*b;

    const newR = Math.floor(r + pct * (lum - r));
    const newG = Math.floor(g + pct * (lum - g));
    const newB = Math.floor(b + pct * (lum - b));

    return rgbToHex([newR, newG, newB]);
}

/**
 * Lighten a color by a given amount. Negative amounts will darken the color.
 * @param color A hex string, with a leading pound sign (`#`) included
 * @param amt Amount by which to lighten a color
 * @returns A new hex string for the lightened color
 */
export function lighten(color: string, amt: number): string {
    const [r, g, b] = hexToRgb(color);

    let newR = Math.max(0, Math.min(255, r + amt));
    let newG = Math.max(0, Math.min(255, g + amt));
    let newB = Math.max(0, Math.min(255, b + amt));

    return rgbToHex([newR, newG, newB]);
}