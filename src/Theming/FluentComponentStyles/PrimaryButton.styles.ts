import { IButtonStyles, ITheme } from '@fluentui/react';
import { Theme } from '../../Models/Constants/Enums';

// Overrides PrimaryButton styles
export const getPrimaryButtonStyles = (
    themeSetting: Theme,
    theme: ITheme
): Partial<IButtonStyles> => {
    // Adds box shadow on light theme

    const customOverrides = {
        boxShadow:
            themeSetting === Theme.Light
                ? `0 1px 3px 0 rgba(0, 0, 0, .12)`
                : '0 1px 3px 0 rgba(255,255,255,.12)',
        primaryButtonTextColor:
            themeSetting === Theme.Kraken ? theme.palette.white : '#F2F3F4',
        primaryButtonTextColorDisabled:
            themeSetting === Theme.Kraken ? theme.palette.white : '#F2F3F4'
    };

    return {
        root: {
            boxShadow: customOverrides.boxShadow,
            color: customOverrides.primaryButtonTextColor
        },
        rootHovered: {
            color: customOverrides.primaryButtonTextColor
        },
        rootPressed: {
            color: customOverrides.primaryButtonTextColor
        },
        rootDisabled: {
            color: customOverrides.primaryButtonTextColorDisabled
        }
    };
};
