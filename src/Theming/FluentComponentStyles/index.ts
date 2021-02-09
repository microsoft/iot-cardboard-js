import { ITheme } from '@fluentui/react';
import { Theme } from '../../Constants/Enums';
import { getPrimaryButtonStyles } from './PrimaryButton.styles';

/* 
    Constructs a strongly typed theme override object for each 
    custom-styled Fluent Component.  If styling a new component, 
    add a ComponentName.styles.ts file in the ComponentStyles/ folder.
*/
export const getCustomComponentStyles = (
    themeSetting: Theme,
    theme: ITheme
) => ({
    PrimaryButton: {
        styles: getPrimaryButtonStyles(themeSetting, theme)
    }
});
