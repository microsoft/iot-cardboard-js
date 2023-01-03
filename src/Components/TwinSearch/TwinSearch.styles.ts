import { ITwinSearchStyleProps, ITwinSearchStyles } from './TwinSearch.types';

export const getStyles = (props: ITwinSearchStyleProps): ITwinSearchStyles => {
    const { theme } = props;

    return {
        subComponentStyles: {
            propertyInspector: {
                subComponentStyles: {
                    button: {
                        root: {
                            marginTop: '34px', // Needed to align button to dropdown
                            color: theme.semanticColors.buttonText,
                            border: `1px solid ${theme.semanticColors.inputBorder}`
                        }
                    }
                }
            },
            advancedSearchButton: {
                root: {
                    marginTop: '34px', // Needed to align button to dropdown
                    color: theme.semanticColors.buttonText,
                    border: `1px solid ${theme.semanticColors.inputBorder}`
                }
            }
        }
    };
};
