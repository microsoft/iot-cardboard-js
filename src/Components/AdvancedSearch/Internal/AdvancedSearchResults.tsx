import React from 'react';
import {
    IAdvancedSearchResultsProps,
    IAdvancedSearchResultsStyleProps,
    IAdvancedSearchResultsStyles
} from '../AdvancedSearch.types';
import { getStyles } from '../AdvancedSearch.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';

const getClassNames = classNamesFunction<
    IAdvancedSearchResultsStyleProps,
    IAdvancedSearchResultsStyles
>();

const AdvancedSearchResults: React.FC<IAdvancedSearchResultsProps> = (
    props
) => {
    const { styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            {/* TODO: Replace this with results details list */}
            Results details list
        </div>
    );
};

export default styled<
    IAdvancedSearchResultsProps,
    IAdvancedSearchResultsStyleProps,
    IAdvancedSearchResultsStyles
>(AdvancedSearchResults, getStyles);
