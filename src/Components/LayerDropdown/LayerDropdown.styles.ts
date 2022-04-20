import {
    IButtonStyles,
    IDropdownStyles,
    IIconStyles,
    IStyle,
    ITheme,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';

export const layerDropdownClassPrefix = 'cb-layer-dropdown';

const classNames = {
    titleText: `${layerDropdownClassPrefix}-title-text`,
    placeHolderContainer: `${layerDropdownClassPrefix}-placeholder-container`
};

export const defaultLayerButtonStyles: Partial<IButtonStyles> = {
    root: { width: '100%', padding: '0px 8px 0px 6px' }
};

export const dropdownStyles: Partial<IDropdownStyles> = {
    root: { width: 240 },
    title: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%'
    }
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        titleText: [
            classNames.titleText,
            {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            } as IStyle
        ],
        placeHolderContainer: [
            classNames.placeHolderContainer,
            {
                display: 'inline-flex',
                alignItems: 'center',
                width: '100%'
            } as IStyle
        ]
    });
});

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
