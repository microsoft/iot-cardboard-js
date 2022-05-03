import {
    memoizeFunction,
    mergeStyleSets,
    IStyle,
    IIconStyles
} from '@fluentui/react';

export const modelledPropertyBuilderClassPrefix = 'cb-modelledpropertybuilder';

const classNames = {
    toggleContainer: `${modelledPropertyBuilderClassPrefix}-toggle-container`
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
        ]
    });
});

export const dropdownIconStyles: Partial<IIconStyles> = {
    root: { marginRight: 8 }
};
