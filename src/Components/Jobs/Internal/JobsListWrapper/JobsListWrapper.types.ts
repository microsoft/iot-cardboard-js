import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IJobsListWrapperProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IJobsListWrapperStyleProps,
        IJobsListWrapperStyles
    >;
}

export interface IJobsListWrapperStyleProps {
    theme: ITheme;
}
export interface IJobsListWrapperStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsListWrapperSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJobsListWrapperSubComponentStyles {}
