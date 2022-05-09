import {
    memoizeFunction,
    mergeStyleSets,
    IStyle,
    IIconStyles,
    IDropdownStyles,
    IChoiceGroupStyles,
    IChoiceGroupOptionStyles,
    FontWeights,
    FontSizes,
    ILabelStyles
} from '@fluentui/react';

export const modelledPropertyBuilderClassPrefix = 'cb-modelledpropertybuilder';

const classNames = {
    radioContainer: `${modelledPropertyBuilderClassPrefix}-radio-container`,
    dropdownTitleText: `${modelledPropertyBuilderClassPrefix}-dropdown-title-text`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        radioContainer: [
            classNames.radioContainer,
            {
                display: 'flex',
                justifyContent: 'flex-start',
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

export const choiceGroupStyles: Partial<IChoiceGroupStyles> = {
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 4
    }
};

export const choiceGroupOptionStyles: Partial<IChoiceGroupOptionStyles> = {
    root: {
        marginRight: 16,
        marginTop: 0
    }
};

export const propertyExpressionLabelStyles: Partial<ILabelStyles> = {
    root: {
        fontWeight: FontWeights.semibold,
        fontSize: FontSizes.size14,
        paddingBottom: 0
    }
};
