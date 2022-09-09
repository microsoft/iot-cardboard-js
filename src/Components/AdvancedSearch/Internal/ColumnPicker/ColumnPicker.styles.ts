import {
    IColumnPickerStyleProps,
    IColumnPickerStyles
} from './ColumnPicker.types';

export const classPrefix = 'cb-columnpicker';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IColumnPickerStyleProps
): IColumnPickerStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            icon: {
                root: {
                    paddingRight: 8
                }
            }
        }
    };
};
