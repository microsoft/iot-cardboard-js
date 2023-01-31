import {
    IPropertyListItemArrayChildStyleProps,
    IPropertyListItemArrayChildStyles
} from './PropertyListItemArrayChild.types';
import { CardboardClassNamePrefix } from '../../../../../../../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-propertylistitemarraychild`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IPropertyListItemArrayChildStyleProps
): IPropertyListItemArrayChildStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
