import {
    IPropertyInspectorCalloutStyleProps,
    IPropertyInspectorCalloutStyles
} from './PropertyInspectorCallout.types';

export const classPrefix = 'cb-propertyinspectorcallout';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IPropertyInspectorCalloutStyleProps
): IPropertyInspectorCalloutStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
