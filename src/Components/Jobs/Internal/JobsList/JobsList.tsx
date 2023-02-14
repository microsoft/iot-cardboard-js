import React from 'react';
import {
    IJobsListProps,
    IJobsListStyleProps,
    IJobsListStyles
} from './JobsList.types';
import { getStyles } from './JobsList.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';

const getClassNames = classNamesFunction<
    IJobsListStyleProps,
    IJobsListStyles
>();

const JobsList: React.FC<IJobsListProps> = (props) => {
    const { styles } = props;

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return <div className={classNames.root}>Hello JobsList!</div>;
};

export default styled<IJobsListProps, IJobsListStyleProps, IJobsListStyles>(
    JobsList,
    getStyles
);
