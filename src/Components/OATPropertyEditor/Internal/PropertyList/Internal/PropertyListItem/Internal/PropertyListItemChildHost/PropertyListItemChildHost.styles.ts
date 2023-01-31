import {
    IPropertyListItemChildHostStyleProps,
    IPropertyListItemChildHostStyles
} from './PropertyListItemChildHost.types';
import { CardboardClassNamePrefix } from '../../../../../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-propertylistitemchildhost`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IPropertyListItemChildHostStyleProps
): IPropertyListItemChildHostStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
