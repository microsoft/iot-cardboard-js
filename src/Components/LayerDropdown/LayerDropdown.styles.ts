import {
    IButtonStyles,
    IDropdownStyles,
    IIconStyles,
    IStyle,
    ITheme,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';
import { HEADER_BUTTON_HEIGHT } from '../../Models/Constants/StyleConstants';

export const layerDropdownClassPrefix = 'cb-layer-dropdown';

const classNames = {
    titleText: `${layerDropdownClassPrefix}-title-text`,
    placeHolderContainer: `${layerDropdownClassPrefix}-placeholder-container`
};

export const defaultLayerButtonStyles: Partial<IButtonStyles> = {
    root: { width: '100%', padding: '0px 8px 0px 6px' }
};

export const getDropdownStyles = memoizeFunction(
    (theme: ITheme, isDisabled: boolean): Partial<IDropdownStyles> => ({
        root: { width: 240 },
        title: {
            alignItems: 'center',
            border: `1px solid ${theme.palette.neutralLight}`,
            display: 'inline-flex',
            height: '100%',
            width: '100%'
        },
        caretDownWrapper: {
            alignItems: 'center',
            display: 'flex',
            height: '100%'
        },
        dropdown: {
            height: HEADER_BUTTON_HEIGHT,
            // fluent has a jank style on their side so we get a jank one on ours too
            ':hover .ms-Dropdown-title': isDisabled && {
                borderColor: theme.palette.neutralSecondary
            }
        }
    })
);

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
