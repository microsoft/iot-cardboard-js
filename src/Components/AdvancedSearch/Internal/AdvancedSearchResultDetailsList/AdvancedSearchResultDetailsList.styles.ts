import {
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
} from './AdvancedSearchResultDetailsList.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-advancedsearchresultdetailslist`;
const classNames = {
    root: `${classPrefix}-root`,
    listHeader: `${classPrefix}-headerCorrection`,
    listHeaderAndIcon: `${classPrefix}-listHeaderAndIcon`
};
export const getStyles = (
    _props: IAdvancedSearchResultDetailsListStyleProps
): IAdvancedSearchResultDetailsListStyles => {
    return {
        root: [classNames.root],
        listHeader: [
            classNames.listHeader,
            {
                margin: 0,
                paddingLeft: 16
            }
        ],
        listHeaderAndIcon: [
            classNames.listHeaderAndIcon,
            {
                display: 'flex',
                displayDirection: 'row',
                justifyContent: 'space-between'
            }
        ],
        subComponentStyles: {
            propertyInspector: {
                root: {
                    marginTop: -6,
                    marginBottom: -8
                }
            },
            spinner: {
                root: {
                    height: 40
                }
            }
        }
    };
};
