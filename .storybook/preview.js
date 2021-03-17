import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import '../src/Resources/Styles/BaseThemeVars.scss'; // Import BaseThemeVars to access css theme variables
import { Locale } from '../src/Models/Constants/Enums';

// global inputs for all stories, but it is not included in args
// so make sure to include second object parameter including 'globals' in your stories to access these inputs: https://storybook.js.org/docs/react/essentials/toolbars-and-globals#globals
export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: 'light',
        toolbar: {
            icon: 'circlehollow',
            items: ['light', 'dark']
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
            ]
        }
    }
};

// to exclude warning messages from console logs in Actions panel
const panelExclude = setConsoleOptions({}).panelExclude;
setConsoleOptions({
    panelExclude: [...panelExclude, /Warning/]
});

//add decorators here
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
