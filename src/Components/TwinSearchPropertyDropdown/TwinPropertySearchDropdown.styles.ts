import {
    ITwinPropertySearchDropdownStyleProps,
    ITwinPropertySearchDropdownStyles
} from './TwinPropertySearchDropdown.types';

/**
 * Twin search dropdown styles
 */
export const classPrefix = 'cb-twin-search-dropdown';
const classNames = {
    root: `${classPrefix}-root`,
    label: `${classPrefix}-label`,
    requiredIcon: `${classPrefix}-requiredIcon`
};

export const getStyles = (
    props: ITwinPropertySearchDropdownStyleProps
): ITwinPropertySearchDropdownStyles => {
    const { theme } = props;
    return {
        root: [classNames.root],
        label: [classNames.label, { alignItems: 'center', display: 'flex' }],
        requiredIcon: [
            classNames.requiredIcon,
            {
                '::after': {
                    color: 'var(--cb-color-text-error)',
                    content: '*',
                    padding: '0 4px'
                }
            }
        ],
        subComponentStyles: {
            callout: {
                root: {
                    backgroundColor: theme.semanticColors.inputBackground,
                    boxShadow: theme.effects.elevation16,
                    width: props.menuWidth
                }
            }
        }
    };
};
