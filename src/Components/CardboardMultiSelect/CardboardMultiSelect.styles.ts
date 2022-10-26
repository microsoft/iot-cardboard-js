import {
    ICardboardMultiSelectStyleProps,
    ICardboardMultiSelectStyles
} from './CardboardMultiSelect.types';

export const classPrefix = 'cb-cardboardmultiselect';
const classNames = {
    root: `${classPrefix}-root`,
    input: `${classPrefix}-input`
};
export const getStyles = (
    _props: ICardboardMultiSelectStyleProps
): ICardboardMultiSelectStyles => {
    return {
        root: [classNames.root],
        input: [classNames.input],
        subComponentStyles: {}
    };
};
