import {
    ISimpleCalloutStyleProps,
    ISimpleCalloutStyles
} from './SimpleCallout.types';

export const classPrefix = 'cb-simple-flyout';
const classNames = {
    root: `${classPrefix}-root`,
    confirmationMessage: `${classPrefix}-confirmation-message`
};
export const getStyles = (
    _props: ISimpleCalloutStyleProps
): ISimpleCalloutStyles => {
    return {
        root: [classNames.root],
        message: [classNames.confirmationMessage],
        subComponentStyles: {}
    };
};
