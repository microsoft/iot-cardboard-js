import {
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
} from './AdvancedSearchResultDetailsList.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-advancedsearchresultdetailslist`;
const classNames = {
    root: `${classPrefix}-root`,
    listHeaderCorrection: `${classPrefix}-headerCorrection`
};
export const getStyles = (
    _props: IAdvancedSearchResultDetailsListStyleProps
): IAdvancedSearchResultDetailsListStyles => {
    return {
        root: [classNames.root],
        listHeaderCorrection: [
            classNames.listHeaderCorrection,
            {
                margin: 0
            }
        ],
        subComponentStyles: {
            propertyInspector: {
                root: {
                    marginTop: -6,
                    marginBottom: -8
                }
            }
        }
    };
};
