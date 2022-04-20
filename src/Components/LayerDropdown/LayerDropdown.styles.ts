import {
    IButtonStyles,
    IDropdownStyles,
    IIconStyles,
    ITheme,
    memoizeFunction
} from '@fluentui/react';

export const defaultLayerButtonStyles: Partial<IButtonStyles> = {
    root: { width: '100%', padding: '0px 8px 0px 6px' }
};

export const dropdownStyles: Partial<IDropdownStyles> = {
    root: { width: 240 }
};

export const iconStyles: Partial<IIconStyles> = {
    root: { marginRight: 8 }
};

export const getEyeIconStyles = memoizeFunction(
    (theme: ITheme): Partial<IIconStyles> => ({
        root: {
            color: theme.palette.black
        }
    })
);
