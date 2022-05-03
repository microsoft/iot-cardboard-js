import {
    memoizeFunction,
    mergeStyleSets,
    IStyle,
    IIconStyles,
    IDropdownStyles
} from '@fluentui/react';

export const modelledPropertyBuilderClassPrefix = 'cb-modelledpropertybuilder';

const classNames = {
    toggleContainer: `${modelledPropertyBuilderClassPrefix}-toggle-container`,
    dropdownTitleText: `${modelledPropertyBuilderClassPrefix}-dropdown-title-text`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        toggleContainer: [
            classNames.toggleContainer,
            {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            } as IStyle
        ],
        dropdownTitleText: [
            classNames.dropdownTitleText,
            {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            } as IStyle
        ]
    });
});

export const dropdownIconStyles: Partial<IIconStyles> = {
    root: { marginRight: 8 }
};

export const dropdownStyles: Partial<IDropdownStyles> = {
    title: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%'
    }
};
