import {
    IPropertyListItemObjectChildStyleProps,
    IPropertyListItemObjectChildStyles
} from './PropertyListItemObjectChild.types';
import { CardboardClassNamePrefix } from '../../../../../../../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-propertylistitemobjectchild`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IPropertyListItemObjectChildStyleProps
): IPropertyListItemObjectChildStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
