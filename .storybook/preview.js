import React, { CSSProperties } from 'react';
import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import '../src/Resources/Styles/BaseThemeVars.scss'; // Import BaseThemeVars to access css theme variables
import { Locale } from '../src/Models/Constants/Enums';
import { StableGuidRngProvider } from '../src/Models/Context/StableGuidRngProvider';
import { LoggingContextProvider } from '../src/Models/Context/LoggingContextProvider';
import { SearchSpan } from '../src/Models/Classes/SearchSpan';

// global inputs for all stories, but it is not included in args
// so make sure to include second object parameter including 'globals' in your stories to access these inputs: https://storybook.js.org/docs/react/essentials/toolbars-and-globals#globals
export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: 'kraken',
        toolbar: {
            icon: 'circlehollow',
            items: ['light', 'dark', 'explorer', 'kraken'],
            showName: true
        }
    },
    locale: {
        name: 'Locale',
        description: 'Internationalization locale',
        defaultValue: Locale.EN,
        toolbar: {
            icon: 'globe',
            items: [
                { value: Locale.CS, right: 'CS', title: 'Čeština' },
                { value: Locale.DE, right: 'DE', title: 'Deutsch' },
                { value: Locale.EN, right: 'EN', title: 'English' },
                { value: Locale.ES, right: 'ES', title: 'Español' },
                { value: Locale.FR, right: 'FR', title: 'Français' },
                { value: Locale.HU, right: 'HU', title: 'Magyar' },
                { value: Locale.IT, right: 'IT', title: 'Italiano' },
                { value: Locale.JA, right: 'JA', title: '日本語' },
                { value: Locale.KO, right: 'KO', title: '한국어' },
                { value: Locale.NL, right: 'NL', title: 'Nederlands' },
                { value: Locale.PL, right: 'PL', title: 'Polski' },
                { value: Locale.PT, right: 'PT', title: 'Português' },
                { value: Locale.RU, right: 'RU', title: 'Русский' },
                { value: Locale.SV, right: 'SV', title: 'Svenska' },
                { value: Locale.TR, right: 'TR', title: 'Türkçe' },
                { value: Locale.ZH, right: 'ZH', title: 'Chinese' }
            ],
            showName: true
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
    },
    options: {
        // Adds storybook sorting to make finding stories easier :)
        storySort: {
            order: ['Pages', 'Components', 'Components - OAT', 'Contexts', '3DV', 'Test Stories'],
            method: 'Alphabetical'
        }
    },
    layout: 'fullscreen'
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
const decoratorWithConsole = (storyFn, context) =>
    withConsole()(storyFn)(context);
const decoratorWithWrapper = (Story, context) => {
    if (context.parameters.noGlobalWrapper) {
        return <Story {...context} />;
    }

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
            background = '#16203c';
            break;
        default:
            background = '';
            break;
    }
    return (
        <div style={{ backgroundColor: background }}>
            <Story {...context} />
        </div>
    );
};
const decoratorWithDebug = (Story, context) => {
    return (
        <LoggingContextProvider>
            <Story {...context} />
        </LoggingContextProvider>
    );
};

addDecorator(decoratorWithConsole);
addDecorator(decoratorWithStableGuid);
addDecorator(decoratorWithWrapper);
addDecorator(decoratorWithDebug);
