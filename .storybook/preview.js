import { Suspense } from 'react';
import { addDecorator } from '@storybook/react';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import { ThemeProvider } from '../src/Theming/ThemeProvider';
import I18nProviderWrapper from '../src/Models/Classes/I18NProviderWrapper';
import i18n from '../i18n';
import '../src/Resources/Styles/BaseThemeVars.scss'; // Import BaseThemeVars to access css theme variables

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

// here app catches the suspense from page in case translations are not yet loaded
const withI18n = (Story, context) => (
    <Suspense fallback={'Loading i18n...'}>
        <I18nProviderWrapper locale={context.globals.locale} i18n={i18n}>
            <Story {...context} />
        </I18nProviderWrapper>
    </Suspense>
);

//add decorators here
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withI18n);
