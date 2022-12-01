import {
    IPropertyListStyleProps,
    IPropertyListStyles
} from './PropertyList.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-propertylist`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IPropertyListStyleProps
): IPropertyListStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
