import {
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
} from './PropertyListItemEnumChild.types';
import { CardboardClassNamePrefix } from '../../../../../../../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-propertylistitemenumchild`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IPropertyListItemEnumChildStyleProps
): IPropertyListItemEnumChildStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
