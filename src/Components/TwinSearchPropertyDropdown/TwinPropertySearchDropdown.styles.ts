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
    description: `${classPrefix}-description`,
    label: `${classPrefix}-label`,
    requiredIcon: `${classPrefix}-requiredIcon`
};

export const getStyles = (
    props: ITwinPropertySearchDropdownStyleProps
): ITwinPropertySearchDropdownStyles => {
    return {
        root: [classNames.root],
        description: [
            classNames.description,
            {
                display: 'block',
                paddingTop: 4
            }
        ],
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
                    width: props.menuWidth
                }
            }
        }
    };
};
