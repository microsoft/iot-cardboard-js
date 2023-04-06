import {
    IFlowPickerPageStyleProps,
    IFlowPickerPageStyles
} from './FlowPickerPage.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-FlowPickerPage`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const FlowPickerPage_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IFlowPickerPageStyleProps
): IFlowPickerPageStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
