import {
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
} from './AdvancedSearchResultDetailsList.types';

export const classPrefix = 'cb-advancedsearchresultdetailslist';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IAdvancedSearchResultDetailsListStyleProps
): IAdvancedSearchResultDetailsListStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
