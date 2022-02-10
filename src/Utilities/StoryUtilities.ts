/**
 * @summary This file contains helper functions for composing Story tests
 */

/**
 * Function to wait for a period of time and resolves when that time has ellapsed
 * @param ms number of milliseconds to wait
 * @returns a promise that resolves after x milliseconds
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Function to wait for a period of time and resolves when that time has ellapsed
 * @param ms number of milliseconds to wait
 * @returns a promise that resolves after x milliseconds
 */
export async function waitForFirstRender() {
    return sleep(1);
}
