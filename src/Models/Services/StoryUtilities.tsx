/**
 * @summary This file contains helper functions for composing Story tests
 */

import React, { CSSProperties } from 'react';
import { screen } from '@storybook/testing-library';
import { ReactFramework, StoryContext } from '@storybook/react';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';

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
    const styles = {
        width: '300px',
        ...cardStyle
    };
    return (Story, context: IStoryContext<T>) => (
        <div style={styles}>
            <BaseComponent
                isLoading={false}
                theme={context.parameters.theme || context.globals.theme}
                locale={context.globals.locale}
                localeStrings={context.globals.locale}
            >
                <Story />
            </BaseComponent>
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

export const clickOverFlowMenuItem = async (element: HTMLElement) => {
    // not using storybook helper to work around issue where pointer events are not allowed
    element.click();
    await sleep(1);
};
