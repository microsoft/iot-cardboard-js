import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import JobsAdapter from '../../Adapters/JobsAdapter';
import { IJob } from '../../Models/Constants/Interfaces';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface IJobsWrapperProps {
    adapter: JobsAdapter | MockAdapter;
    listOfJobs: IJob[];
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IJobsWrapperStyleProps, IJobsWrapperStyles>;
}

export interface IJobsWrapperStyleProps {
    theme: IExtendedTheme;
}
export interface IJobsWrapperStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsWrapperSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJobsWrapperSubComponentStyles {}
