import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import JobsAdapter from '../../Adapters/JobsAdapter';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface IJobsContainerProps {
    adapter: JobsAdapter | MockAdapter;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IJobsContainerStyleProps,
        IJobsContainerStyles
    >;
}

export interface IJobsContainerStyleProps {
    theme: IExtendedTheme;
}
export interface IJobsContainerStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsContainerSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJobsContainerSubComponentStyles {}
