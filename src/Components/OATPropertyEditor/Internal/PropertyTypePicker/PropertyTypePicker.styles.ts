import {
    IPropertyTypePickerStyleProps,
    IPropertyTypePickerStyles
} from './PropertyTypePicker.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-propertytypepicker`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: IPropertyTypePickerStyleProps
): IPropertyTypePickerStyles => {
    const { theme } = props;
    return {
        root: [classNames.root],
        subComponentStyles: {
            dropdown: {
                root: {
                    width: 'fit-content',
                    '.ms-Dropdown-title': {
                        color: `${theme.semanticColors.link} !important`,
                        display: 'flex',
                        alignItems: 'center',
                        padding: 8,
                        background: 'transparent',
                        ':hover': {
                            backgroundColor:
                                theme.semanticColors.buttonBackgroundHovered
                        },
                        ':not(:focus)': {
                            borderColor: 'transparent'
                        },
                        '.ms-Dropdown::after': {
                            borderWidth: 1,
                            borderColor: theme.semanticColors.focusBorder
                        }
                    }
                }
            }
        }
    };
};
