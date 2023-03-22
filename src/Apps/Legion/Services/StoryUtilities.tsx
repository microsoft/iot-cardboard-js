/**
 * @summary This file contains helper functions for composing Story tests
 */

import React, { CSSProperties } from 'react';
import { fireEvent, screen } from '@storybook/testing-library';
import { ReactFramework, StoryContext } from '@storybook/react';

/**
 * Context passed into the story decorator.
 * <T> is the type for the props of the component
 */
export type IStoryContext<T> = StoryContext<
    ReactFramework,
    T & {
        children?: React.ReactNode;
    }
>;

/**
 * Gets a decorator that wraps the story with the global theme & localization controls
 * <T> is the type for the props of the component
 * @param cardStyle Styles for the wrapping component around the story control
 * @returns Decorator for the story to wrap the control being tested.
 */
export function getDefaultStoryDecorator<T>(cardStyle: CSSProperties) {
    const styles: CSSProperties = {
        width: '300px',
        overflowY: 'auto',
        ...cardStyle
    };
    return (Story) => (
        <div style={styles}>
            <Story />
        </div>
    );
}

/**
 * Function to wait for a period of time and resolves when that time has ellapsed
 * @param ms number of milliseconds to wait
 * @returns a promise that resolves after x milliseconds
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/** waits for a set amount of time for animations to complete */
export async function waitForAnimations() {
    await sleep(20);
}

/**
 * Function to wait for a period of time and resolves when that time has ellapsed
 * @param ms number of milliseconds to wait
 * @returns a promise that resolves after x milliseconds
 */
export async function waitForFirstRender() {
    return sleep(1);
}

export const findCalloutItemByTestId = async (testId: string) => {
    return await screen.findByTestId(testId);
};

export const findAllCalloutItemsByTestId = async (testId: string) => {
    return await screen.findAllByTestId(testId);
};

export const findOverflowMenuItem = async (testId: string) => {
    return await screen.findByTestId(testId);
};

export const findDialogMenuItem = async (testId: string) => {
    return await findOverflowMenuItem(testId);
};

interface IStorybookCanvas {
    findByTestId: (testId: string) => Promise<HTMLElement>;
}

/**
 * Opens a dropdown menu
 * @param canvas current test canvas
 * @param testId data-testid of the dropdown menu
 */
export const openDropdownMenu = async (
    canvas: IStorybookCanvas,
    testId: string
) => {
    const dropdown = await canvas.findByTestId(testId);
    const item = document.getElementById(dropdown.id);
    item.click();
};

/**
 * Opens a dropdown menu and selects an item from the list
 * @param canvas current test canvas
 * @param dropdownTestId data-testid of the dropdown menu
 * @param optionIndex index of the option in the list to select
 */
export const selectDropDownMenuItem = async (
    canvas: IStorybookCanvas,
    dropdownTestId: string,
    optionIndex: number
) => {
    await openDropdownMenu(canvas, dropdownTestId);
    const options = await screen.findAllByRole('option');
    options[optionIndex].click();
};

/**
 * Click on a menu item in a context menu
 * @param canvas the test canvas
 * @param testId test id for the element
 */
export const clickContextMenuItem = async (testId: string) => {
    // not using storybook helper to work around issue where pointer events are not allowed
    const dropdown = await findCalloutItemByTestId(testId);
    const item = document.getElementById(dropdown.id);
    if (!item) {
        console.error(
            '[TEST FAILURE] Did not find an element with id ' + dropdown?.id
        );
    } else {
        item.click();
    }
};

export const clickOverFlowMenuItem = async (element: HTMLElement) => {
    // not using storybook helper to work around issue where pointer events are not allowed
    element.click();
    await sleep(1);
};

/** React-select utilities */
/**
 * Helper function to select an option from a react select dropdown. Classname and classname prefix
 * need to match the ones set in props for your component.
 * @param className Classname prop from react-select dropdown we want to interact with
 * @param optionIndex index of the option we are selecting.
 * @returns
 */
export const selectReactSelectOption = async (
    className: string,
    optionIndex: number
) => {
    fireEvent.focus(document.getElementsByClassName(`${className}__input`)[0]);
    fireEvent.mouseDown(
        document.getElementsByClassName(`${className}__control`)[0]
    );
    // Wait for callout to pop-up
    await sleep(1);
    fireEvent.click(
        document.getElementsByClassName(`${className}__option`)[optionIndex]
    );
};
