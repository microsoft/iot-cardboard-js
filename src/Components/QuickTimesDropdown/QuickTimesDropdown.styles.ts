import {
    IQuickTimesDropdownStyleProps,
    IQuickTimesDropdownStyles
} from './QuickTimesDropdown.types';

export const classPrefix = 'cb-quicktimesdropdown';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IQuickTimesDropdownStyleProps
): IQuickTimesDropdownStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
