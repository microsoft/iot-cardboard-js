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
    ILabelStyles,
    IButtonStyles,
    Theme
} from '@fluentui/react';

export const modelledPropertyBuilderClassPrefix = 'cb-modelledpropertybuilder';

const classNames = {
    toggleContainer: `${modelledPropertyBuilderClassPrefix}-toggle-container`,
    dropdownTitleText: `${modelledPropertyBuilderClassPrefix}-dropdown-title-text`,
    loadingSpinnerContainer: `${modelledPropertyBuilderClassPrefix}-loading-spinner-container`,
    labelContainer: `${modelledPropertyBuilderClassPrefix}-label-container`,
    root: `${modelledPropertyBuilderClassPrefix}-root`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        toggleContainer: [
            classNames.toggleContainer,
            {
                display: 'flex',
                justifyContent: 'space-between',
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
        ],
        loadingSpinnerContainer: [
            classNames.loadingSpinnerContainer,
            {
                width: 24,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            } as IStyle
        ],
        labelContainer: [
            classNames.labelContainer,
            {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            } as IStyle
        ],
        root: [
            classNames.root,
            {
                paddingTop: 4
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
        paddingBottom: 0,
        paddingTop: 5
    }
};

export const getClearButtonStyles = memoizeFunction(
    (theme: Theme, isTooltipVisible: boolean): Partial<IButtonStyles> => ({
        root: {
            color: theme.palette.themePrimary,
            fontWeight: FontWeights.semibold,
            textDecoration: 'underline',
            fontSize: FontSizes.size14,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: isTooltipVisible ? 0 : 5,
            border: 'none',
            height: 'auto'
        },
        label: {
            margin: 0
        }
    })
);
