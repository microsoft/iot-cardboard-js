import {
    IDatabasePickerStyleProps,
    IDatabasePickerStyles
} from './DatabasePicker.types';
import { CardboardClassNamePrefix } from '../../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-DatabasePicker`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const DatabasePicker_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IDatabasePickerStyleProps
): IDatabasePickerStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
