import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import I18nProviderWrapper from '../src/Models/Classes/I18NProviderWrapper';
import '../src/Resources/Styles/BaseThemeVars.scss'; // Import BaseThemeVars to access css theme variables
import i18n from '../src/i18n';

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
        defaultValue: 'en',
        toolbar: {
            icon: 'globe',
            items: [
                { value: 'en', right: 'US', title: 'English' },
                { value: 'de', right: 'DE', title: 'German' }
            ]
        }
    }
};

// to exclude warning messages from console logs in Actions panel
const panelExclude = setConsoleOptions({}).panelExclude;
setConsoleOptions({
    panelExclude: [...panelExclude, /Warning/]
});

const withI18n = (Story, context) => (
    <I18nProviderWrapper locale={context.globals.locale} i18n={i18n}>
        <Story {...context} />
    </I18nProviderWrapper>
);

//add decorators here
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withI18n);
