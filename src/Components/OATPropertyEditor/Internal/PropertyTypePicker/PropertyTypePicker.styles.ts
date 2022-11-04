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
    _props: IPropertyTypePickerStyleProps
): IPropertyTypePickerStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
