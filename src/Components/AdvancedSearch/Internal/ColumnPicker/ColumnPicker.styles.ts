import {
    IColumnPickerStyleProps,
    IColumnPickerStyles
} from './ColumnPicker.types';

export const classPrefix = 'cb-columnpicker';
const classNames = {
    root: `${classPrefix}-root`,
    dropdownTitle: `${classPrefix}-dropdownTitle`
};
export const getStyles = (
    _props: IColumnPickerStyleProps
): IColumnPickerStyles => {
    return {
        root: [classNames.root],
        dropdownTitle: [
            classNames.dropdownTitle,
            { display: 'flex', alignItems: 'flex-start' }
        ],
        subComponentStyles: {
            icon: {
                root: {
                    paddingRight: 8
                }
            }
        }
    };
};
