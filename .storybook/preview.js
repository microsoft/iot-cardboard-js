
import React, { CSSProperties } from 'react';
import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import '../src/Resources/Styles/BaseThemeVars.scss'; // Import BaseThemeVars to access css theme variables
import { Locale } from '../src/Models/Constants/Enums';
import { StableGuidRngProvider } from '../src/Models/Context/StableGuidRngProvider';
import { SearchSpan } from '../src/Models/Classes/SearchSpan';

// global inputs for all stories, but it is not included in args
// so make sure to include second object parameter including 'globals' in your stories to access these inputs: https://storybook.js.org/docs/react/essentials/toolbars-and-globals#globals
export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: 'light',
        toolbar: {
            icon: 'circlehollow',
            items: ['light', 'dark', 'explorer', 'kraken'],
            showName: true,
        }
    },
    locale: {
        name: 'Locale',
        description: 'Internationalization locale',
        defaultValue: Locale.EN,
        toolbar: {
            icon: 'globe',
            items: [
                { value: Locale.EN, right: 'US', title: 'English' },
                { value: Locale.DE, right: 'DE', title: 'German' }
            ],
            showName: true,
        }
    }
};

// Parameters are Storybook’s method of defining static metadata for stories
// https://storybook.js.org/docs/react/writing-stories/introduction#using-parameters
export const parameters = {
    mockedSearchSpan: new SearchSpan(
        new Date(1617260400000),
        new Date(1617260500000),
        '100ms'
    ),
    defaultCardWrapperStyle: { width: '400px', height: '400px' },
    wideCardWrapperStyle: {
        height: '400px',
        width: '720px'
    }
};

// Wrap stories with stable GUID provider
const decoratorWithStableGuid = (Story, context) => {
    return (
        <StableGuidRngProvider seed={context.id}>
            <Story {...context} />
        </StableGuidRngProvider>
    );
};

// to exclude warning messages from console logs in Actions panel
const panelExclude = setConsoleOptions({}).panelExclude;
setConsoleOptions({
    panelExclude: [...panelExclude, /Warning/]
});

//add decorators here
const decoratorWithConsole = (storyFn, context) => withConsole()(storyFn)(context);
const decoratorWithWrapper = (Story, context) => {
    let background = '';
    // based on var(--cb-color-bg-canvas)
    // can't use themes here since we are above the theme in the DOM
    switch (context.globals.theme) {
        case 'light':
            background = '#fff';
            break;
        case 'dark':
            background = '#0d0f0e';
            break;
        case 'explorer':
            background = '#222';
            break;
        case 'kraken':
            background = '#0d1326';
            break;
        default:
            background = '';
            break;
    }
    return (
        <div style={{ padding: 8, backgroundColor: background }}>
            <Story {...context} />
        </div >
    )
};
export const decorators = [
    decoratorWithConsole,
    decoratorWithStableGuid,
    decoratorWithWrapper
];