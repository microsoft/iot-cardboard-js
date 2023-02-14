import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IJobsListProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IJobsListStyleProps, IJobsListStyles>;
}

export interface IJobsListStyleProps {
    theme: ITheme;
}
export interface IJobsListStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsListSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJobsListSubComponentStyles {}
