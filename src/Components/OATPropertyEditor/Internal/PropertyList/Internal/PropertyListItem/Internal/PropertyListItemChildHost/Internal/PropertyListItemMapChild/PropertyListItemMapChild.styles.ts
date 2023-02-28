import {
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
} from './PropertyListItemMapChild.types';
import { CardboardClassNamePrefix } from '../../../../../../../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-propertylistitemmapchild`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IPropertyListItemMapChildStyleProps
): IPropertyListItemMapChildStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
