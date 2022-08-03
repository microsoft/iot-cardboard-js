import React from 'react';
import {
    IQueryBuilderProps,
    IQueryBuilderStyleProps,
    IQueryBuilderStyles
} from '../AdvancedSearch.types';
import { getStyles } from '../AdvancedSearch.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';

const getClassNames = classNamesFunction<
    IQueryBuilderStyleProps,
    IQueryBuilderStyles
>();

const QueryBuilder: React.FC<IQueryBuilderProps> = (props) => {
    const { styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            {/* TODO: Replace this with query builder container */}
            Query fields container
        </div>
    );
};

export default styled<
    IQueryBuilderProps,
    IQueryBuilderStyleProps,
    IQueryBuilderStyles
>(QueryBuilder, getStyles);
