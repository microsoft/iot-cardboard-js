import {
    IClusterPickerStyleProps,
    IClusterPickerStyles
} from './ClusterPicker.types';
import { CardboardClassNamePrefix } from '../../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-clusterpicker`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const CLUSTERPICKER_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IClusterPickerStyleProps
): IClusterPickerStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
