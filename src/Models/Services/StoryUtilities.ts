/**
 * @summary This file contains helper functions for composing Story tests
 */

import { screen } from '@storybook/testing-library';

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

export const findOverflowMenuItem = async (testId: string) => {
    return await screen.findByTestId(testId);
};

export const findDialogMenuItem = async (testId: string) => {
    return await findOverflowMenuItem(testId);
};

export const clickOverFlowMenuItem = async (element: HTMLElement) => {
    // not using storybook helper to work around issue where pointer events are not allowed
    element.click();
    await sleep(1);
};
