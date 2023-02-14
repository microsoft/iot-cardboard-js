import React from 'react';
import {
    IJobsListWrapperProps,
    IJobsListWrapperStyleProps,
    IJobsListWrapperStyles
} from './JobsListWrapper.types';
import { getStyles } from './JobsListWrapper.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';

const getClassNames = classNamesFunction<
    IJobsListWrapperStyleProps,
    IJobsListWrapperStyles
>();

const JobsListWrapper: React.FC<IJobsListWrapperProps> = (props) => {
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

    return <div className={classNames.root}>Hello JobsListWrapper!</div>;
};

export default styled<
    IJobsListWrapperProps,
    IJobsListWrapperStyleProps,
    IJobsListWrapperStyles
>(JobsListWrapper, getStyles);
