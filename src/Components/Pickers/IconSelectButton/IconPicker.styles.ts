import { IIconPickerStyleProps, IIconPickerStyles } from './IconPicker.types';

export const getStyles = (props: IIconPickerStyleProps): IIconPickerStyles => {
    const { theme, isItemSelected } = props;
    return {
        subComponentStyles: {
            button: {
                root: [
                    {
                        color: `${theme.semanticColors.bodyText} !important`,
                        border: `1px solid ${theme.semanticColors.inputBorder}`,
                        borderRadius: '50%',
                        // :after selector required to make border round on focus state.
                        ':after': {
                            borderRadius: '50%'
                        }
                    },
                    isItemSelected && {
                        borderWidth: 3
                    }
                ],
                rootHovered: {
                    borderColor: `${theme.semanticColors.inputBorderHovered}`
                }
            },
            callout: {
                calloutMain: {
                    // there is no good class to grab here
                    '& td': {
                        padding: 4
                    }
                }
            }
        }
    };
};
