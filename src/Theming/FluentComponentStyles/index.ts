import { ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';
import { getDropdownStyles } from './Dropdown.styles';
import { getPivotStyles } from './Pivot.styles';
import { getPrimaryButtonStyles } from './PrimaryButton.styles';
import { getSeparatorStyles } from './Separator.styles';
import { getSpinButtonStyles } from './SpinButton.styles';
import { getTextFieldStyles } from './TextField.styles';
import { getToggleStyles } from './Toggle.styles';

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
    },
    TextField: {
        styles: getTextFieldStyles(themeSetting, theme)
    },
    Toggle: {
        styles: getToggleStyles(themeSetting, theme)
    },
    Dropdown: {
        styles: getDropdownStyles(themeSetting, theme)
    },
    Separator: {
        styles: getSeparatorStyles(themeSetting, theme)
    },
    SpinButton: {
        styles: getSpinButtonStyles(themeSetting, theme)
    },
    Pivot: {
        styles: getPivotStyles(themeSetting, theme)
    }
});
