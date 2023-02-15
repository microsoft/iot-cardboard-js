import React from 'react';
import {
    IJobsDialogProps,
    IJobsDialogStyleProps,
    IJobsDialogStyles
} from './JobsDialog.types';
import { getStyles } from './JobsDialog.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';

const getClassNames = classNamesFunction<
    IJobsDialogStyleProps,
    IJobsDialogStyles
>();

const JobsDialog: React.FC<IJobsDialogProps> = (props) => {
    const { styles } = props;

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return <div className={classNames.root}>Hello JobsDialog!</div>;
};

export default styled<
    IJobsDialogProps,
    IJobsDialogStyleProps,
    IJobsDialogStyles
>(JobsDialog, getStyles);
