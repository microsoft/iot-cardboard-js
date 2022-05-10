import {
    ISimpleCalloutStyleProps,
    ISimpleCalloutStyles
} from './SimpleCallout.types';

export const classPrefix = 'cb-SimpleCallout';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ISimpleCalloutStyleProps
): ISimpleCalloutStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
