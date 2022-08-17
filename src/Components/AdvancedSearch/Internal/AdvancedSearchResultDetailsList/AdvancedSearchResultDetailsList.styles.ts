import {
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
} from './AdvancedSearchResultDetailsList.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-advancedsearchresultdetailslist`;
const classNames = {
    root: `${classPrefix}-root`,
    propertyIcon: `${classPrefix}- propertyIcon`
};
export const getStyles = (
    _props: IAdvancedSearchResultDetailsListStyleProps
): IAdvancedSearchResultDetailsListStyles => {
    return {
        root: [classNames.root],
        propertyIcon: [
            classNames.propertyIcon,
            {
                textAlign: 'center'
            }
        ]
    };
};
