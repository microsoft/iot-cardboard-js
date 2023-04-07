import { IFlowPickerStyleProps, IFlowPickerStyles } from './FlowPicker.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-flowpicker`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const FLOWPICKER_CLASS_NAMES = classNames;
export const getStyles = (_props: IFlowPickerStyleProps): IFlowPickerStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
